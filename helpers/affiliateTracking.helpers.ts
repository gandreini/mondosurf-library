/**
 * Consent-aware tracking for the affiliate card. Separate from the pure
 * affiliate.helpers.ts because it imports the shared Tracker (redux + mixpanel),
 * which must not be pulled into unit tests. Verified live in Mixpanel at the
 * metrics-check step, not by unit tests.
 *
 * The two event names are first-class members of the shared TrackingEvent enum,
 * so both web and app fire the same events. Tracker stamps platform + os on every
 * Mixpanel event (commonProperties), which is what makes the per-platform
 * tap-rate comparison possible. Tracker snake-cases these for GA4:
 * 'Affiliate Link_Tap' -> affiliate_link_tap, 'Affiliate Widget_Show' ->
 * affiliate_widget_show (GA4 no-ops in the app WebView — Mixpanel is the source).
 */

import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { Tracker } from 'mondosurf-library/tracker/tracker';

import type { AffiliateKind, RiverBTemplate } from './affiliate.helpers';

interface AffiliateEventContext {
    spotId: number;
    template: RiverBTemplate;
}

/** Host of an affiliate URL, for the tracking payload (falls back to the raw value). */
function destinationHost(href: string): string {
    try {
        return new URL(href).host;
    } catch {
        return href;
    }
}

/**
 * Fire the outbound-click event before the link opens. Routes through the
 * consent-aware Tracker to GA4 + Mixpanel.
 */
export function trackAffiliateLinkTap(ctx: AffiliateEventContext, kind: AffiliateKind, href: string): void {
    Tracker.trackEvent(['mp', 'ga'], TrackingEvent.AffiliateLinkTap, {
        spot_id: ctx.spotId,
        template: ctx.template,
        kind,
        destination_host: destinationHost(href)
    });
}

/** Fire the in-viewport impression event once per page view. */
export function trackAffiliateWidgetShow(ctx: AffiliateEventContext): void {
    Tracker.trackEvent(['mp', 'ga'], TrackingEvent.AffiliateWidgetShow, {
        spot_id: ctx.spotId,
        template: ctx.template
    });
}
