import { mondoTranslate } from 'proxies/mondoTranslate';

/**
 * Provide and intelligible text for a given error code, provided by the API.
 * 
 * @param   {string} $error Error code.
 * @returns {string} i18n string with the translatable error.
 */
export function apiErrorsTranslation($error: string): string {
    switch ($error) {
        case 'EMAIL_REQUIRED': {
            return mondoTranslate('api_errors.email_required');
        }
        case 'DOMAIN_NOT_ALLOWED': {
            return mondoTranslate('api_errors.domain_not_allowed');
        }
        case 'PASSWORD_REQUIRED': {
            return mondoTranslate('api_errors.password_required');
        }
        case 'ACCESS_TOKEN_REQUIRED': {
            return mondoTranslate('api_errors.access_token_required');
        }
        case 'ACCESS_TOKEN_NOT_DECODED': {
            return mondoTranslate('api_errors.access_token_not_decoded');
        }
        case 'DEVICEID_REQUIRED': {
            return mondoTranslate('api_errors.deviceid_required');
        }
        case 'REFRESH_TOKEN_REQUIRED': {
            return mondoTranslate('api_errors.refresh_token_required');
        }
        case 'EMAIL_NOT_CORRESPONDING_TO_USER': {
            return mondoTranslate('api_errors.email_not_corresponding_to_user');
        }
        case 'CORRESPONDING_USER_NOT_FOUND': {
            return mondoTranslate('api_errors.corresponding_user_not_found');
        }
        case 'USER_NOT_PRO': {
            return mondoTranslate('api_errors.user_not_pro');
        }
        case 'EMAIL_PASSWORD_NOT_MATCH': {
            return mondoTranslate('api_errors.email_password_not_match');
        }
        case 'NAME_REQUIRED': {
            return mondoTranslate('api_errors.name_required');
        }
        case 'EMAIL_ALREADY_EXIST': {
            return mondoTranslate('api_errors.email_already_exist');
        }
        case 'USERNAME_ALREADY_EXIST': {
            return mondoTranslate('api_errors.username_already_exist');
        }
        case 'TERMS_REQUIRED': {
            return mondoTranslate('api_errors.terms_required');
        }
        case 'ERROR_REGISTERING_USER': {
            return mondoTranslate('api_errors.error_registering_user');
        }
        case 'ACCOUNT_CONFIRMATION_TOKEN_REQUIRED': {
            return mondoTranslate('api_errors.account_confirmation_token_required');
        }
        case 'ACCOUNT_DISABLED': {
            return mondoTranslate('api_errors.account_disabled');
        }
        case 'GENERIC_ERROR': {
            return mondoTranslate('api_errors.generic_error');
        }
    }
    return mondoTranslate('api_errors.generic_error');
}