import axios from 'axios';
import { AxiosResponse } from 'axios';
import { revenueCatRecognizeUser } from 'features/pro/revenueCat.helpers';
import formurlencoded from 'form-urlencoded';
import { getPlatform, isApp, isAppiOs } from 'helpers/device.helpers';
import { userIsPro } from 'mondosurf-library/helpers/pro.helpers';
import { store } from 'mondosurf-library/redux/store';
import {
    logOut,
    setAccessToken,
    setAccountType,
    setAccountVerified,
    setApprovedTerms,
    setAuthorizedTracking,
    setCapacitorRefreshToken,
    setFavoriteSpots,
    setLevel,
    setLogin,
    setPreferences,
    setRegistrationDate,
    setSurfboards,
    setSurfingFrom,
    setTimezoneDST,
    setTimezoneId,
    setTimezoneUTC,
    setTrialActivation,
    setTrialDuration,
    setUserEmail,
    setUserId,
    setUserName,
    setUserPictureUrl
} from 'mondosurf-library/redux/userSlice';
import toastService from 'mondosurf-library/services/toastService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { JWT_API_URL } from 'proxies/localConstants';
import { deleteLocalStorageData, setLocalStorageData } from 'proxies/localStorage.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';

/**
 * Calls the API to check if the sent email is existing or not.
 * If it is existing the user wants to login.
 * It it is not existing the user wants to register.
 *
 * Endpoint: 'mail-check'
 *
 * @param   {string} email Email that must be checked to see if it exists.
 *
 * @returns {Promise} Response is true if the mail exists, false if it doesn't exist.
 */
