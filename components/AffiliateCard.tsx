'use client';

import { AffiliateCoords, AffiliateKind, buildAffiliateLink, RiverBTemplate } from 'mondosurf-library/helpers/affiliate.helpers';
import { trackAffiliateLinkTap, trackAffiliateWidgetShow } from 'mondosurf-library/helpers/affiliateTracking.helpers';
import { useEffect, useRef } from 'react';

interface IAffiliateCard {
    spotId: number;
    template: RiverBTemplate;
    /** Region (else country) label — already resolved by the caller (non-empty). */
    destinationLabel: string;
    /**
     * Spot coordinates for the hotel search — already resolved by the caller via
     * resolveAffiliateCoords (null for hide_location spots, so the hotel link
     * falls back to a destination-name search and never leaks the break).
     */
    coords?: AffiliateCoords | null;
    /**
     * How to open the outbound link. Omitted on web → the link is a real
     * <a target="_blank"> and the browser opens a new tab. Provided in the native
     * app → the tap is intercepted and routed through @capacitor/browser (opening
     * in the in-app WebView would replace the SPA and trap the user).
     */
    openHref?: (href: string) => void;
}

interface Program {
    kind: AffiliateKind;
    emoji: string;
    title: string;
    cta: string;
}

// Hotel only (the v2-gate predictor) — live as a plain Booking search (unaffiliated
// until TP approves, see buildAffiliateLink). The Klook activity banner was dropped
// as noise; its link builder stays in affiliate.helpers.ts if it ever comes back.
const PROGRAMS: Program[] = [{ kind: 'hotel', emoji: '🏨', title: 'Where to stay', cta: 'Find hotels' }];

/**
 * Native surf-travel affiliate card on River B pages/screens. Renders one
 * outbound card per live program. Shown to everyone — the tracking calls
 * self-gate on consent inside Tracker.trackEvent, so non-consented users see
 * the card but fire no events. Shared by mondosurf-web and mondosurf-app — the
 * only platform difference is how the outbound link opens (see `openHref`).
 */
export default function AffiliateCard({ spotId, template, destinationLabel, coords, openHref }: IAffiliateCard) {
    const cardRef = useRef<HTMLDivElement>(null);
    const shownRef = useRef(false);

    // Impression event — fire once when the card enters the viewport.
    useEffect(() => {
        const el = cardRef.current;
        if (!el || shownRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting) && !shownRef.current) {
                    shownRef.current = true;
                    trackAffiliateWidgetShow({ spotId, template });
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [spotId, template]);

    const programs = PROGRAMS.map((p) => ({ ...p, href: buildAffiliateLink(p.kind, destinationLabel, coords) }));

    // Track the tap, then let the browser follow the link (web) or hand off to the
    // system browser (app). One handler, so both platforms share identical markup.
    const handleTap = (event: React.MouseEvent<HTMLAnchorElement>, program: Program & { href: string }) => {
        trackAffiliateLinkTap({ spotId, template }, program.kind, program.href);
        if (openHref) {
            event.preventDefault();
            openHref(program.href);
        }
    };

    return (
        <div ref={cardRef} className={`ms-affiliate-card ms-affiliate-card--${template}`} data-test="affiliate-card">
            {/* Full-width since the Klook banner was dropped — a single program
                takes the whole row (was ms-grid-1-2 when there were two). */}
            <section>
                {programs.map((p) => (
                    <a
                        key={p.kind}
                        className="ms-banner ms-banner-affiliate"
                        href={p.href}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        data-kind={p.kind}
                        data-test={`affiliate-${p.kind}`}
                        onClick={(e) => handleTap(e, p)}>
                        <span className="ms-banner-affiliate__emoji" aria-hidden="true">
                            {p.emoji}
                        </span>
                        <div className="ms-banner__texts">
                            <p className="ms-h3-title ms-banner__text">
                                {p.title} in {destinationLabel}
                            </p>
                            <p className="ms-banner__subtext ms-small-text">{p.cta} →</p>
                        </div>
                    </a>
                ))}
            </section>
        </div>
    );
}
