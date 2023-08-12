/**
 * Returns the given days in UNIX time (seconds).
 *
 * @param   {number} days Number of days to be converted.
 * @returns {number} Days converted in UNIX (seconds).
 */
export const daysInUNIX = (days: number): number => {
    return days * 86400;
}

/**
 * Returns the code to format day.js dates like: 9:34
 *
 * @returns {string} Formatting code for day.js
 */
export const hourMinFormat = (): string => {
    return "H:mm"
}

/**
 * Returns the code to format day.js dates like: Mon 2 Feb
 *
 * @returns {string} Formatting code for day.js
 */
export const extDayMonthFormat = (): string => {
    return "ddd D MMM"
}

/**
 * Returns the code to format day.js dates like: Mon 2 February
 *
 * @returns {string} Formatting code for day.js
 */
export const extDayExtMonthFormat = (): string => {
    return "ddd D MMMM"
}

/**
 * Returns the code to format day.js dates like: Mon 2 Feb 9:21
 *
 * @returns {string} Formatting code for day.js
 */
export const extDayExtMonthTimeFormat = (): string => {
    return "ddd D MMM H:mm"
}

/**
 * Returns the code to format day.js dates like: Mon 2
 *
 * @returns {string} Formatting code for day.js
 */
export const extDayFormat = (): string => {
    return "ddd D"
}

/**
 * Returns the code to format day.js dates like: 2 Jan 2024
 *
 * @returns {string} Formatting code for day.js
 */
export const dayMonthYearFormat = (): string => {
    return "D MMM YYYY"
}