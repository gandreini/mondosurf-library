import axios from 'axios';
import formurlencoded from 'form-urlencoded';
import { getPlatform2, isApp } from 'helpers/device.helpers';
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
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform2(), refresh_token: storageRefreshToken };
    } else { // Web.
        params = { ...params, access_token: accessToken, device_id: deviceId, platform: getPlatform2() };
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
 * Fires a GET api call to a given endpoint.
 * 
 * @param   {string} url Endpoint to be called.
 * @param   {object} params Object with parameters to send.
 * @returns {Promise}
 */
export const getApiCall = async (url: string, params: object): Promise<any> => {
    return axios({
        method: 'get',
        url: PUBLIC_API_URL_V1! + url,
        params: { ...params },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => response)
        .catch(error => error);
}