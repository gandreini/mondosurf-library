// Answers the back arrow's "can we history-back and stay on-site?" question
// (see PageTitle), combining two signals that cover each other's blind spot:
//
// 1. A module-scope counter of client-side navigations. Module scope is
//    deliberate: it dies with the document, so it is > 0 only when the user
//    navigated within THIS document's lifetime. But it misses same-origin
//    FULL-load hops (e.g. the map popup is a raw Leaflet <a href>, which
//    reloads the document and resets the counter).
// 2. document.referrer, checked ONLY at counter 0. At document birth the
//    referrer describes exactly the previous history entry, so a same-origin
//    referrer means history-back stays on-site even though the counter was
//    reset by a full load. The referrer is useless AFTER client-side
//    navigations (it never updates), which is precisely when the counter
//    takes over.
//
// Rejected alternatives: history.length (external entries inflate it) and
// sessionStorage (survives leaving the site and coming back, wrongly
// answering "yes" when the previous entry is Google).

let navigationCount = 0;

/** Call on every client-side route change AFTER the initial render. */
export const recordNavigation = (): void => {
    navigationCount += 1;
};

/**
 * Pure referrer check (unit-tested): true when the referrer exists and its
 * origin matches ours, i.e. the previous history entry is one of our pages.
 */
export const isSameOriginReferrer = (referrer: string, origin: string): boolean => {
    if (!referrer) return false;
    try {
        return new URL(referrer).origin === origin;
    } catch {
        return false;
    }
};

/** True when history-back is guaranteed to land on an in-app page. */
export const hasInAppHistory = (): boolean => {
    if (navigationCount > 0) return true;
    if (typeof document === 'undefined' || typeof window === 'undefined') return false;
    return isSameOriginReferrer(document.referrer, window.location.origin);
};

/** Test-only: restore the fresh-document state. */
export const resetNavigationHistory = (): void => {
    navigationCount = 0;
};
