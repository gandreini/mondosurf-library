import { DEBUG_MODE } from "../../constants/localConstants";

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