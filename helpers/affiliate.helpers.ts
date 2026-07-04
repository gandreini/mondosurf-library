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

export interface AffiliateCoords {
    lat: number;
    lng: number;
}

/**
 * Resolve the coordinates the hotel search may be centered on. Returns null for
 * hide_location spots — a map search centered on the exact break would leak the
 * hidden location — and when coords are missing; buildAffiliateLink then falls
 * back to a destination-name search.
 */
export function resolveAffiliateCoords(spot: {
    lat?: number;
    lng?: number;
    hide_location?: boolean;
}): AffiliateCoords | null {
    if (spot.hide_location) return null;
    return typeof spot.lat === 'number' && typeof spot.lng === 'number' ? { lat: spot.lat, lng: spot.lng } : null;
}

/**
 * Build the outbound link for a program kind, targeted at `place`
 * (a resolved region/country) and, for hotels, `coords` when available.
 */
export function buildAffiliateLink(kind: AffiliateKind, place: string, coords?: AffiliateCoords | null): string {
    if (kind === 'activity') {
        const target = `https://www.klook.com/en-US/search/?query=${encodeURIComponent(place)}`;
        return `${KLOOK_REDIRECT}?aid=${encodeURIComponent(KLOOK_AID)}&k_site=${encodeURIComponent(target)}`;
    }
    // hotel: plain (non-affiliated) Booking search for now — the TP Booking program
    // is still pending approval (requested 2026-06-29). Shipped plain so the button
    // is live and taps are measured in-house (trackAffiliateLinkTap), giving the
    // click baseline the board asked for. Once TP approves, wrap this URL in the
    // tp.media deep link generated from the dashboard — only this branch changes.
    if (coords) {
        return `https://www.booking.com/searchresults.html?latitude=${coords.lat}&longitude=${coords.lng}&dest_type=latlong&radius=20&order=distance_from_search`;
    }
    return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place)}`;
}
