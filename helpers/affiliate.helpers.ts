/**
 * Pure helpers for the surf-travel affiliate card (River B pages / app screens).
 *
 * Pure + side-effect-free so it stays unit-testable — the consent-aware tracking
 * lives separately in affiliateTracking.helpers.ts (which imports the shared
 * Tracker). Shared from mondosurf-library so both mondosurf-web and mondosurf-app
 * mount the same card.
 */

export type AffiliateKind = 'hotel' | 'activity';
export type RiverBTemplate = 'guide' | 'full-forecast';

/**
 * Klook affiliate token, captured from the official Travelpayouts link for this
 * project (marker 744664). Reused to build per-destination deep links in code:
 * `affiliate.klook.com/redirect?aid=<token>&k_site=<klook search for region>`
 * lands the user on the region's activities AND preserves attribution
 * (`aff_pid=744664`, cookie-based on the publisher id). The token's per-click
 * hash only affects Travelpayouts' own click reporting, not the sale
 * attribution — monitored via the pending-commission KR. Slightly unofficial vs
 * generating one link per region in the dashboard; chosen for per-destination UX.
 */
const KLOOK_AID = 'api|13694|e4d22a4e60f242879f0f43b23-744664|pid|744664';
const KLOOK_REDIRECT = 'https://affiliate.klook.com/redirect';

export interface AffiliateDestinationInput {
    /** Surf region display name, e.g. "Lombok" (ISurfSpot.region_name). */
    region_name?: string;
    /** Country display name, e.g. "Indonesia" (ISurfSpot.country). */
    country?: string;
    /** Whether the precise break is hidden — does NOT hide region/country. */
    hide_location?: boolean;
}

/**
 * Resolve the travel destination term for a spot from its public region/country.
 * Prefers region (cleaner activity/hotel search), falls back to country, returns
 * null when neither is usable — in which case the card must not render.
 *
 * region/country are public even for hide_location spots (cf. spotMeta).
 */
export function resolveAffiliateDestination(spot: AffiliateDestinationInput): string | null {
    return spot.region_name?.trim() || spot.country?.trim() || null;
}

/**
 * Build the affiliate deep link for a program kind, targeted at `place`
 * (a resolved region/country), or null when that program isn't live yet.
 */
export function buildAffiliateLink(kind: AffiliateKind, place: string): string | null {
    if (kind === 'activity') {
        const target = `https://www.klook.com/en-US/search/?query=${encodeURIComponent(place)}`;
        return `${KLOOK_REDIRECT}?aid=${encodeURIComponent(KLOOK_AID)}&k_site=${encodeURIComponent(target)}`;
    }
    // hotel: Booking pending TP approval (requested 2026-06-29) — button hidden until then.
    return null;
}
