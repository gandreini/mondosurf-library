import { appOs, getPlatform2 } from 'helpers/device.helpers';
import mixpanel from 'mixpanel-browser';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { getCookie } from 'mondosurf-library/helpers/cookies.helpers';
import { isDebug } from 'mondosurf-library/helpers/debug.helpers';
import { stringToBool } from 'mondosurf-library/helpers/strings.helpers';
import { store } from 'mondosurf-library/redux/store';
import { DEBUG_MODE, DISABLE_TRACKING } from 'proxies/localConstants';

type DestinationType = ('fb' | 'fbapp' | 'mp' | 'at' | 'ga' | 'sb')[];

export class Tracker {
    /**
     * Properties.
     */
    static mixpanelSetUpDone: boolean = false;
    static gaSetUpDone: boolean = false;

    /**
     * Initialize the Mixpanel tracker.
     *
     * @param   {string} mixpanelToken Mixpanel token to be used for tracking retrieved from backend API in app-config.
     * @returns {void}
     */
    static mixpanelInit(mixpanelToken: string) {
        if (DEBUG_MODE === "true") {
            mixpanel.init(mixpanelToken, { debug: stringToBool(DEBUG_MODE) });
        } else {
            mixpanel.init(mixpanelToken);
        }
        Tracker.mixpanelSetUpDone = true;
    }

    /**
     * Initialize Google Analytics.
     *
     * @param   {string} gaId Google Analytics Measurement ID retrieved from backend API in app-config.
     * @returns {void}
     */
    static gaInit(gaId: string) {
        gtag("js", new Date());
        gtag("config", gaId);
        Tracker.gaSetUpDone = true;
    }

    /**
     * Check if tracking is active.
     * Returns false for users who refused to be tracked.
     *
     * @returns {boolean} True if the user can be tracked.
     */
    static trackingIsActive() {
        const state = store.getState();
        const logged = state.user.logged;
        const authorizedTracking = state.user.authorizedTracking;
        let trackingStatus: boolean = true;

        // Retrieves the cookie tracking set by Iubenda.
        let cookieTracking: boolean;
        if (getCookie("tracking_cookie_allowed") === "false") {
            cookieTracking = false;
        } else {
            cookieTracking = true;
        }
        // The user has rejected the "measurement" cookies.
        if ((logged === "no" || logged === "checking") && !cookieTracking) trackingStatus = false;
        // The user has refused tracking when registering (or was disabled by the admin).
        if (logged === "yes" && !authorizedTracking) trackingStatus = false;
        // Checks the global local variable DISABLE_TRACKING.
        if (DISABLE_TRACKING === "true") trackingStatus = false;

        return trackingStatus;
    }

    /**
     * Used to identify the user with her ID after authentication.
     * Mixpanel will merge all the pre-login and post-login user activities.
     *
     * @param   {number} userId Id of the user.
     * @returns {void}
     */
    static identifyUser(userId: number) {
        if (Tracker.trackingIsActive()) {
            const state = store.getState();
            const accountType = state.user.accountType;
            mixpanel.identify(userId.toString());
            mixpanel.people.set({ "$name": userId.toString(), "AccountType": accountType });
        }
    }

    /**
     * Returns an object with the properties we want to track in all events.
     *
     * @returns {object} Object with properties.
     */
    static commonProperties() {
        const state = store.getState();
        const logged = state.user.logged;
        const userId = state.user.userId;
        const accountType = state.user.accountType;
        const favorites = state.user.favoriteSpots !== null ? state.user.favoriteSpots.length : 0;
        const platform = getPlatform2();
        const os = appOs();

        return {
            logged: logged,
            userId: userId,
            accountType: accountType,
            favorites: favorites,
            platform: platform,
            os: os
        };
    }

    /**
     * Tracks user interface event on the provided platforms.
     *
     * @param   {DestinationType} destinations Platforms to send track the event on.
     * @param   {TrackingEvent} eventName Name of the event to track.
     * @param   {Object} parameters Optional parameters of the event.
     * @returns {void}
     */
    static trackEvent(destinations: DestinationType, eventName: TrackingEvent, parameters?: Object): void {
        if (Tracker.trackingIsActive()) {
            /* Mixpanel */
            if (destinations.includes('mp') && Tracker.mixpanelSetUpDone) {
                if (isDebug()) console.log("📍 tracking:", eventName, { ...parameters, ...this.commonProperties() });
                mixpanel.track(eventName, { ...parameters, ...this.commonProperties() });
            }

            /* Google */
            if (destinations.includes('ga') && typeof gtag === 'function' && Tracker.gaSetUpDone) {
                if (isDebug()) console.log("gtag", gtag);
                if (parameters) {
                    gtag('event', eventName, {
                        'event_category': 'MondoEvent',
                        'event_label': Object.entries(parameters)[0][0],
                        'value': Object.entries(parameters)[0][1]
                    });
                } else {
                    gtag('event', eventName, {
                        'event_category': 'MondoEvent'
                    });
                }
            }

            /* Amplitude */
            if (destinations.includes('at')) {
                // amplitude.getInstance().logEvent(eventName, parameters);
            }

            /* Sendinblue */
            if (destinations.includes('sb')) {
                // sendinblue.track(eventName, parameters);
            }

            /* Facebook pixel */
            if (destinations.includes('fb')) {
                // fbq('track', eventName);
            }

            /* Facebook App */
            if (destinations.includes('fbapp')) {
                // if (isApp()) FacebookAnalytics.logEvent({ event: eventName, params: parameters });
            }
        }
    }
}