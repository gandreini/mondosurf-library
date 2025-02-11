import axios from 'axios';
import { getPlatform, isApp } from 'helpers/device.helpers';
import jwt_decode from 'jwt-decode';
import { refreshToken } from 'mondosurf-library/helpers/auth.helpers';
import IAccessToken from 'mondosurf-library/model/iAccessToken';
import { RootState } from 'mondosurf-library/redux/store';
import { PUBLIC_API_URL_V1 } from 'proxies/localConstants';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

interface IAxiosState {
    status: "init" | "loading" | "loaded" | "error" | "canceled" | "authError";
    payload?: any;
    error?: any;
    APIcode?: string;
    APImessage?: string;
    APIstatus?: string;
}

// Note: before calling this be sure to verify that the user is logged (if needed) in and the URL is defined.

export default function useAuthGetFetch(url: string, params?: any, needsAuth: boolean = false) {
    // Redux
    const userLogged = useSelector((state: RootState) => state.user.logged);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const storageRefreshToken = useSelector((state: RootState) => state.user.capacitorRefreshToken); // Used by ios and android.
    const deviceId = useSelector((state: RootState) => state.appConfig.device_id);

    // Abort controller to abort the fetch request.
    const source = axios.CancelToken.source();
    const [state, setState] = useState<IAxiosState>({ status: "init", error: null, payload: [] })

    // useEffect to launch the fetch.
    useEffect(() => {
        if (url && url !== '') {
            setState({ status: "loading", error: null, payload: [] });

            // Login status not defined.
            if (userLogged === "checking") {
                source.cancel('Api is being aborted due to user logged status not being defined.');
                setState({ ...state, status: "authError" });
                return;
            }

            // No authorization required and user not logged.
            if (!needsAuth && userLogged === "no") {
                getQuery(url, params);
            }

            // No authorization required, but user is logged.
            if (!needsAuth && userLogged === "yes") {
                const authParams = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform(), refresh_token: storageRefreshToken };
                getQuery(url, authParams, true);
            }

            // Authorization required, user not logged.
            if (needsAuth === true && userLogged === 'no') {
                source.cancel('Api is being aborted due to the user not being logged in');
                setState({ ...state, status: "authError" });
                return;
            }

            // Authorization required, empty access token.
            if (needsAuth === true && (accessToken === "" || accessToken === null)) {
                source.cancel('Api is being aborted due to access token not being defined');
                setState({ ...state, status: "authError" });
                return;
            }

            // Authorization required, ios/android, empty refresh token.
            if (needsAuth === true && isApp() && storageRefreshToken === '') {
                source.cancel('Api is being aborted due to refresh token not being defined');
                setState({ ...state, status: "authError" });
                return;
            }

            // Authorization required and user is logged.
            if (needsAuth === true && accessToken && userLogged === 'yes') {
                const decodedToken: IAccessToken = jwt_decode(accessToken);

                if (Math.floor(Date.now() / 1000) > (decodedToken.exp - 60)) {
                    // Token is expired: 100 seconds to anticipate the renewal of the token
                    setState({ ...state, status: "loading" });
                    refreshToken(accessToken, deviceId)
                        .then(response => {
                            if (response && response.data.success === true) {
                                if (isApp()) {
                                    const authParams = { ...params, access_token: response.data.access_token, device_id: deviceId, platform: getPlatform(), refresh_token: response.data.refresh_token }; // "refresh_token" used only by ios and android.
                                    getQuery(url, authParams, true);
                                } else {
                                    const authParams = { ...params, access_token: response.data.access_token, device_id: deviceId, platform: getPlatform() };
                                    getQuery(url, authParams, true);
                                }
                            } else {
                                setState({ ...state, status: "authError" });
                            }
                        }).catch(function (error) {
                            setState({ ...state, status: "authError", error: error, APImessage: error.message });
                        });
                } else {
                    // Token is still valid
                    if (isApp()) {
                        const authParams = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform(), refresh_token: storageRefreshToken }; // "refresh_token" used only by ios and android.
                        getQuery(url, authParams, true);
                    } else {
                        const authParams = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform() };
                        getQuery(url, authParams, true);
                    }
                }
            }
        }
    }, [url, userLogged]); // Fetch launched as the url changes.

    function getQuery(url: string, params?: any, credentials: boolean = false) {
        return axios({
            method: "get",
            url: PUBLIC_API_URL_V1 + url,
            params: { ...params },
            withCredentials: credentials,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function (response) {
                setState({ ...state, status: "loaded", payload: response.data });
            })
            .catch(function (error) {
                if (axios.isCancel(error)) {
                    setState({ ...state, status: "canceled", error: error, APImessage: error.message });
                } else {
                    if (error.response) {
                        // The request was made and the server responded with a status code that falls out of the range of 2xx.
                        setState({ ...state, status: "error", error: error, APIcode: error.response.data.code, APImessage: error.response.data.message, APIstatus: error.response.status });
                    } else if (error.request) {
                        // The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
                        // console.log('Error', error.request);
                        setState({ ...state, status: "error", error: error });
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        // console.log('Error', error.message);
                        setState({ ...state, status: "error", error: error });
                    }
                }
            });
    }
    return state;
}
