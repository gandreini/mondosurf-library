// In-app navigation counter behind the back arrow's "can we history-back?"
// question (see PageTitle). Module scope is deliberate: the counter must die
// with the document. It is > 0 only when the user has client-side navigated
// within THIS document's lifetime, which is exactly when the previous history
// entry is guaranteed to be one of our pages. history.length and
// document.referrer both lie here (external entries inflate the former, the
// latter never updates on client-side navigations), and sessionStorage would
// survive leaving the site and coming back, wrongly answering "yes" when the
// previous entry is Google.

let navigationCount = 0;

/** Call on every client-side route change AFTER the initial render. */
export const recordNavigation = (): void => {
    navigationCount += 1;
};

/** True when history-back is guaranteed to land on an in-app page. */
export const hasInAppHistory = (): boolean => navigationCount > 0;

/** Test-only: restore the fresh-document state. */
export const resetNavigationHistory = (): void => {
    navigationCount = 0;
};
