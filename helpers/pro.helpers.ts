import { isAppiOs } from "helpers/device.helpers";
import { MONTHLY_SUBSCRIPTION_TITLE, STRIPE_MONTHLY_SUBSCRIPTION_PRICE, STRIPE_YEARLY_SUBSCRIPTION_PRICE, YEARLY_SUBSCRIPTION_TITLE } from "mondosurf-library/constants/constants";
import { store } from "mondosurf-library/redux/store";
import { setAccountType, setProductId, setProService, setStripeSubscriptionId, setStripeUserId, setSubscriptionDuration, setSubscriptionExpiration } from "mondosurf-library/redux/userSlice";

/**
 * Updates the Redux store for Pro users.
 *
 * @param {string} productId - The ID of the product associated with the Pro subscription.
 * @param {number} expirationDate - The expiration date of the subscription in milliseconds.
 * @param {'yearly' | 'monthly'} subscriptionDuration - The duration of the subscription (either 'yearly' or 'monthly').
 * @param {"stripe" | "apple"} proService - The service type for the Pro subscription (either 'stripe' or 'apple').
 * @param {String} [stripeUserId] - Optional. The Stripe user ID for the subscription.
 * @param {String} [stripeSubscriptionId] - Optional. The Stripe subscription ID for the subscription.
 * @returns {boolean} - Returns true if the user is logged in and has a valid Pro subscription; otherwise, returns false.
 */
export const userIsPro = (productId: string, expirationDate: number, subscriptionDuration: 'yearly' | 'monthly', proService: "stripe" | "apple", stripeUserId?: String, stripeSubscriptionId?: String) => {
    // Redux
    const state = store.getState();
    const logged = state.user.logged;

    // Opens the modal if user is not logged or has no pro permissions
    if (logged === 'no' || logged === "checking") {
        return false;
    } else {
        store.dispatch(setAccountType("pro"));
        store.dispatch(setProService(proService));
        store.dispatch(setProductId(productId));
        store.dispatch(setSubscriptionExpiration(expirationDate));
        store.dispatch(setSubscriptionDuration(subscriptionDuration));
        if (stripeUserId) store.dispatch(setStripeUserId(stripeUserId));
        if (stripeSubscriptionId) store.dispatch(setStripeSubscriptionId(stripeSubscriptionId));
        return true;
    }
}

/**
 * Returns the Pro Yearly membership title retrieving it from Apple Store
 * or locally (if not iOS).
 *
 * @returns {string} The subscription title.
 */
export const proTitleYear = () => {
    if (isAppiOs()) {
        // Redux
        const state = store.getState();
        const productTitle = state.RevenueCat.proYearlyTitle;
        return productTitle || YEARLY_SUBSCRIPTION_TITLE;
    } else {
        return YEARLY_SUBSCRIPTION_TITLE;
    }
}

/**
 * Returns the Pro Monthly membership title retrieving it from Apple Store
 * or locally (if not iOS).
 *
 * @returns {string} The subscription title.
 */
export const proTitleMonth = () => {
    if (isAppiOs()) {
        // Redux
        const state = store.getState();
        const productTitle = state.RevenueCat.proMonthlyTitle;
        return productTitle || MONTHLY_SUBSCRIPTION_TITLE;
    } else {
        return MONTHLY_SUBSCRIPTION_TITLE;
    }
}

/**
 * Returns the Pro Yearly membership price taking the device into account.
 * In the future could take other parameters into account (as country).
 *
 * @returns {string} The subscription price.
 */
export const proPriceYear = () => {
    if (isAppiOs()) {
        // Redux
        const state = store.getState();
        const productPrice = state.RevenueCat.proYearlyPrice;
        return productPrice || STRIPE_YEARLY_SUBSCRIPTION_PRICE;
    } else {
        return STRIPE_YEARLY_SUBSCRIPTION_PRICE;
    }
}

/**
 * Returns the Pro Monthly membership price taking the device into account.
 * In the future could take other parameters into account (as country).
 *
 * @returns {string} The subscription price.
 */
export const proPriceMonth = () => {
    if (isAppiOs()) {
        // Redux
        const state = store.getState();
        const productPrice = state.RevenueCat.proMonthlyPrice;
        return productPrice || STRIPE_MONTHLY_SUBSCRIPTION_PRICE;
    } else {
        return STRIPE_MONTHLY_SUBSCRIPTION_PRICE;
    }
}
