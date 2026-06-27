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
