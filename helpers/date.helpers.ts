import dayjs from 'dayjs';
import { mondoTranslate } from 'proxies/mondoTranslate';

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

/**
 * Returns a friendly, social-style relative timestamp:
 *   - <45s        → "just now"
 *   - <90s        → "1 minute ago"
 *   - <45m        → "N minutes ago"
 *   - <90m        → "1 hour ago"
 *   - <22h        → "N hours ago"
 *   - <36h        → "1 day ago"
 *   - <7d         → "N days ago"
 *   - same year   → "21 Jan"
 *   - older       → "21 Jan 2025"
 *
 * Strings use mondoTranslate keys so they can be localised. Falls back
 * gracefully to a formatted date if the input is unparseable.
 */
export const relativeDate = (input: string | number | Date): string => {
    const target = dayjs(input);
    if (!target.isValid()) return '';
    const now = dayjs();
    const seconds = now.diff(target, 'second');

    if (seconds < 45) return mondoTranslate('dates.just_now');
    if (seconds < 90) return mondoTranslate('dates.one_minute_ago');

    const minutes = now.diff(target, 'minute');
    if (minutes < 45) return mondoTranslate('dates.minutes_ago', { count: minutes });
    if (minutes < 90) return mondoTranslate('dates.one_hour_ago');

    const hours = now.diff(target, 'hour');
    if (hours < 22) return mondoTranslate('dates.hours_ago', { count: hours });
    if (hours < 36) return mondoTranslate('dates.one_day_ago');

    const days = now.diff(target, 'day');
    if (days < 7) return mondoTranslate('dates.days_ago', { count: days });

    // Older than a week — switch to absolute date.
    if (target.year() === now.year()) return target.format('D MMM');
    return target.format('D MMM YYYY');
}