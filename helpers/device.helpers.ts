/**
 * Check the with of the device and returns true if it's bigger that the provided minWidth.
 *
 * @param   {number} minWidth Returns true if the screen is wider than this value.
 * @returns {boolean} True if screen is wider than the provided value.
 */
export function screenWiderThan(minWidth: number): boolean {
    const mediaQuery = window.matchMedia('(min-width: ' + minWidth.toString() + 'px)');
    if (mediaQuery.matches) {
        return true;
    } else {
        return false;
    }
}

/**
* Returns true if mobile device.
* Not to confuse with "getPlatform()" which checks if Mondo Surf is running
* as an app.
*
* @returns {boolean} True if the device is mobile.
*/
export function isMobile(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}