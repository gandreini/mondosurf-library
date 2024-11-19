import { SocialLogin } from "@capgo/capacitor-social-login";
import { callApi } from "mondosurf-library/api/api";
import { login } from "mondosurf-library/helpers/auth.helpers";
import { generateSecurePassword } from "mondosurf-library/helpers/user.helpers";
import modalService from "mondosurf-library/services/modalService";
import toastService from "mondosurf-library/services/toastService";
import { GOOGLE_CLIENT_ID, JWT_API_URL } from "proxies/localConstants";
import { deleteLocalStorageData, setLocalStorageData } from "proxies/localStorage.helpers";
import { mondoTranslate } from "proxies/mondoTranslate";

// GOOGLE WEB: Displays the Google button for web
export const addGoogleButton = (deviceId: string, callback?: (accessToken?: string, userName?: string) => void) => {
    const google = (window as any).google;

    if (google) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            context: 'signin',
            ux_mode: 'popup',
            callback: (response: any) => {
                handleWebGoogleSignIn(response, deviceId, callback);
            }
        });

        google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
            theme: 'outline',
            size: 'large',
            logo_alignment: 'center'
        });

        // google.accounts.id.prompt(); // Display the One Tap dialog
    }
};

// GOOGLE WEB: Google button click handler for web
export const handleWebGoogleSignIn = (response: any, deviceId: string, callback?: (accessToken?: string, userName?: string) => void) => {

    // Google JWT Token
    const credential = response.credential;

    // Decode JWT to get user info
    const decodedToken = JSON.parse(atob(credential.split('.')[1]));

    // Verification of the credential on the server
    callApi(JWT_API_URL! + 'verify-google-token', 'POST', { id_token: credential })
        .then((response) => {
            if (response.data.success === true) {
                // The password is only used if a new user is created
                login(
                    decodedToken.email,
                    generateSecurePassword(),
                    deviceId,
                    decodedToken.given_name,
                    decodedToken.picture,
                    true,
                    decodedToken.sub
                )
                    .then((response) => {
                        if (response && response.data) {
                            modalService.closeModal();
                            toastService.success(
                                mondoTranslate('auth.welcome_back', { name: response.data.user_name })
                            );
                            if (callback) callback(response.data.access_token, response.data.user_name); // Callback is invoked only after registration.
                        }
                    })
                    .catch((error) => {
                        handleLoginError();
                    });
            } else {
                handleLoginError();
            }
        })
        .catch((error) => handleLoginError());
};

// GOOGLE APP: Google button click handler for App
export const onClickStaticGoogleButton = async (deviceId: string, callback?: (accessToken?: string, userName?: string) => void) => {

    setLocalStorageData('google_auth_in_progress', 'true');

    const res = await SocialLogin.login({
        provider: 'google',
        options: {}
    })

    const profile = res.result.profile as {
        email: string;
        givenName: string;
        imageUrl: string;
        id: string;
    }; // Type assertion to ensure the correct structure

    login(profile.email, generateSecurePassword(), deviceId, profile.givenName, profile.imageUrl, true, profile.id)
        .then((loginResponse) => {
            if (loginResponse && loginResponse.data) {
                // handleRedirect();
                modalService.closeModal();
                toastService.success(
                    mondoTranslate('auth.welcome_back', { name: loginResponse.data.user_name })
                );
                if (callback) callback(loginResponse.data.access_token, loginResponse.data.user_name);
            } else {
                handleLoginError();
            }
        })
        .catch((error) => {
            handleLoginError();
        });
};

/**
 * Handles login errors by performing the following actions:
 * 1. Deletes the 'google_auth_in_progress' entry from local storage to indicate that the login process has ended.
 * 2. Closes any open modal dialogs to provide a clean user interface.
 * 3. Displays an error message to the user indicating that the login attempt has failed.
 */
const handleLoginError = () => {
    deleteLocalStorageData('google_auth_in_progress');
    modalService.closeModal();
    toastService.error(mondoTranslate('auth.errors.error_login'));
};