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
 * Builds the urlencoded body for POST /spot-subscription-subscribe/. The server
 * expects `form_ts` as unix SECONDS (it compares against its own time for the
 * min-time-to-submit bot check), while the client tracks the render time in ms.
 */
export function buildSubscribePayload(
    email: string,
    spotId: number,
    formRenderedAtMs: number,
    website: string,
    sourceUrl: string
): Record<string, string | number> {
    return {
        email: email.trim(),
        spot_id: spotId,
        form_ts: Math.floor(formRenderedAtMs / 1000),
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
