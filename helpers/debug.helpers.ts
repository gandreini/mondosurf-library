/**
 * Return true if the debug is active.
 *
 * @returns {bool} True if debug is active.
 */
export const isDebug = () => {
    let debugActive = false;
    if (process.env.REACT_APP_DEBUG_MODE === 'true') debugActive = true;
    return debugActive;
}