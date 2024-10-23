// Client
'use client';

import { AxiosResponse } from 'axios';
import TermsPrivacy from 'components/TermsPrivacy';
import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { apiErrorsTranslation } from 'mondosurf-library/helpers/apiErrors.helpers';
import { emailCheck, login, requestPasswordResetEmailApi, userRegister } from 'mondosurf-library/helpers/auth.helpers';
import { checkIfEmailIsValid } from 'mondosurf-library/helpers/strings.helpers';
import { inputCursorAtTheEnd } from 'mondosurf-library/helpers/various.helpers';
import useKeypress from 'mondosurf-library/hooks/useKeypress';
import { LoginModalContext } from 'mondosurf-library/model/loginModalContext';
import { RootState } from 'mondosurf-library/redux/store';
import modalService from 'mondosurf-library/services/modalService';
import toastService from 'mondosurf-library/services/toastService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useRouterProxy } from 'proxies/useRouter';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface IAuth {
    callback?: (accessToken?: string, userName?: string) => void;
    context?: LoginModalContext;
}

const Auth: React.FC<IAuth> = (props: IAuth) => {
    // React router
    const router = useRouterProxy();

    // React hook form stuff
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
        getValues,
        setValue,
        trigger,
        formState: { errors }
    } = useForm({ reValidateMode: 'onSubmit' });

    const [formState, setFormState] = useState<
        | 'email'
        | 'email_waiting'
        | 'login'
        | 'login_loading'
        | 'register'
        | 'register_loading'
        | 'logged'
        | 'request_password_reset'
        | 'request_password_reset_waiting'
        | 'request_password_reset_sent'
    >('email');

    const [passwordShown, setPasswordShown] = useState(false);

    // Redux
    const logged = useSelector((state: RootState) => state.user.logged);
    const deviceId = useSelector((state: RootState) => state.appConfig.device_id);

    useKeypress(
        'Enter',
        () => {
            if (formState === 'login') {
                // Manual form validation, onLogin is called if the form is ok
                const formValidation = trigger(['loginEmail', 'loginPassword'], { shouldFocus: true });
                formValidation.then((response) => {
                    if (response) onLogin();
                });
            } else if (formState === 'register') {
                // Manual form validation, onRegister is called if the form is ok
                const formValidation = trigger(
                    ['registerName', 'registerEmail', 'registerPassword', 'registerTermsConditions'],
                    {
                        shouldFocus: true
                    }
                );
                formValidation.then((response) => {
                    if (response) onRegister();
                });
            } else if (formState === 'request_password_reset') {
                // Manual form validation, onRegister is called if the form is ok
                const formValidation = trigger(['requestPasswordResetEmail'], {
                    shouldFocus: true
                });
                formValidation.then((response) => {
                    if (response) onRequestPasswordReset();
                });
            } else if (formState === 'logged') {
                modalService.closeModal();
            }
        },
        formState
    );

    useEffect(() => {
        // Initialize Google Sign-In API
        const google = (window as any).google;

        if (google) {
            google.accounts.id.initialize({
                client_id: '882575910142-bdjkr3i1oo74sh6euou39uokd2dq0utn.apps.googleusercontent.com', // Replace with your Google Client ID
                callback: handleGoogleSignIn
            });

            google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
                theme: 'outline',
                size: 'large'
            });
        }

        setFocus('email');
        setTimeout(() => setFocus('email'), 100); // Not very nice, but to be sure the focus works.
    }, []);

    const handleGoogleSignIn = (response: any) => {
        // Google JWT Token
        const credential = response.credential;

        // You can further verify the credential on your server, or use it in your client logic
        // Decode JWT to get user info (optional)
        const decodedToken = JSON.parse(atob(credential.split('.')[1]));
        // setUser(decodedToken);
        console.log('Google user:', decodedToken);
    };

    // Triggered when formState changes
    useEffect(() => {
        if (formState === 'email' || formState === 'email_waiting') {
            // modalService.updateTitle({ title: mondoTranslate('auth.modal_title') });
        }
        // Tracking.
        if (formState === 'email') {
            setTimeout(() => setFocus('email'), 100);
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalEmailShow, {
                context: props.context
            });
        }
        if (formState === 'login' || formState === 'login_loading') {
            modalService.updateTitle({ title: mondoTranslate('basics.login') });
        }
        // Tracking.
        if (formState === 'login') {
            setTimeout(() => setFocus('loginPassword'), 100);
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalLoginShow, {
                context: props.context
            });
        }
        if (formState === 'register' || formState === 'register_loading') {
            modalService.updateTitle({ title: mondoTranslate('basics.register') });
        }
        // Tracking.
        if (formState === 'register') {
            setTimeout(() => setFocus('registerName'), 100);
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalSignupShow, {
                context: props.context
            });
        }
        if (
            formState === 'request_password_reset' ||
            formState === 'request_password_reset_waiting' ||
            formState === 'request_password_reset_sent'
        ) {
            setFocus('requestPasswordResetEmail');
            modalService.updateTitle({ title: mondoTranslate('basics.reset_password') });
        }
    }, [formState]);

    // First check that verifies if the email exists
    // If it exists the user is sent to the login form
    // If it doesn't exist, the user is sent to the signup form
    const onEmailCheck = () => {
        const emailValue: string = getValues('email');
        setFormState('email_waiting');
        //Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalEmailTap, { context: props.context });
        emailCheck(emailValue)
            .then((response: AxiosResponse<any, any> | undefined) => {
                if (response && response.data) {
                    //Tracking.
                    Tracker.trackEvent(['mp', 'ga'], TrackingEvent.EmailCheckApi, {
                        context: props.context,
                        next: 'login'
                    });
                    setFormState('login');
                    setFocus('loginPassword');
                    setValue('loginEmail', emailValue);
                } else {
                    //Tracking.
                    Tracker.trackEvent(['mp', 'ga'], TrackingEvent.EmailCheckApi, {
                        context: props.context,
                        next: 'register'
                    });
                    setFormState('register');
                    setFocus('registerName');
                    setValue('registerEmail', emailValue);
                }
            })
            .catch(function (error) {
                if (
                    error.response &&
                    (error.response.data.code === 'EMAIL_REQUIRED' || error.response.data.code === 'DOMAIN_NOT_ALLOWED')
                ) {
                    setError('email', {
                        type: 'wrongEmail',
                        message: apiErrorsTranslation(error.response.data.code)
                    });
                    setFormState('email');
                } else {
                    setError('email', {
                        type: 'wrongEmail',
                        message: apiErrorsTranslation('GENERIC_ERROR')
                    });
                    setFormState('email');
                }
                //Tracking.
                Tracker.trackEvent(['mp'], TrackingEvent.ModalEmailErr, {
                    type: 'apiResponseError',
                    code: error.response.data.code,
                    message: apiErrorsTranslation(error.response.data.code)
                });
            });
    };

    // Error handling for Email submit
    const onEmailCheckError = (errors: Object, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
        //Tracking.
        Tracker.trackEvent(['mp'], TrackingEvent.ModalEmailErr, {
            type: 'frontendError'
        });
    };

    // Login request is sent to the "auth" endpoint
    const onLogin = () => {
        if (deviceId !== '') {
            const loginEmail: string = getValues('loginEmail');
            const loginPassword: string = getValues('loginPassword');
            setFormState('login_loading');
            //Tracking.
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalLoginTap, { context: props.context });
            login(loginEmail, loginPassword, deviceId)
                .then((response) => {
                    if (response && response.data) {
                        modalService.closeModal();
                        toastService.success(mondoTranslate('auth.welcome_back', { name: response.data.user_name }));
                        if (props.callback) props.callback(response.data.access_token, response.data.user_name); // Callback is invoked only after registration.
                        //Tracking.
                        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.LoginCompleteApi, {
                            context: props.context
                        });
                    } else {
                        setError('loginForm', {
                            type: 'wrongLoginForm',
                            message: mondoTranslate('auth.errors.error_login')
                        });
                        //Tracking.
                        Tracker.trackEvent(['mp'], TrackingEvent.ModalLoginErr, {
                            type: 'apiResponseError',
                            message: mondoTranslate('auth.errors.error_login')
                        });
                    }
                })
                .catch(function (error) {
                    setFormState('login');
                    if (
                        error.response.data.code === 'EMAIL_NOT_CORRESPONDING_TO_USER' ||
                        error.response.data.code === 'EMAIL_REQUIRED'
                    ) {
                        setFocus('loginEmail');
                        setError('loginEmail', {
                            type: 'wrongEmail',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else if (
                        error.response.data.code === 'PASSWORD_REQUIRED' ||
                        error.response.data.code === 'EMAIL_PASSWORD_NOT_MATCH'
                    ) {
                        setFocus('loginPassword');
                        setError('loginPassword', {
                            type: 'wrongPassword',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else {
                        setError('loginForm', {
                            type: 'wrongLoginForm',
                            message: apiErrorsTranslation('GENERIC_ERROR')
                        });
                    }
                    //Tracking.
                    Tracker.trackEvent(['mp'], TrackingEvent.ModalLoginErr, {
                        type: 'apiResponseError',
                        code: error.response.data.code,
                        message: apiErrorsTranslation(error.response.data.code)
                    });
                });
        } else {
            // ! TODO Throw an error here
        }
    };

    // Error handling for Login form
    const onLoginError = (errors: Object, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
        //Tracking.
        Tracker.trackEvent(['mp'], TrackingEvent.ModalLoginErr, {
            type: 'frontendError'
        });
    };

    // Register a new user
    const onRegister = () => {
        if (deviceId !== '') {
            const registerName: string = getValues('registerName');
            const registerEmail: string = getValues('registerEmail');
            const registerPassword: string = getValues('registerPassword');
            const registerTermsConditions: boolean = getValues('registerTermsConditions');
            setFormState('register_loading');
            //Tracking.
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalSignupTap, { context: props.context });
            userRegister(registerName, registerEmail, registerPassword, registerTermsConditions, deviceId)
                .then((response) => {
                    if (response && response.data) {
                        modalService.closeModal();
                        toastService.success(mondoTranslate('auth.welcome', { name: response.data.user_name }));
                        if (props.callback) props.callback(response.data.access_token, response.data.user_name);

                        //Tracking.
                        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.SignupCompleteApi, {
                            context: props.context
                        });

                        router.push('/trial-confirmed');
                    } else {
                        setError('registerForm', {
                            type: 'wrongRegisterForm',
                            message: mondoTranslate('auth.errors.error_registration')
                        });

                        //Tracking.
                        Tracker.trackEvent(['mp'], TrackingEvent.ModalSignupErr, {
                            type: 'apiResponseError',
                            message: mondoTranslate('auth.errors.error_registration')
                        });
                    }
                })
                .catch(function (error) {
                    if (error.response.data.code === 'NAME_REQUIRED') {
                        setFocus('registerName');
                        setError('registerName', {
                            type: 'wrongName',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else if (
                        error.response.data.code === 'EMAIL_ALREADY_EXIST' ||
                        error.response.data.code === 'EMAIL_REQUIRED' ||
                        error.response.data.code === 'DOMAIN_NOT_ALLOWED'
                    ) {
                        setFocus('registerEmail');
                        setError('registerEmail', {
                            type: 'wrongEmail',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else if (error.response.data.code === 'PASSWORD_REQUIRED') {
                        setFocus('registerPassword');
                        setError('registerPassword', {
                            type: 'wrongPassword',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else if (error.response.data.code === 'TERMS_REQUIRED') {
                        setError('registerTermsConditions', {
                            type: 'wrongTerms',
                            message: apiErrorsTranslation(error.response.data.code)
                        });
                    } else {
                        setError('registerForm', {
                            type: 'wrongRegisterForm',
                            message: apiErrorsTranslation('GENERIC_ERROR')
                        });
                    }
                    //Tracking.
                    Tracker.trackEvent(['mp'], TrackingEvent.ModalSignupErr, {
                        type: 'apiResponseError',
                        code: error.response.data.code,
                        message: apiErrorsTranslation(error.response.data.code)
                    });
                    setFormState('register');
                });
        } else {
            // ! TODO Throw an error here
        }
    };

    // Error handling for Registration form
    const onRegistrationError = (errors: Object, e?: BaseSyntheticEvent<object, any, any> | undefined) => {
        //Tracking.
        Tracker.trackEvent(['mp'], TrackingEvent.ModalSignupErr, {
            type: 'frontendError'
        });
    };

    // Sends the password reset email to the user
    const onRequestPasswordReset = () => {
        const requestPasswordResetEmail: string = getValues('requestPasswordResetEmail');
        setFormState('request_password_reset_waiting');
        requestPasswordResetEmailApi(requestPasswordResetEmail)
            .then((response) => {
                if (response && response.data.success === true) {
                    setFormState('request_password_reset_sent');
                    toastService.success(mondoTranslate('auth.password_reset_sent'));
                    setTimeout(function () {
                        modalService.closeModal();
                    }, 4000);
                } else {
                    setError('resetPasswordForm', {
                        type: 'wrongResetPasswordForm',
                        message: apiErrorsTranslation('GENERIC_ERROR')
                    });
                    setFocus('requestPasswordResetEmail');
                    setFormState('request_password_reset');
                }
            })
            .catch(function (error) {
                if (error.response.data.code === 'EMAIL_REQUIRED') {
                    setFocus('requestPasswordResetEmail');
                    setFormState('request_password_reset');
                    setError('resetPasswordForm', {
                        type: 'wrongEmail',
                        message: apiErrorsTranslation(error.response.data.code)
                    });
                } else {
                    setError('resetPasswordForm', {
                        type: 'wrongResetPasswordForm',
                        message: apiErrorsTranslation('GENERIC_ERROR')
                    });
                    setFocus('requestPasswordResetEmail');
                    setFormState('request_password_reset');
                }
            });
    };

    // Toggles password visibility in the password field
    // @param e React.MouseEvent
    const onTogglePasswordVisibility = (e: React.MouseEvent) => {
        setPasswordShown(passwordShown ? false : true);
        if (formState === 'login') {
            setFocus('loginPassword');
            const loginPasswordField = document.getElementById('login_password_field') as HTMLInputElement;
            inputCursorAtTheEnd(loginPasswordField);
        } else if (formState === 'register') {
            setFocus('registerPassword');
            const loginPasswordField = document.getElementById('register_password_field') as HTMLInputElement;
            inputCursorAtTheEnd(loginPasswordField);
        }
        e.preventDefault();
    };

    return (
        <div className="ms-auth">
            {/* Checking if user is logged or not */}
            {logged === 'checking' && <Loader />}

            {/* Email insert form */}
            {logged === 'no' && (formState === 'email' || formState === 'email_waiting') && (
                <>
                    {/* Render Google Sign-In Button */}
                    <div id="google-signin-button" onClick={handleGoogleSignIn}>
                        CLICK
                    </div>

                    {/*}<p className="ms-auth__intro-text ms-body-text">{mondoTranslate('auth.form.email_form_text')}</p>{*/}
                    <form
                        onSubmit={handleSubmit(onEmailCheck, onEmailCheckError)}
                        autoComplete="on"
                        data-test="auth-email-form">
                        <label className="ms-form__label" htmlFor="email_field">
                            {mondoTranslate('auth.form.email')}
                        </label>
                        <input
                            className={'ms-form__input' + (errors.email ? ' is-error ' : '')}
                            id="email_field"
                            type="email"
                            autoComplete="email"
                            data-test="auth-email-field"
                            {...register('email', {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value)
                            })}
                        />
                        {errors.email && errors.email.type === 'required' && (
                            <p className="ms-form__field-error">{mondoTranslate('auth.errors.email_required')}</p>
                        )}
                        {errors.email && errors.email.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-email-error-short">
                                {mondoTranslate('auth.errors.email_short')}
                            </p>
                        )}
                        {errors.email && errors.email.type === 'validate' && (
                            <p className="ms-form__field-error" data-test="auth-email-error-not-valid">
                                {mondoTranslate('auth.errors.email_verify')}
                            </p>
                        )}
                        {errors.email && errors.email.type === 'wrongEmail' && errors.email.message && (
                            <p className="ms-form__field-error">{errors.email.message.toString()}</p>
                        )}
                        <div className="ms-form__bottom-buttons ms-form__bottom-buttons-min-sizes">
                            <div className="ms-form__bottom-buttons-left">
                                <div
                                    className="ms-btn ms-btn-l"
                                    onClick={() => {
                                        modalService.closeModal();
                                    }}>
                                    {mondoTranslate('basics.cancel')}
                                </div>
                            </div>
                            <div className="ms-form__bottom-buttons-right">
                                <button
                                    type="submit"
                                    disabled={formState === 'email_waiting'}
                                    className="ms-btn ms-btn-cta ms-btn-l"
                                    data-test="auth-email-submit">
                                    {formState === 'email' && <>{mondoTranslate('auth.form.email_form_submit')}</>}
                                    {formState === 'email_waiting' && <Loader size="small" />}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="ms-form__afterform">
                        <span
                            className="ms-form__afterform-link"
                            data-test="auth-email-password-forgot"
                            onClick={() => {
                                setFormState('request_password_reset');
                                setValue('requestPasswordResetEmail', getValues('email'));
                            }}>
                            {mondoTranslate('auth.form.forgot_password')}
                        </span>
                    </div>
                </>
            )}

            {/* Login form */}
            {((logged === 'no' && (formState === 'login' || formState === 'login_loading')) ||
                (logged === 'yes' && formState === 'login_loading')) && (
                <>
                    {/*}<p className="ms-auth__intro-text ms-body-text">{mondoTranslate('auth.form.login_form_text')}</p>{*/}
                    <form onSubmit={handleSubmit(onLogin, onLoginError)} autoComplete="on" data-test="auth-login-form">
                        {errors.loginForm && errors.loginForm.type === 'wrongLoginForm' && errors.loginForm.message && (
                            <p className="ms-form__form-error">{errors.loginForm.message.toString()}</p>
                        )}
                        <label className="ms-form__label" htmlFor="login_email_field">
                            {mondoTranslate('auth.form.email')}
                        </label>
                        <input
                            className={'ms-form__input' + (errors.loginEmail ? ' is-error ' : '')}
                            id="login_email_field"
                            type="email"
                            autoComplete="email"
                            data-test="auth-login-email-field"
                            {...register('loginEmail', {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value)
                            })}
                        />
                        {errors.loginEmail && errors.loginEmail.type === 'required' && (
                            <p className="ms-form__field-error">{mondoTranslate('auth.errors.email_required')}</p>
                        )}
                        {errors.loginEmail && errors.loginEmail.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-login-error-short">
                                {mondoTranslate('auth.errors.email_short')}
                            </p>
                        )}
                        {errors.loginEmail && errors.loginEmail.type === 'validate' && (
                            <p className="ms-form__field-error" data-test="auth-login-error-not-valid">
                                {mondoTranslate('auth.errors.email_verify')}
                            </p>
                        )}
                        {errors.loginEmail && errors.loginEmail.type === 'wrongEmail' && errors.loginEmail.message && (
                            <p className="ms-form__field-error">{errors.loginEmail.message.toString()}</p>
                        )}
                        <label className="ms-form__label" htmlFor="login_password_field">
                            {mondoTranslate('auth.form.password ')}
                        </label>
                        <div className="ms-form__input-wrapper">
                            <input
                                className={'ms-form__input' + (errors.loginPassword ? ' is-error ' : '')}
                                id="login_password_field"
                                autoComplete="current-password"
                                data-test="auth-login-password-field"
                                type={passwordShown ? 'text' : 'password'}
                                {...register('loginPassword', {
                                    required: true,
                                    minLength: 8
                                })}
                            />
                            <div
                                tabIndex={-1}
                                className="ms-form__password-visibility-toggle ms-form__input-right-item"
                                onClick={onTogglePasswordVisibility}
                                data-test="auth-login-password-toggle">
                                {passwordShown && <>{mondoTranslate('auth.form.hide_password')}</>}
                                {!passwordShown && <>{mondoTranslate('auth.form.show_password')}</>}
                            </div>
                        </div>
                        {errors.loginPassword && errors.loginPassword.type === 'required' && (
                            <p className="ms-form__field-error" data-test="auth-login-error-password-missing">
                                {mondoTranslate('auth.errors.password_required')}
                            </p>
                        )}
                        {errors.loginPassword && errors.loginPassword.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-login-error-password-short">
                                {mondoTranslate('auth.errors.password_short')}
                            </p>
                        )}
                        {errors.loginPassword &&
                            errors.loginPassword.type === 'wrongPassword' &&
                            errors.loginPassword.message && (
                                <p className="ms-form__field-error" data-test="auth-login-error-password-wrong">
                                    {errors.loginPassword.message.toString()}
                                </p>
                            )}
                        <div className="ms-form__bottom-buttons ms-form__bottom-buttons-min-sizes">
                            <div className="ms-form__bottom-buttons-left ms-form__bottom-buttons-square">
                                <span
                                    className="ms-btn ms-btn-l"
                                    data-test="auth-login-back-button"
                                    onClick={() => {
                                        setFormState('email');
                                    }}>
                                    <Icon icon="angle-left" />
                                </span>
                            </div>
                            <div className="ms-form__bottom-buttons-right">
                                <button
                                    type="submit"
                                    disabled={formState === 'login_loading'}
                                    id="login_submit_button"
                                    className="ms-btn ms-btn-cta ms-btn-l"
                                    data-test="auth-login-submit">
                                    {formState === 'login' && <>{mondoTranslate('basics.login')}</>}
                                    {formState === 'login_loading' && <Loader size="small" />}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="ms-form__afterform">
                        <span
                            className="ms-form__afterform-link"
                            onClick={() => {
                                setFormState('request_password_reset');
                                setValue('requestPasswordResetEmail', getValues('loginEmail'));
                            }}>
                            {mondoTranslate('auth.form.forgot_password')}
                        </span>
                    </div>
                </>
            )}

            {/* Registration form */}
            {((logged === 'no' && (formState === 'register' || formState === 'register_loading')) ||
                (logged === 'yes' && formState === 'register_loading')) && (
                <>
                    <p className="ms-auth__intro-text ms-body-text">{mondoTranslate('auth.form.register_form_text')}</p>
                    <form onSubmit={handleSubmit(onRegister, onRegistrationError)} data-test="auth-registration-form">
                        {errors.registerForm &&
                            errors.registerForm.type === 'wrongRegisterForm' &&
                            errors.registerForm.message && (
                                <p className="ms-form__form-error">{errors.registerForm.message.toString()}</p>
                            )}
                        <label className="ms-form__label" htmlFor="register_name_field">
                            {mondoTranslate('auth.form.user_name')}
                        </label>
                        <input
                            className={'ms-form__input' + (errors.registerName ? ' is-error ' : '')}
                            id="register_name_field"
                            autoComplete="name"
                            type="text"
                            data-test="auth-registration-name-field"
                            placeholder={mondoTranslate('auth.form.user_name_placeholder')}
                            {...register('registerName', {
                                required: true,
                                minLength: 2
                            })}
                        />
                        {errors.registerName && errors.registerName.type === 'required' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-name-required">
                                {mondoTranslate('auth.errors.name_required')}
                            </p>
                        )}
                        {errors.registerName && errors.registerName.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-name-too-short">
                                {mondoTranslate('auth.errors.name_short')}
                            </p>
                        )}
                        {errors.registerName &&
                            errors.registerName.type === 'wrongName' &&
                            errors.registerName.message && (
                                <p className="ms-form__field-error" data-test="auth-registration-error-name-wrong">
                                    {errors.registerName.message.toString()}
                                </p>
                            )}
                        <label className="ms-form__label" htmlFor="register_email_field">
                            {mondoTranslate('auth.form.email')}
                        </label>
                        <input
                            className={'ms-form__input' + (errors.registerEmail ? ' is-error ' : '')}
                            id="register_email_field"
                            type="email"
                            autoComplete="email"
                            data-test="auth-registration-email-field"
                            {...register('registerEmail', {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value)
                            })}
                        />
                        {errors.registerEmail && errors.registerEmail.type === 'required' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-email-required">
                                {mondoTranslate('auth.errors.email_required')}
                            </p>
                        )}
                        {errors.registerEmail && errors.registerEmail.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-email-too-short">
                                {mondoTranslate('auth.errors.email_short')}
                            </p>
                        )}
                        {errors.registerEmail && errors.registerEmail.type === 'validate' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-email-not-valid">
                                {mondoTranslate('auth.errors.email_verify')}
                            </p>
                        )}
                        {errors.registerEmail &&
                            errors.registerEmail.type === 'wrongEmail' &&
                            errors.registerEmail.message && (
                                <p className="ms-form__field-error" data-test="auth-registration-error-email-wrong">
                                    {errors.registerEmail.message.toString()}
                                </p>
                            )}
                        <label className="ms-form__label" htmlFor="register_password_field">
                            {mondoTranslate('auth.form.password ')}
                        </label>
                        <div className="ms-form__input-wrapper">
                            <input
                                className={'ms-form__input' + (errors.registerPassword ? ' is-error ' : '')}
                                id="register_password_field"
                                autoComplete="current-password"
                                data-test="auth-registration-password-field"
                                type={passwordShown ? 'text' : 'password'}
                                placeholder="Choose a password"
                                {...register('registerPassword', {
                                    required: true,
                                    minLength: 8
                                })}
                            />
                            <div
                                tabIndex={-1}
                                className="ms-form__password-visibility-toggle ms-form__input-right-item"
                                data-test="auth-registration-password-toggle"
                                onClick={onTogglePasswordVisibility}>
                                {passwordShown && <>{mondoTranslate('auth.form.hide_password')}</>}
                                {!passwordShown && <>{mondoTranslate('auth.form.show_password')}</>}
                            </div>
                        </div>
                        {errors.registerPassword && errors.registerPassword.type === 'required' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-password-required">
                                {mondoTranslate('auth.errors.password_required')}
                            </p>
                        )}
                        {errors.registerPassword && errors.registerPassword.type === 'minLength' && (
                            <p className="ms-form__field-error" data-test="auth-registration-error-password-noo-short">
                                {mondoTranslate('auth.errors.password_short')}
                            </p>
                        )}
                        {errors.registerPassword &&
                            errors.registerPassword.type === 'wrongPassword' &&
                            errors.registerPassword.message && (
                                <p className="ms-form__field-error" data-test="auth-registration-error-password-wrong">
                                    {errors.registerPassword.message.toString()}
                                </p>
                            )}

                        {/* Activate this if explicit acceptance of terms is required */}
                        {/*}
                        <label className="ms-checkbox" htmlFor="register_terms_conditions_field">
                            <input
                                className={
                                    'ms-checkbox__check ms-form__checkbox' +
                                    (errors.registerTermsConditions ? ' is-error ' : '')
                                }
                                id="register_terms_conditions_field"
                                type="checkbox"
                                {...register('registerTermsConditions', {
                                    required: true
                                })}
                            />
                            <span className="ms-checkbox__label">{mondoTranslate('auth.form.register_terms_conditions')}</span>
                        </label>

                        {errors.registerTermsConditions && errors.registerTermsConditions.type === 'required' && (
                            <p className="ms-form__field-error">
                                {mondoTranslate('auth.errors.register_terms_conditions_accept_required')}
                            </p>
                        )}
                        {errors.registerTermsConditions && errors.registerTermsConditions.type === 'wrongTerms' && (
                            <p className="ms-form__field-error">{errors.registerTermsConditions.message}</p>
                        )}
                        {*/}

                        <div className="ms-form__subtext">
                            <small className="ms-small-text">
                                {mondoTranslate('auth.form.register_terms_privacy')} <TermsPrivacy />.
                            </small>
                        </div>

                        <div className="ms-form__bottom-buttons">
                            <div className="ms-form__bottom-buttons-left ms-form__bottom-buttons-square">
                                <span
                                    className="ms-btn ms-btn-l"
                                    data-test="auth-registration-back-button"
                                    onClick={() => {
                                        setFormState('email');
                                    }}>
                                    <Icon icon="angle-left" />
                                </span>
                            </div>
                            <div className="ms-form__bottom-buttons-right">
                                <button
                                    type="submit"
                                    disabled={formState === 'register_loading'}
                                    className="ms-btn ms-btn-cta ms-btn-l"
                                    data-test="auth-registration-submit">
                                    {formState === 'register' && mondoTranslate('auth.form.register_button')}
                                    {formState === 'register_loading' && <Loader size="small" />}
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            )}

            {/* Password reset form */}
            {logged === 'no' &&
                (formState === 'request_password_reset' || formState === 'request_password_reset_waiting') && (
                    <>
                        <p className="ms-auth__intro-text ms-body-text">
                            {mondoTranslate('auth.form.password_reset_form_text')}
                        </p>
                        <form onSubmit={handleSubmit(onRequestPasswordReset)} data-test="auth-password-reset-form">
                            {errors.resetPasswordForm &&
                                errors.resetPasswordForm.type === 'wrongResetPasswordForm' &&
                                errors.resetPasswordForm.message && (
                                    <p className="ms-form__form-error">{errors.resetPasswordForm.message.toString()}</p>
                                )}
                            <label className="ms-form__label" htmlFor="request_password_reset_email">
                                {mondoTranslate('auth.form.email')}
                            </label>
                            <input
                                className={'ms-form__input' + (errors.requestPasswordResetEmail ? ' is-error ' : '')}
                                id="request_password_reset_email"
                                type="email"
                                data-test="auth-password-reset-email-field"
                                autoComplete="email"
                                {...register('requestPasswordResetEmail', {
                                    required: true,
                                    minLength: 6,
                                    validate: (value) => checkIfEmailIsValid(value)
                                })}
                                onChange={() => clearErrors('requestPasswordResetEmail')}
                            />
                            {errors.requestPasswordResetEmail &&
                                errors.requestPasswordResetEmail.type === 'required' && (
                                    <p className="ms-form__field-error">
                                        {mondoTranslate('auth.errors.email_required')}
                                    </p>
                                )}
                            {errors.requestPasswordResetEmail &&
                                errors.requestPasswordResetEmail.type === 'minLength' && (
                                    <p className="ms-form__field-error">{mondoTranslate('auth.errors.email_short')}</p>
                                )}
                            {errors.requestPasswordResetEmail &&
                                errors.requestPasswordResetEmail.type === 'validate' && (
                                    <p className="ms-form__field-error">{mondoTranslate('auth.errors.email_verify')}</p>
                                )}
                            {errors.requestPasswordResetEmail &&
                                errors.requestPasswordResetEmail.type === 'wrongEmail' &&
                                errors.requestPasswordResetEmail.message && (
                                    <p className="ms-form__field-error">
                                        {errors.requestPasswordResetEmail.message.toString()}
                                    </p>
                                )}
                            <div className="ms-form__bottom-buttons">
                                <div className="ms-form__bottom-buttons-left ms-form__bottom-buttons-square">
                                    <span
                                        className="ms-btn ms-btn-l"
                                        data-test="auth-password-reset-back-button"
                                        onClick={() => {
                                            setFormState('email');
                                        }}>
                                        <Icon icon="angle-left" />
                                    </span>
                                </div>
                                <div className="ms-form__bottom-buttons-right">
                                    <button
                                        type="submit"
                                        disabled={formState === 'request_password_reset_waiting'}
                                        className="ms-btn ms-btn-cta ms-btn-l ms-btn-full"
                                        data-test="auth-password-reset-submit">
                                        {formState === 'request_password_reset' && (
                                            <>{mondoTranslate('auth.form.password_reset_form_submit')}</>
                                        )}
                                        {formState === 'request_password_reset_waiting' && <Loader size="small" />}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="ms-form__afterform">
                            <span
                                className="ms-form__afterform-link"
                                onClick={() => {
                                    setFormState('email');
                                }}>
                                {mondoTranslate('auth.form.password_reset_back')}
                            </span>
                        </div>
                    </>
                )}

            {/* Password reset was sent */}
            {logged === 'no' && formState === 'request_password_reset_sent' && (
                <>
                    <p className="ms-body-text">{mondoTranslate('auth.form.password_reset_success_text')}</p>
                    <div className="ms-form__bottom-buttons">
                        <div className="ms-form__bottom-buttons-left">
                            <button
                                className="ms-btn ms-btn-l"
                                onClick={() => {
                                    modalService.closeModal();
                                }}>
                                {mondoTranslate('auth.form.close')}
                            </button>
                        </div>
                        <div className="ms-form__bottom-buttons-right">
                            <button
                                className="ms-btn ms-btn-cta ms-btn-l"
                                onClick={() => {
                                    setFormState('email');
                                }}>
                                {mondoTranslate('auth.form.password_reset_back')}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* User is logged! */}
            {/*}{logged === 'yes' && formState === 'logged' && (
                <div className="ms-auth__logged">
                    <h2 className="ms-auth__logged-icon">{mondoTranslate('auth.form.logged_icon')}</h2>
                    <p className="ms-auth__logged-text">{mondoTranslate('auth.form.logged', { name: userName })}</p>
                    <button
                        className="ms-btn ms-btn-l ms-btn-full ms-btn-cta"
                        onClick={() => {
                            modalService.closeModal();
                        }}>
                        {mondoTranslate('auth.form.close')}
                    </button>
                </div>
            )}{*/}
        </div>
    );
};
export default Auth;
