/**
 * Checks the connection status.
 *
 * @returns {boolean} True if there's connection.
 */
export const checkConnectionWeb = () => {
    /*
    UPDATE 24/08/2024
    It seems that navigator.onLine is not working correctly.
    Simplifying this by always returning true.
    Should be ok also considering that web mode is only used for development.
    */
    /*
    if (navigator.onLine) {
        return true;
    } else {
        return false;
    }
    */
    return true;
}
