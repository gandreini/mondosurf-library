/**
 * Returns the value of a GET parameter,
 * null if the parameter is not set.
 * 
 * @param   {string} param Name of the parameter to retrieve.
 * @return  {string | null} The string value of the parameter, or null, if not set;
 */
export function getUrlParameter(
    param: string
): string | null {

    const urlParams = new URLSearchParams(document.location.search.substring(1));

    if (urlParams.has(param)) {
        return urlParams.get(param);
    } else {
        return null;
    }
}

/**
* Returns and RGB string, when given an HEX color.
*
* @param   {string} hex PHexadecimal definition of the color.
* @param   {number} alpha Alpha channel.
* @returns {string} Rgba in string format.
*/
export function hexToRGBA(hex: string, alpha: number): string {

    hex = hex.trim(); // Removes whitespace from both ends of this string

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha != null) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
}

/**
 * Returns a number with one decimal, and no decimals if that's 0.
 * If you send 3.145223, you got 3.1. 
 * 
 * @param   {number} numberToFix Given number.
 * @returns {number} returned number with max one decimal.
 */
export function oneDecimal(numberToFix: number): number {
    return parseFloat(numberToFix.toFixed(1));
}

/**
* Function that send the cursor at the end of the input, when there's some text.
*
* @param   {HTMLInputElement} input Input field as HTML element.
*/
export function inputCursorAtTheEnd(input: HTMLInputElement): void {
    setTimeout(function () {
        const length = input.value.length;
        input.setSelectionRange(length, length);
    }, 5);
}

/**
 * Function that checks if an element si visible.
 *
 * @param   {HTMLElement} element HTML element to check if is visible.
 * @param   {paddingTop} paddingTop Margin from top to restrict the check.
 * @param   {paddingBottom} paddingBottom Margin from bottom to restrict the check.
 * @returns {boolean} True if is visible.
 */
export const checkIfElementIsInView = (element: HTMLElement, paddingTop: number = 0, paddingBottom: number = 0) => {
    const rect = element.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    // Only completely visible elements return true:
    // const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    const isVisible = elemTop < (window.innerHeight) && elemBottom >= 0;
    return isVisible;
}

/**
 * Generates a UUID (Universally Unique Identifier) in version 4 format.
 * 
 * The UUID is generated using random numbers and follows the format
 * 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx', where 'x' is replaced with a 
 * random hexadecimal digit and 'y' is replaced with a random hexadecimal 
 * digit from the set {8, 9, A, or B}.
 * 
 * @returns A string representing a UUID v4.
 */
export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}