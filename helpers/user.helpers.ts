import { store } from "mondosurf-library/redux/store";

/**
 * Verifies if the current user has Pro permissions (if is admin, pro or trial).
 * Also check if the user is logged.
 *
 * @returns boolean True if the user can access the pro features.
 */
export const hasProPermissions = (): boolean => {
    const state = store.getState();
    const logged = state.user.logged;
    if (logged === "checking" || logged === "no") return false;

    const accountType = state.user.accountType;
    if (accountType === "admin" || accountType === "pro" || accountType === "trial") return true;
    return false;
}