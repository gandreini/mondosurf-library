import { store } from "mondosurf-library/redux/store";

/**
 * Verifies if the current user has Pro permissions (if is admin, pro or trial).
 * Also check if the user is logged.
 * Use the hook "useHasProPermissions" if logged and accountType can change.
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

/**
 * Generates a random and secure user password.
 * The password will be 12 characters long, including uppercase, lowercase, numbers, and special characters.
 *
 * @returns string A randomly generated secure password.
 */
export const generateSecurePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
