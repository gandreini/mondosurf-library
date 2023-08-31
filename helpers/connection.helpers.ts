/**
 * Checks the connection status.
 *
 * @returns {boolean} True if there's connection.
 */
export const checkConnectionWeb = () => {
    if (navigator.onLine) {
        return true;
    } else {
        return false;
    }
}
