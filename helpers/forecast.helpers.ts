import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { openLoginModal } from 'features/modal/modal.helpers';
import { postApiAuthCall } from 'mondosurf-library/api/api';
import { FORECAST_UPDATES, MAX_FORECAST_DAYS } from "mondosurf-library/constants/constants";
import { cloneObject } from "mondosurf-library/helpers/object.helpers";
import IGoodTime from "mondosurf-library/model/iGoodTime";
import { ISurfSpotForecast } from "mondosurf-library/model/iSurfSpot";
import { store } from "mondosurf-library/redux/store";
import toastService from 'mondosurf-library/services/toastService';

/**
 * Returns the number of forecast days to be displayed to the user.
 * Returns 0 for disabled accounts, otherwise returns the max forecast days.
 *
 * @returns {number} Number of days of forecast and GoodTimes to show.
 */
export const forecastDays = (): number => {
    const accountType = store.getState().user.accountType;
    return accountType === "disabled" ? 0 : MAX_FORECAST_DAYS;
}

/**
 * Takes the whole forecast object (type: ISurfSpotForecast) and limits the number of days.
 * The first day considered is either the provided startDate or the current day in the timezone of the spot.
 * The last day is the first day + the number of days to be displayed (parameter: days).
 *
 * @param   {ISurfSpotForecast} forecastData Full forecast object for the given surf spot.
 * @param   {number} days Days to leave in the object.
 * @param   {string} spotTimezone Timezone of the spot.
 * @param   {string} startDate Optional ISO date string to start from (instead of current day).
 * @returns {ISurfSpotForecast} Object with the forecast limited to the number of days.
 */
export const limitForecastToDaysRange = (forecastData: ISurfSpotForecast, days: number, spotTimezone: string, startDate?: string): ISurfSpotForecast => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Clone object: this will be returned
    const clonedForecastData = cloneObject<ISurfSpotForecast>(forecastData);

    // Use provided startDate or default to current day in timezone at 00:00
    const startDayInTimezone = startDate
        ? dayjs(startDate).tz(spotTimezone).startOf('day')
        : dayjs().tz(spotTimezone).startOf('day');

    // Days/Compressed Days: Find the index of the start day using .isSame() for safer comparison
    let firstDayId = clonedForecastData.days.findIndex(day =>
        dayjs(day.time).isSame(startDayInTimezone, 'day')
    );

    // Fallback to 0 if date not found
    if (firstDayId === -1) {
        firstDayId = 0;
    }

    // Days: cuts the days before the start day, and those after the given number of days (both for "days" and "compressed days")
    clonedForecastData.days = clonedForecastData.days.slice(firstDayId, days + firstDayId);
    clonedForecastData.compressed_days.days = clonedForecastData.compressed_days.days.slice(firstDayId, days + firstDayId);

    // Good times
    const periodEnd = startDayInTimezone.add(days, 'd');
    clonedForecastData.good_times = clonedForecastData.good_times.filter((goodTime: IGoodTime) => dayjs(goodTime.end_time).isBefore(periodEnd));

    return clonedForecastData;
}

/**
 * Limits the list of the provided GoodTimes by
 * removing those that have the `TO` date in the past
 * and removing those that have the `TO` date after the current day + the max forecast allowed days
 *
 * @param   {IGoodTime[]} goodTimes Array of all the Good Times.
 * @returns {IGoodTime[]} Array with Good Times in the past removed..
 */
export const limitGoodTimesToDaysRange = (goodTimes: IGoodTime[]): IGoodTime[] => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    if (!goodTimes || goodTimes.length === 0) {
        return [];
    } else {
        // eslint-disable-next-line array-callback-return
        return goodTimes.filter((goodTime: IGoodTime) => {
            const startOfRange = dayjs(); // Current time, returns Day.js object
            const endOfRange = dayjs().tz(goodTime.timezone).startOf('day').add(forecastDays(), 'd'); // Returns Day.js object
            if (
                dayjs(goodTime.end_time).isAfter(startOfRange) &&
                dayjs(goodTime.end_time).isBefore(endOfRange)
            ) {
                return goodTime;
            }
        }) as IGoodTime[]
    }
}

/**
 * Checks if a given direction in degrees is within a specified range.
 * 
 * The function handles cases where the range wraps around the 360-degree point,
 * e.g., when min is 320 and max is 20.
 * 
 * @param direction - The direction in degrees to check. Should be in the range [0, 360), but the function will normalize values outside this range.
 * @param min - The minimum bound of the range. Should be in the range [0, 360), but the function will normalize values outside this range.
 * @param max - The maximum bound of the range. Should be in the range [0, 360), but the function will normalize values outside this range.
 * 
 * @returns `true` if the direction is within the range, `false` otherwise.
 */
export const directionIsWithinRange = (direction: number, min: number, max: number): boolean => {
    // Normalize the direction, min, and max to be within [0, 360)
    direction = (direction + 360) % 360;
    min = (min + 360) % 360;
    max = (max + 360) % 360;

    // If min is less than or equal to max, it's a straightforward check
    if (min <= max) {
        return direction >= min && direction <= max;
    }
    // If min is greater than max, the range wraps around 360
    else {
        return direction >= min || direction <= max;
    }
}

