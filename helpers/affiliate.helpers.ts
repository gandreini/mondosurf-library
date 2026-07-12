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

/**
 * Travelpayouts deep-link identifiers for the Booking.com program (approved
 * 2026-07-06, this project's marker 744664). `campaign_id`/`p` identify the
 * Booking program within TP; `trs` is the traffic source for the Mondo project.
 * Read from the dashboard's "Full link" form of a generated Booking link.
 */
const BOOKING_TP = { campaignId: '84', p: '2076', marker: '744664', trs: '544505' } as const;

/**
 * Wrap a full booking.com deep link in the tp.media redirect so the tap is
 * attributed to marker 744664. Attribution happens via this redirect (it mints
 * a per-click id and applies the marker) — NOT via any `aid=` on the booking.com
 * URL — so the destination MUST be routed through tp.media, never linked direct.
 * The whole destination URL is URL-encoded into `u=` (tp.media decodes it once),
 * which keeps its own lat/lng/date query params intact. `sub_id` carries the
 * destination for TP-side reporting, independent of the consent-gated in-house
 * tracking (trackAffiliateLinkTap).
 */
function wrapBookingTp(destinationUrl: string, subId: string): string {
    const params = new URLSearchParams({
        campaign_id: BOOKING_TP.campaignId,
        p: BOOKING_TP.p,
        marker: BOOKING_TP.marker,
        trs: BOOKING_TP.trs,
        sub_id: subId,
        u: destinationUrl,
    });
    return `https://tp.media/r?${params.toString()}`;
}

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
    // hotel: route the Booking deep link through Travelpayouts (program approved
    // 2026-07-06). Same coords-centered search as before — now wrapped in tp.media
    // so the tap is attributed to marker 744664. See wrapBookingTp.
    const dest = coords
        ? `https://www.booking.com/searchresults.html?latitude=${coords.lat}&longitude=${coords.lng}&dest_type=latlong&radius=20&order=distance_from_search`
        : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(place)}`;
    return wrapBookingTp(dest, place);
}