export const emailCheck = (email: string) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'mail-check',
        data: formurlencoded({
            email: email
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response: AxiosResponse) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * Calls the API to login the user, creating the auth and refresh tokens.
 *
 * Endpoint: 'auth'
 *
 * @param   {string} email Email of the user.
 * @param   {string} password Password.
 * @param   {string} deviceId Unique id of the device.
 * @param   {string} name The name of the user (currently only used for Google Auth).
 * @param   {string} pictureUrl The URL of the picture (currently only used for Google Auth).
 * @param   {bool} googleAuth If to use the Google authentication (currently only used for Google Auth).
 * @param   {string} googleAuthId The unique Google ID (currently only used for Google Auth).
 *
 * @returns {Promise} Response contains all the users's data if he was correctly logged in.
 */
export const login = (
    email: string,
    password: string,
    deviceId: string,
    name?: string,
    pictureUrl?: string,
    googleAuth?: boolean,
    googleAuthId?: string
) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'auth',
        data: formurlencoded({
            email: email,
            password: password,
            device_id: deviceId,
            platform: getPlatform(),
            name: name,
            picture_url: pictureUrl,
            google_auth: googleAuth,
            google_auth_id: googleAuthId
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(async (response) => {
            if (response.status === 200 && response.data.user_id) {
                updateUserStatus(response);
                Tracker.identifyUser(response.data.user_id);
                // iOS: Logs in the user to Revenue Cat
                if (isAppiOs()) revenueCatRecognizeUser(response.data.user_id);
                return response;
            } else {
                store.dispatch(setLogin('no'));
            }
        })
        .catch(function (error) {
            store.dispatch(setLogin('no'));
            throw error;
        });
};

/**
 * Logs out the user.
 *
 * Endpoint: 'revoke'
 *
 * @param   {string} accessToken Access JWT token stored in Redux.
 * @param   {string} deviceId Unique id of the device.
 *
 * @returns {Promise} Response.success is true if the user was correctly logged out.
 */
export const logout = (accessToken: string, deviceId: string) => {
    // iOs and Android refresh token handling.
    const state = store.getState();
    const storageRefreshToken: string = state.user.capacitorRefreshToken; // Redux.

    /* store.dispatch(
        addDebugLogItem(
            'Calling revoke. access_token: ' +
                accessToken +
                ', device_id: ' +
                deviceId +
                ', platform: ' +
                getPlatform() +
                ', storageRefreshToken: ' +
                storageRefreshToken
        )
    ); */

    return axios({
        method: 'post',
        url: JWT_API_URL! + 'revoke',
        withCredentials: true, // Cookies should be included in cross-site requests
        data: formurlencoded({
            access_token: accessToken,
            device_id: deviceId,
            platform: getPlatform(),
            refresh_token: storageRefreshToken
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            if (response.status === 200) {
                handleActualLogout('User intentionally logged out');
                return response;
            }
        })
        .catch(function (error) {
            handleActualLogout('User intentionally logged out');
            throw error;
        });
};

/**
 * Refreshes the access and refresh token.
 *
 * Endpoint: 'refresh-token'
 *
 * @param   {string} accessToken Access JWT token stored in Redux.
 * @param   {string} deviceId Unique id of the device.
 *
 * @returns {Promise} Response.success is true if the the token was refreshed correctly. All needed data are sent with response.
 */
export const refreshToken = (accessToken: string, deviceId: string) => {
    const state = store.getState();
    // iOs and Android refresh token handling.
    const storageRefreshToken: string = state.user.capacitorRefreshToken; // Redux.
    const appIsOnline: boolean = state.appStatus.online; // Redux

    if (isApp() && !appIsOnline) {
        toastService.error(mondoTranslate('toast.offline'), 'data-test-offline', 4000);
        return Promise.reject('App offline');
    } else {
        return axios({
            method: 'post',
            url: JWT_API_URL! + 'refresh-token',
            withCredentials: true, // Cookies should be included in cross-site requests
            data: formurlencoded({
                access_token: accessToken,
                device_id: deviceId,
                platform: getPlatform(),
                refresh_token: storageRefreshToken
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    if (response && response.data.success === true) {
                        store.dispatch(setAccessToken(response.data.access_token)); // To redux state
                        if (isApp()) {
                            setLocalStorageData('refresh_token', response.data.refresh_token);
                            store.dispatch(setCapacitorRefreshToken(response.data.refresh_token)); // To redux state
                        }
                    } else {
                        handleActualLogout('Refresh token failed', response);
                    }
                    return response;
                }
            })
            .catch(function (error) {
                handleActualLogout('Refresh token failed (error)', error);
                throw error;
            });
    }
};

/**
 * Checks if the user is logged in when the app opens on a specific device.
 * This function verifies the user's authentication status using a stored refresh token.
 * If valid, it updates the user's status and identifies the user in tracking.
 * If authentication fails, it dispatches a logout action and optionally clears local storage
 * depending on the platform.
 *
 * @param {string} deviceId - Unique identifier for the current device; required for re-authentication.
 *
 * @returns {Promise<void>} - A promise resolving after the re-authentication process completes.
 */
export const checkIfUserIsLoggedOnOpen = (deviceId: string, userId: number | null) => {
    if (deviceId === '') {
        return Promise.reject(new Error('Device ID is required for authentication.'));
    }

    // iOs and Android refresh token handling
    const state = store.getState();
    const storageRefreshToken: string = state.user.capacitorRefreshToken; // Redux

    return axios({
        method: 'post',
        url: JWT_API_URL! + 're-auth',
        withCredentials: true, // Cookies should be included in cross-site requests
        data: formurlencoded({
            device_id: deviceId,
            user_id: userId,
            platform: getPlatform(),
            refresh_token: storageRefreshToken
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            if (response.status === 200 && response.data.success === true && response.data.user_id) {
                updateUserStatus(response);
                Tracker.identifyUser(response.data.user_id);
                // iOS: Logs in the user to Revenue Cat
                if (isAppiOs()) revenueCatRecognizeUser(response.data.user_id);
            } else {
                handleActualLogout('checkIfUserIsLoggedOnOpen failed', response);
            }
        })
        .catch(function (error) {
            handleActualLogout('checkIfUserIsLoggedOnOpen failed (error)', error);
        });
};

/**
 * Calls the API to register the user.
 * The newly created user is also logged, creating the auth and refresh tokens.
 *
 * Endpoint: 'user-register'
 *
 * @param   {string} name Name of the user.
 * @param   {string} email The email of the user.
 * @param   {string} password The password of the user.
 * @param   {string} deviceId Unique id of the device.
 * @returns {Promise} Promise object where response has all the data of the user.
 */
export const userRegister = (
    name: string,
    email: string,
    password: string,
    termsConditions: boolean,
    deviceId: string
) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'user-register',
        data: formurlencoded({
            name: name,
            email: email,
            password: password,
            terms: termsConditions,
            device_id: deviceId,
            platform: getPlatform()
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            if (response.status === 200) {
                updateUserStatus(response, true);
                if (response.data.user_id) Tracker.identifyUser(response.data.user_id);
                return response;
            } else {
                handleActualLogout('userRegister failed', response);
            }
        })
        .catch(function (error) {
            handleActualLogout('userRegister failed (error)', error);
            throw error;
        });
};

/**
 * Calls the API to confirm the user account, given the one time token passed in the URL.
 *
 * Endpoint: 'confirm-account'
 *
 * @param   {string} token One time token.
 * @returns {Promise} Promise object where response.success is true if the account was confirmed.
 */
export const confirmAccount = (token: string) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'confirm-account',
        data: formurlencoded({
            token: token
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            return response;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * The user is requesting another email to confirm the account.
 * Usually triggered by the toast which says the user that the account must be confirmed.
 *
 * Endpoint: 'request-account-confirmation-email'
 *
 * @param   {number} userId Id of the user.
 * @returns {Promise} Promise object where response.success is true if the email was sent correctly.
 */
export const requestAccountConfirmationEmail = (userId: number) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'request-account-confirmation-email',
        data: formurlencoded({
            user_id: userId
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            return response;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * Calls the API to send the user an email to reset the password.
 *
 * Endpoint: 'request-password-reset'
 *
 * @param   {string} email The email of the user.
 * @returns {Promise} Promise object where response.success is true if the email was sent correctly.
 */
export const requestPasswordResetEmailApi = (email: string) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'request-password-reset',
        data: formurlencoded({
            email: email
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            return response;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * Calls the API create a new password for the user.
 * The user is retrieved by the one time JWT token.
 *
 * Endpoint: 'password-reset'
 *
 * @param   {string} token One time JWT token (not the access token).
 * @param   {string} newPassword The new password for the user.
 * @returns {Promise} Promise object where response.success is true if the password was changed.
 */
export const passwordReset = (token: string, newPassword: string) => {
    return axios({
        method: 'post',
        url: JWT_API_URL! + 'password-reset',
        data: formurlencoded({
            token: token,
            new_password: newPassword
        }),
        withCredentials: true, // Cookies should be included in cross-site requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((response) => {
            return response;
        })
        .catch(function (error) {
            throw error;
        });
};

/**
 * Updates the user Redux status with the response from the server after login,
 * re-authentication and registration.
 *
 * @param   {AxiosResponse<any>} response The response coming from the server.
 * @param   {boolean} registration True if the function is used during the user registration.
 *
 * @returns {returnType} Return description.
 */
export const updateUserStatus = (response: AxiosResponse<any>, registration: boolean = false) => {
    // To redux state.
    store.dispatch(setAccessToken(response.data.access_token));
    store.dispatch(setUserId(response.data.user_id));
    store.dispatch(setUserName(response.data.user_name));
    store.dispatch(setUserEmail(response.data.user_email));
    if (response.data.user_picture_url) store.dispatch(setUserPictureUrl(response.data.user_picture_url));
    store.dispatch(setAccountVerified(response.data.account_verified));
    store.dispatch(setApprovedTerms(response.data.approved_terms));
    store.dispatch(setAuthorizedTracking(response.data.authorized_tracking));
    store.dispatch(setRegistrationDate(response.data.registration_date));
    store.dispatch(setAccountType(response.data.account_type));
    if (response.data.user_trial_activation_date)
        store.dispatch(setTrialActivation(response.data.user_trial_activation_date));
    if (response.data.user_trial_duration) store.dispatch(setTrialDuration(response.data.user_trial_duration));

    // Only if first time registration
    if (registration) {
        store.dispatch(setFavoriteSpots([])); // Always inits an empty array (to replace null value)
    }

    // Data available only for users who login (and don't register for the first time)
    if (!registration) {
        store.dispatch(setFavoriteSpots(response.data.favourite_spots ? response.data.favourite_spots : []));
        if (response.data.timezone_id) store.dispatch(setTimezoneId(response.data.timezone_id));
        if (response.data.timezone_utc) store.dispatch(setTimezoneUTC(response.data.timezone_utc));
        if (response.data.timezone_dst) store.dispatch(setTimezoneDST(response.data.timezone_dst));
        if (response.data.user_level) store.dispatch(setLevel(response.data.user_level));
        if (response.data.user_surfing_from) store.dispatch(setSurfingFrom(response.data.user_surfing_from));
        if (response.data.user_surfboards) store.dispatch(setSurfboards(response.data.user_surfboards));
        if (response.data.user_bulletin_frequency && response.data.user_bulletin_week_day)
            store.dispatch(
                setPreferences({
                    userBulletinFrequency: response.data.user_bulletin_frequency,
                    userBulletinWeekDay: response.data.user_bulletin_week_day
                })
            );
        if (
            response.data.account_type === 'pro' &&
            response.data.user_subscription_expiration_date &&
            response.data.user_subscription_duration
        ) {
            userIsPro(
                response.data.user_product_id,
                response.data.user_subscription_expiration_date,
                response.data.user_subscription_duration,
                response.data.user_pro_service,
                response.data.user_stripe_user_id,
                response.data.user_stripe_subscription_id
            );
        }

        // ! TODO If iOS we can check for purchases status
    }

    // We also store the user id in the local storage, used for the re-auth
    setLocalStorageData('user', response.data.user_id.toString());

    // Handling of the refresh token is different on mobile App.
    if (isApp()) {
        setLocalStorageData('refresh_token', response.data.refresh_token);
        store.dispatch(setCapacitorRefreshToken(response.data.refresh_token));
    }

    store.dispatch(setLogin('yes'));
};

/**
 * Logs out the user and performs necessary cleanup actions based on platform.
 *
 * This function dispatches a logout action to update the Redux state and, if the app is running
 * on a mobile platform, clears the refresh token from local storage and resets it in the Redux store.
 *
 * @returns {void}
 */
export const handleActualLogout = (why?: string, whyObject?: any): void => {
    // toastService.emoji('Loggin out: ' + why, '🛟', '', 10000);
    store.dispatch(logOut()); // Redux
    if (isApp()) {
        deleteLocalStorageData('refresh_token');
        store.dispatch(setCapacitorRefreshToken('')); // Redux
    }
};

/**
 * Sends a request to trigger the account verification email for the current user.
 *
 * This function retrieves the user ID from the Redux store and, if valid,
 * initiates an account confirmation email request. Upon success or failure,
 * it displays a toast notification to inform the user of the outcome.
 *
 * @returns {void}
 */
export const requestAccountVerificationEmail = (): void => {
    const state = store.getState();
    const userId: number = state.user.userId; // Redux.
    if (userId !== -1) {
        requestAccountConfirmationEmail(userId)
            .then((response) => {
                toastService.success(mondoTranslate('toast.auth.verification_email_sent'));
            })
            .catch((error) => {
                toastService.error(mondoTranslate('toast.auth.verification_email_sent_error'));
            });
    }
};
