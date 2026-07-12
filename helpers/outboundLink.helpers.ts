import type { MouseEvent } from 'react';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { Tracker } from 'mondosurf-library/tracker/tracker';

/**
 * Shared handler for clicks on outbound links inside a spot/region description
 * (web + mobile). Finds the clicked anchor via event delegation, tracks the
 * click, and returns the outbound href so the caller can apply platform-specific
 * behaviour:
 *   - web:    let the anchor open normally (new tab)
 *   - mobile: event.preventDefault() + Capacitor Browser.open(href)
 *
 * Returns null when the click was not on an outbound http(s) link.
 */
export function trackDescriptionLinkClick(event: MouseEvent<HTMLElement>, spotId: number): string | null {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return null;

    const href = anchor.getAttribute('href') || '';
    if (!/^https?:/i.test(href)) return null;

    let destinationHost = href;
    try {
        destinationHost = new URL(href).host;
    } catch {
        /* keep raw href if it can't be parsed */
    }

    Tracker.trackEvent(['mp', 'ga'], TrackingEvent.SpotDescLinkTap, {
        spot_id: spotId,
        destination_host: destinationHost
    });

    return href;
}

/**
 * Classifies a description link by destination. Returns the INTERNAL path
 * (pathname + search + hash) when `href` points inside Mondo — an absolute
 * mondo.surf URL (any subdomain) or a root-relative path — so the caller can
 * navigate in-app via the router / same tab. Returns null for EXTERNAL links,
 * which the caller opens in a new tab (web) or the system browser (mobile).
 *
 * Pure and platform-agnostic on purpose: the same internal/external decision is
 * needed on web and mobile, and mirrors the WP-side link policy in
 * StringHelper::format_description(). Keep the one source of truth here.
 */
export function internalMondoPath(href: string): string | null {
    // Root-relative link (no host) is internal by definition.
    if (href.startsWith('/')) return href;

    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return null; // unparseable -> treat as external, let the caller handle it
    }

    return /(^|\.)mondo\.surf$/i.test(url.host) ? url.pathname + url.search + url.hash : null;
}
