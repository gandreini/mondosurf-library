import { DEBUG_MODE } from "proxies/localConstants";

/**
 * Return true if the debug is active.
 *
 * @returns {bool} True if debug is active.
 */
export const isDebug = () => {
    let debugActive = false;
    if (DEBUG_MODE === 'true') debugActive = true;
    return debugActive;
}