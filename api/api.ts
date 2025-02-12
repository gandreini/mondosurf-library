import axios from 'axios';
import formurlencoded from 'form-urlencoded';
import { getPlatform, isApp } from 'helpers/device.helpers';
import jwt_decode from 'jwt-decode';
import { refreshToken } from 'mondosurf-library/helpers/auth.helpers';
import IAccessToken from 'mondosurf-library/model/iAccessToken';
import { store } from 'mondosurf-library/redux/store';
import { setCapacitorRefreshToken } from 'mondosurf-library/redux/userSlice';
import { JWT_API_URL, PUBLIC_API_URL_V1 } from 'proxies/localConstants';

/**
 * Fires an authorized POST api call to a given endpoint.
 * 
 * @param   {string} url Endpoint to be called.
 * @param   {string} accessToken JWT token: if it is expired is renewed calling "refreshToken".
 * @param   {object} params Object with parameters to send.
 * @param   {boolean} credentials If "withCredentials" must be true.
 * @returns {Promise}
 */
export const postApiAuthCall = async (url: string, accessToken: string, params: object, credentials: boolean = true) => {
    const state = store.getState();
    const deviceId = state.appConfig.device_id;

    // Prepare query parameters, depending on the platform.
    if (isApp()) {
        // Retrieves refresh token from Redux.
        const state = store.getState();
        const storageRefreshToken: string = state.user.capacitorRefreshToken; // Redux.
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform(), refresh_token: storageRefreshToken };
    } else { // Web.
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform() };
    }

    // JWT token decoding.
    let decodedToken: IAccessToken;
    try {
        decodedToken = jwt_decode(accessToken);
    } catch (error) {
        console.error(error);
    }

    return new Promise((resolve, reject) => {
        if (Math.floor(Date.now() / 1000) > (decodedToken.exp - 1)) {
            // Token will be invalid soon: 100 seconds to anticipate the renewal of the token
            refreshToken(accessToken, deviceId)
                .then(response => {
                    if (response && response.data.success === true) {
                        params = { ...params, access_token: response.data.access_token };
                        if (isApp()) {
                            params = { ...params, refresh_token: response.data.refresh_token };
                            store.dispatch(setCapacitorRefreshToken(response.data.refresh_token)); // To redux state
                        }
                        // ! TODO Do we want to update: approved_terms, account_verified, account_type, favourite_spots_ids?
                        axios({
                            method: 'post',
                            url: PUBLIC_API_URL_V1! + url,
                            withCredentials: credentials,
                            data: formurlencoded(params),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                            .then(response => {
                                resolve(response);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }
                }).catch(error => {
                    reject(error);
                });
        } else {
            // Token is still valid
            return axios({
                method: 'post',
                url: PUBLIC_API_URL_V1! + url,
                withCredentials: credentials,
                data: formurlencoded(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

/**
 * Fires an authorized DELETE api call to a given endpoint.
 * 
 * @param   {string} url Endpoint to be called.
 * @param   {string} accessToken JWT token: if it is expired is renewed calling "refreshToken".
 * @param   {object} params Object with parameters to send.
 * @param   {boolean} credentials If "withCredentials" must be true.
 * @returns {Promise}
 */
export const deleteApiAuthCall = async (url: string, accessToken: string, params: object, credentials: boolean = true) => {
    const state = store.getState();
    const deviceId = state.appConfig.device_id;

    // Prepare query parameters, depending on the platform.
    if (isApp()) {
        // Retrieves refresh token from Redux.
        const state = store.getState();
        const storageRefreshToken: string = state.user.capacitorRefreshToken; // Redux.
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform(), refresh_token: storageRefreshToken };
    } else { // Web.
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform() };
    }

    // JWT token decoding.
    let decodedToken: IAccessToken;
    try {
        decodedToken = jwt_decode(accessToken);
    } catch (error) {
        console.error(error);
    }

    return new Promise((resolve, reject) => {
        if (Math.floor(Date.now() / 1000) > (decodedToken.exp - 1)) {
            // Token will be invalid soon: 100 seconds to anticipate the renewal of the token
            refreshToken(accessToken, deviceId)
                .then(response => {
                    if (response && response.data.success === true) {
                        params = { ...params, access_token: response.data.access_token };
                        if (isApp()) {
                            params = { ...params, refresh_token: response.data.refresh_token };
                            store.dispatch(setCapacitorRefreshToken(response.data.refresh_token)); // To redux state
                        }
                        // ! TODO Do we want to update: approved_terms, account_verified, account_type, favourite_spots_ids?
                        axios({
                            method: 'DELETE',
                            url: PUBLIC_API_URL_V1! + url,
                            withCredentials: credentials,
                            data: formurlencoded(params),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                            .then(response => {
                                resolve(response);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }
                }).catch(error => {
                    reject(error);
                });
        } else {
            // Token is still valid
            return axios({
                method: 'DELETE',
                url: PUBLIC_API_URL_V1! + url,
                withCredentials: credentials,
                data: formurlencoded(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

/**
 * Call an API endpoint.
 * 
 * @param   {string} url The FULL endpoint to be called.
 * @param   {"GET" | "POST"} method GET, POST
 * @param   {object} params Object with parameters to send.
 * @param   {object} [customHeaders] Optional custom headers to include in the request.
 * @returns {Promise}
 */
export const callApi = async (url: string, method: "GET" | "POST", params: object, customHeaders?: object): Promise<any> => {
    return axios({
        method: method,
        url: url,
        params: { ...params },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...customHeaders
        }
    })
        .then(response => response)
        .catch(error => error);
}

export const callApiAuth = async (url: string, method: "GET" | "POST" | "DELETE", params: object, credentials: boolean = true) => {
    const state = store.getState();
    const deviceId = state.appConfig.device_id;
    let accessToken: string = state.user.accessToken;

    params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform() };
    if (isApp()) { params = { ...params, refresh_token: state.user.capacitorRefreshToken }; }

    // JWT token decoding
    let decodedToken: IAccessToken;
    try {
        decodedToken = jwt_decode(accessToken);
    } catch (error) {
        console.error(error);
        throw new Error("Invalid access token");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // Refresh token if expired
    if (decodedToken.exp - 60 < currentTime) { // Token will be invalid soon: 60 seconds to anticipate the renewal of the token
        console.log("Token expired", params);
        try {
            const response = await refreshToken(accessToken, deviceId);

            console.log("response", response);

            if (response && response.data.success) {
                params = { ...params, access_token: response.data.access_token };

                if (isApp() && response.data.refresh_token) {
                    params = { ...params, refresh_token: response.data.refresh_token };
                    store.dispatch(setCapacitorRefreshToken(response.data.refresh_token));
                }
            } else {
                console.error("Token Refresh Error");
                throw new Error("Token refresh failed");
            }
        } catch (error) {
            console.error("Token Refresh Error:", error);
            throw error;
        }
    }

    // return callApi(url, method, params, {}, credentials);
}



/* export const callApiAuth = async (url: string, method: "GET" | "POST" | "DELETE", params: object, credentials: boolean = true) => {
    const state = store.getState();
    const deviceId = state.appConfig.device_id;
    let accessToken: string = state.user.accessToken;

    params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform() };
    if (isApp()) { params = { ...params, refresh_token: state.user.capacitorRefreshToken }; }

    // JWT token decoding
    let decodedToken: IAccessToken;
    try {
        decodedToken = jwt_decode(accessToken);
    } catch (error) {
        console.error(error);
        throw new Error("Invalid access token");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // Refresh token if expired
    if (decodedToken.exp - 60 < currentTime) { // Token will be invalid soon: 60 seconds to anticipate the renewal of the token
        console.log("Token expired", params);
        try {
            const response = await refreshToken(accessToken, deviceId);

            console.log("response", response);

            if (response && response.data.success) {
                params = { ...params, access_token: response.data.access_token };

                if (isApp() && response.data.refresh_token) {
                    params = { ...params, refresh_token: response.data.refresh_token };
                    store.dispatch(setCapacitorRefreshToken(response.data.refresh_token));
                }
            } else {
                console.error("Token Refresh Error");
                throw new Error("Token refresh failed");
            }
        } catch (error) {
            console.error("Token Refresh Error:", error);
            throw error;
        }
    }

    return callApi(url, method, params, {}, credentials);
} */

/**
 * Call an API endpoint.
 * 
 * @param   {string} url The FULL endpoint to be called.
 * @param   {"GET" | "POST"} method GET, POST, DELETE
 * @param   {object} params Object with parameters to send.
 * @param   {object} [customHeaders] Optional custom headers to include in the request.
 * @returns {Promise}
 */
/* export const callApi = async (url: string, method: "GET" | "POST" | "DELETE", params: object = {}, customHeaders: object = {}, credentials: boolean = false, fullUrl: boolean = false): Promise<any> => {

    return axios({
        method: method,
        url: fullUrl ? url : PUBLIC_API_URL_V1! + url,
        ...(method === "GET" ? { params: params } : { data: formurlencoded(params) }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...customHeaders
        },
        withCredentials: credentials,
    })
        .then(response => response)
        .catch(error => error);
} */