import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Calculates the stale time for a weather forecast based on the current time,
 * the specified buffer in minutes, and the forecast update hours.
 *
 * The function determines the next available forecast update time based on
 * predefined hours (4, 10, 16, 22) in the 'Europe/Rome' timezone. It then
 * calculates the stale time by subtracting the buffer from the time until
 * the next update. If the calculated stale time is negative, it returns 0.
 *
 * @param {number} bufferMinutes - The buffer time in minutes to subtract from
 *                                  the next update time (default is 5 minutes).
 * @returns {number} - The stale time in milliseconds until the next forecast
 *                     update, or 0 if the calculated time is negative.
 */
export const getForecastStaleTime = (bufferMinutes: number = 10) => {
    const bufferMs = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
    const tz = 'Europe/Rome'; // Timezone of the server
    const now = dayjs().tz(tz);
    const forecastHours = [4, 10, 16, 22];

    let nextUpdate: dayjs.Dayjs | null = null;
    for (const hour of forecastHours) {
        const candidate = now
            .set('hour', hour)
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0);
        if (candidate.isAfter(now)) {
            nextUpdate = candidate;
            break;
        }
    }
    if (!nextUpdate) {
        nextUpdate = now
            .add(1, 'day')
            .set('hour', forecastHours[0])
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0);
    }

    // Subtract the buffer so the stale time ends before the actual update
    const staleTimeMs = nextUpdate.diff(now) + bufferMs;

    // Log the stale time using Day.js duration
    /* const humanizeMilliseconds = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (hours > 0) {
            parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
        // Show seconds only if there are no hours and minutes
        if (seconds > 0 && parts.length === 0) {
            parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
        }
        return parts.join(', ') || '0 seconds';
    };
    console.log(
        `Stale time: ${staleTimeMs}ms (~${humanizeMilliseconds(staleTimeMs)})`
    ); */


    // Ensure we never return a negative value
    return staleTimeMs > 0 ? staleTimeMs : 0;
};