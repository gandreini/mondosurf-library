// ! Google Auth

import { isAppAndroid } from "helpers/device.helpers";
import { GoogleService } from "helpers/GoogleService";
import { callApi } from "mondosurf-library/api/api";
import { login } from "mondosurf-library/helpers/auth.helpers";
import modalService from "mondosurf-library/services/modalService";
import toastService from "mondosurf-library/services/toastService";
import { GOOGLE_CLIENT_ID, JWT_API_URL } from "proxies/localConstants";
import { mondoTranslate } from "proxies/mondoTranslate";

import { generateSecurePassword } from "./user.helpers";

// Google web: Displays the Google button for web
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

// Google web: Google button click handler for web
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
                        console.log('Something wrong');
                    });
            } else {
                console.log('Something wrong');
            }
        })
        .catch((error) => console.log('Something wrong', error));
};

// Google app: Google button click handler for App
export const onClickStaticGoogleButton = async (currentLocation: string, deviceId: string) => {

    const googleService = new GoogleService();

    const token = await googleService.login();

    if (token) {
        console.log("User signed in with token:", token);
        googleService.verifyToken(token, deviceId).then(loginResponse => {
            modalService.closeModal();
            toastService.success(
                mondoTranslate('auth.welcome_back')
            );
        }).catch(error => {
            modalService.closeModal();
            toastService.error(
                mondoTranslate('auth.welcome_back')
            );
        });
    } else {
        console.log("Google sign-in failed");
    }


    if (isAppAndroid()) {
        /* setLocalStorageData('url_to_redirect_after_google_login', currentLocation);
        const authUrl =
            `https://accounts.google.com/o/oauth2/auth` +
            `?client_id=${GOOGLE_CLIENT_ID}` +
            `&redirect_uri=https://mondo.surf/google-login-succeeded` +
            `&response_type=token` +
            `&scope=profile email`;

        await Browser.open({ url: authUrl }); */
    } else {
        // window.open(authUrl, '_blank', 'toolbar=no,location=yes');
        /* const res = await SocialLogin.login({
            provider: 'google',
            options: {}
        })

        const profile = res.result.profile as {
            email: string;
            givenName: string;
            imageUrl: string;
            id: string;
        }; // Type assertion to ensure the correct structure

        // Call to login
        login(profile.email, generateSecurePassword(), deviceId, profile.givenName, profile.imageUrl, true, profile.id)
            .then((loginResponse) => {
                if (loginResponse && loginResponse.data) {
                    // handleRedirect();
                    modalService.closeModal();
                    toastService.success(
                        mondoTranslate('auth.welcome_back', { name: loginResponse.data.user_name })
                    );
                } else {
                    // handleLoginError(); // ! Handle the error
                }
            })
            .catch((error) => {
                // handleLoginError(); // ! Handle the error
            }); */
    }
};