/**
 * Calculate the time span (in seconds) to the next forecast update.
 * 
 * This function determines the number of seconds remaining until the next forecast update
 * based on the current time in the Europe/Rome timezone and the predefined update hours.
 * 
 * @returns The number of seconds until the next forecast update.
 */
export function timeSpanToNextUpdate(): number {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Get the current time in the Europe/Rome timezone
    const now = dayjs().tz('Europe/Rome');

    // Find the next update hour
    const nextUpdateHour = FORECAST_UPDATES.find(hour => hour > now.hour());

    // If there's a next update hour on the same day
    if (nextUpdateHour !== undefined) {
        const nextUpdate = now.hour(nextUpdateHour).minute(0).second(0).millisecond(0);
        return nextUpdate.diff(now, 'seconds');
    }

    // If the next update is on the next day (first hour in the array)
    const nextUpdate = now.add(1, 'day').hour(FORECAST_UPDATES[0]).minute(0).second(0).millisecond(0);
    return nextUpdate.diff(now, 'seconds');
}

/**
 * Initiates a forecast request process based on the user's login status. If not logged, the login modal is opened.
 * Usually triggered when the user clicks on the forecast request button
 * 
 * @param {string} logged - The user's login status. Can be 'yes', 'no', or 'checking'.
 * @param {string} spot_id - The id of the spot.
 * @returns {Promise<string>} A promise that resolves with resolve or reject.
 */
// ! TODO Move copy to i18n
export const requestForecastStep1 = (logged: "yes" | "no" | "checking", spot_id: string) => {
    return new Promise((resolve, reject) => {
        if (logged === 'yes') {
            const state = store.getState();
            const accessToken = state.user.accessToken;
            requestForecastStep2(spot_id, accessToken).then((response: any) => {
                resolve("Operation successful")
            })
                .catch((error) => {
                    reject("Operation failed")
                });
        } else {
            openLoginModal(
                'spotForecastRequest',
                'Login to request the forecast',
                'You need to login or register to Mondo to send the forecast request',
                (accessToken?: string) => {
                    requestForecastStep2(spot_id, accessToken).then((response: any) => {
                        resolve("Operation successful")
                    })
                        .catch((error) => {
                            reject("Operation failed")
                        });
                }
            );
        }
    });
};

/**
 * Forwards a requests for the forecast to a spot to the Admin by calling the backend API.
 *
 * @param {string} spot_id - The id of the spot.
 * @param {string} [accessToken] - An optional access token for authenticated requests. Optional but fails if not provided.
 * @returns {Promise<string>} A promise
 */
// ! TODO Move copy to i18n
const requestForecastStep2 = (spot_id: string, accessToken?: string) => {
    return new Promise((resolve, reject) => {
        if (accessToken) {
            postApiAuthCall(
                'user-request-spot-forecast',
                accessToken,
                {
                    spot_id: spot_id
                },
                true
            )
                .then((response: any) => {
                    toastService.success("Forecast request correctly sent. You'll receive and email from our team.");
                    resolve("Operation successful")
                })
                .catch((error) => {
                    toastService.error("The Forecast request could not be sent, pleas try again.");
                    reject("Operation failed")
                });
        } else {
            toastService.error("The Forecast request could not be sent, pleas try again.");
            reject("Operation failed")
        }
    });
};

/**
 * 
 * * DEPRECATED: Use `limitGoodTimesToDaysRange` instead
 * 
 * Removes form the Good Times array those that are in the past:
 * the good times that have the `TO` date in the past are removed.
 *
 * @param   {IGoodTime[]} goodTimes Array of all the Good Times.
 * @returns {IGoodTime[]} Array with Good Times in the past removed..
 */
/*
export const filterOutPastGoodTimes = (goodTimes: IGoodTime[]): IGoodTime[] => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    if (!goodTimes || goodTimes.length === 0) {
        return [];
    } else {
        return goodTimes.filter((goodTime: IGoodTime) => {
            const startOfRange = dayjs(); // Current time, returns Day.js object
            const endOfRange = dayjs().tz(goodTime.timezone).startOf('day').add(forecastDays(), 'd');
            if (
                dayjs(goodTime.end_time).isAfter(startOfRange) &&
                dayjs(goodTime.end_time).isBefore(endOfRange)
            ) {
                return goodTime;
            }
            // return dayjs().isBefore(goodTime.end_time);
        }) as IGoodTime[]
    }
}
*/

/**
 * 
 * * DEPRECATED: Use `limitGoodTimesToDaysRange` instead
 * 
 * Takes a list of Good Times and remove those that are after a given number of days.
 * Used to hide the Good Times that are in the future for Free users (we limit them to the next 3 days).
 *
 * @param   {IGoodTime[]} goodTimes Full GOod Times list.
 * @param   {number} days Days to limit the Good Times to show.
 * @returns {IGoodTime[]} Filtered list of Good times.
 */
/*
export const limitGoodTimesToDays = (goodTimes: IGoodTime[], days: number): IGoodTime[] => {
    if (!goodTimes || goodTimes.length === 0) {
        return [];
    } else {
        // Good Times are filtered relative to the current time and timezone of the user.
        const periodEnd = dayjs().startOf('day').add(days, 'd');
        return goodTimes.filter((goodTime: IGoodTime) => dayjs(goodTime.end_time).isBefore(periodEnd));
    }
}
*/