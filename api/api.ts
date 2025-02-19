import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import formurlencoded from 'form-urlencoded';
import { getPlatform, isApp } from 'helpers/device.helpers';
import jwt_decode from 'jwt-decode';
import { refreshToken } from 'mondosurf-library/helpers/auth.helpers';
import IAccessToken from 'mondosurf-library/model/iAccessToken';
import { store } from 'mondosurf-library/redux/store';
import { setCapacitorRefreshToken } from 'mondosurf-library/redux/userSlice';
import { PUBLIC_API_URL_V1 } from 'proxies/localConstants';

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
        if (Math.floor(Date.now() / 1000) > (decodedToken.exp - 60)) {
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
        if (Math.floor(Date.now() / 1000) > (decodedToken.exp - 60)) {
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

/**
 * Makes an API call to a specified endpoint with the given method and parameters.
 * 
 * @param   {string} url - The endpoint to be called. If `fullUrl` is true, this should be the complete URL.
 * @param   {"GET" | "POST" | "DELETE"} method - The HTTP method to use for the request.
 * @param   {Record<string, any>} [params={}] - An object containing the parameters to send with the request. 
 *                                               For GET requests, these will be sent as query parameters; 
 *                                               for POST and DELETE requests, they will be sent in the request body.
 * @param   {Record<string, string>} [customHeaders={}] - Optional custom headers to include in the request.
 * @param   {boolean} [credentials=false] - Indicates whether to include credentials (cookies) in the request.
 * @param   {boolean} [fullUrl=false] - If true, the `url` parameter is treated as a complete URL; 
 *                                       otherwise, it is appended to the base URL defined by `PUBLIC_API_URL_V1`.
 * @returns {Promise<any>} - A promise that resolves to the data returned from the API call, or rejects with an error.
 * 
 * @throws {Error} - Throws an error if the API call fails or if the response contains an error.
 */
export const callApiNew = async (
    url: string,
    method: "GET" | "POST" | "DELETE",
    params: Record<string, any> = {},
    customHeaders: Record<string, string> = {},
    credentials: boolean = false,
    fullUrl: boolean = false
): Promise<any> => {
    try {
        // Create a headers object based on customHeaders
        const headers: Record<string, string> = { ...customHeaders };
        if (method !== "GET") {
            headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        const config: AxiosRequestConfig = {
            method,
            url: fullUrl ? url : PUBLIC_API_URL_V1! + url,
            /* headers: {
                "Content-Type": method === "GET" ? "application/json" : "application/x-www-form-urlencoded",
                ...customHeaders
            }, */
            headers,
            ...(method === "GET" ? { params } : { data: formurlencoded(params) }),
            withCredentials: credentials
        };

        const response: AxiosResponse = await axios(config);
        return response.data; // Return only the data, not the full response
    } catch (error: any) {
        console.error("API Call Error:", error?.response?.data || error.message);
        throw error?.response?.data || new Error("API call failed");
    }
}

/**
 * Makes an authenticated API call to a specified endpoint with the given method and parameters.
 * 
 * This function retrieves the access token from the Redux store, checks if it is about to expire, 
 * and refreshes it if necessary before making the API call. The parameters for the API call are 
 * constructed to include the access token, device ID, and platform information.
 * 
 * @param   {string} url - The endpoint to be called. This should be the relative URL to be appended 
 *                         to the base URL defined by `PUBLIC_API_URL_V1`.
 * @param   {"GET" | "POST" | "DELETE"} method - The HTTP method to use for the request.
 * @param   {Record<string, any>} [params={}] - An object containing the parameters to send with the request. 
 *                                               For GET requests, these will be sent as query parameters; 
 *                                               for POST and DELETE requests, they will be sent in the request body.
 * @returns {Promise<any>} - A promise that resolves to the data returned from the API call, or rejects with an error.
 * 
 * @throws {Error} - Throws an error if the access token is invalid, if the token refresh fails, 
 *                   or if the API call fails.
 */
export const callApiAuth = async (url: string, method: "GET" | "POST" | "DELETE", params: Record<string, any> = {}) => {
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
        try {
            const response = await refreshToken(accessToken, deviceId);

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

    return callApiNew(url, method, params, {}, true);
}
