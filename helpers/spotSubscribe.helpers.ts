/**
 * Pure helpers for the no-account per-spot subscribe form (spot-email-alerts).
 *
 * Kept import-free (like affiliate.helpers) so the whole request/response
 * contract is unit-testable without React, the Tracker, or module aliases. The
 * component maps each outcome `state` to the TrackingEvent it fires; the helper
 * itself never references the tracking enum.
 */

export type SubscribeUiState = 'success' | 'already' | 'cap' | 'error';

export interface SubscribeOutcome {
    /** Which visual state the form should show. */
    state: SubscribeUiState;
    /** mondoTranslate key for the message to display. */
    messageKey: string;
}

/**
 * Builds the urlencoded body for POST /spot-subscription-subscribe/.
 * `website` is the honeypot field (kept empty by real users).
 */
export function buildSubscribePayload(
    email: string,
    spotId: number,
    website: string,
    sourceUrl: string
): Record<string, string | number> {
    return {
        email: email.trim(),
        spot_id: spotId,
        website,
        source_url: sourceUrl
    };
}

/**
 * Maps a 2xx response body to a UI outcome. `already_subscribed` is surfaced
 * honestly (decision D1) instead of a fake "check your inbox"; every other
 * success (`pending`, or a codeless bot silent-success) is the standard success.
 */
export function mapSubscribeSuccess(res: { code?: string; [key: string]: unknown } | null | undefined): SubscribeOutcome {
    if (res && res.code === 'already_subscribed') {
        return { state: 'already', messageKey: 'spotSubscribe.already_text' };
    }
    return { state: 'success', messageKey: 'spotSubscribe.success_text' };
}

/**
 * Maps a rejected call (callApiNew throws the response body `{code, message,
 * data:{status}}`) to a UI outcome. `cap_reached` gets its own state so the
 * component can show the account-upgrade CTA; everything else is a plain error
 * with a code-specific message where we have one.
 */
export function mapSubscribeError(err: { code?: string; [key: string]: unknown } | null | undefined): SubscribeOutcome {
    const code = err && err.code;
    switch (code) {
        case 'cap_reached':
            return { state: 'cap', messageKey: 'spotSubscribe.error_cap_reached' };
        case 'rate_limited':
            return { state: 'error', messageKey: 'spotSubscribe.error_rate_limited' };
        case 'invalid_email':
            return { state: 'error', messageKey: 'spotSubscribe.error_email_invalid' };
        default:
            return { state: 'error', messageKey: 'spotSubscribe.error_generic' };
    }
}

/**
 * True only when a rejected callApiNew is a genuine 404 (a foreign/unknown
 * token) — NOT a 5xx or a network failure (`callApiNew` throws `new Error(...)`
 * for those, with no `data`). The token-probe uses this so a transient error on
 * one endpoint never mislabels a valid link as "invalid".
 */
export function isNotFoundError(err: unknown): boolean {
    if (!err || typeof err !== 'object') {
        return false;
    }
    const e = err as { code?: string; data?: { status?: number } };
    if (e.data && e.data.status === 404) {
        return true;
    }
    return e.code === 'invalid_token';
}

// --- Confirm page (P3.4) ----------------------------------------------------

export type ConfirmUiState = 'confirmed' | 'already' | 'expired' | 'cap' | 'error';

export interface ConfirmOutcome {
    state: ConfirmUiState;
    messageKey: string;
}

/** POST /spot-subscription-confirm/ success body → confirm-page state. */
export function mapConfirmSuccess(res: { code?: string; [key: string]: unknown } | null | undefined): ConfirmOutcome {
    if (res && res.code === 'already_confirmed') {
        return { state: 'already', messageKey: 'spotSubscribe.confirm_already' };
    }
    return { state: 'confirmed', messageKey: 'spotSubscribe.confirm_success' };
}

/** Rejected confirm (callApiNew throws the body) → confirm-page state. */
export function mapConfirmError(err: { code?: string; [key: string]: unknown } | null | undefined): ConfirmOutcome {
    switch (err && err.code) {
        case 'token_expired':
            return { state: 'expired', messageKey: 'spotSubscribe.confirm_expired' };
        case 'cap_reached':
            return { state: 'cap', messageKey: 'spotSubscribe.error_cap_reached' };
        case 'invalid_token':
            return { state: 'error', messageKey: 'spotSubscribe.confirm_invalid' };
        default:
            return { state: 'error', messageKey: 'spotSubscribe.confirm_error' };
    }
}
