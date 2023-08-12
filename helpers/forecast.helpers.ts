import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { FREE_USER_MAX_FORECAST_DAYS, PRO_USER_MAX_FORECAST_DAYS } from "../constants/constants";
import IGoodTime from "../model/iGoodTime";
import { ISurfSpotForecast } from "../model/iSurfSpot";
import { store } from "../redux/store";
import { cloneObject } from "./object.helpers";

/**
 * Returns the number of forecast days to be displayed to the user, depending on the account type.
 *
 * @returns {number} Number of days of forecast and GoodTimes to show.
 */
export const forecastDays = (): number => {
    const state = store.getState();
    const accountType = state.user.accountType;

    if (accountType === "admin" || accountType === "pro" || accountType === "trial") {
        return PRO_USER_MAX_FORECAST_DAYS;
    } else if (accountType === "free") {
        return FREE_USER_MAX_FORECAST_DAYS;
    } else if (accountType === "disabled") {
        return 0;
    }
    return 0;
}

/**
 * Takes the whole forecast object (type: ISurfSpotForecast) and limits the number of days.
 * The first day considered is the current day in the timezone of the spot.
 * The last day is the first day + the number of days to be displayed (parameter: days).
 *
 * @param   {ISurfSpotForecast} forecastData Full forecast object for the given surf spot.
 * @param   {number} days Days to leave in the object.
 * @param   {string} timezone Timezone of the spot.
 * @returns {ISurfSpotForecast} Object with the forecast limited to the number of days.
 */
export const limitForecastToDaysRange = (forecastData: ISurfSpotForecast, days: number, spotTimezone: string): ISurfSpotForecast => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Clone object: this will be returned.
    const clonedForecastData = cloneObject<ISurfSpotForecast>(forecastData);

    // Current day in timezone at 00:00: day to start the forecast from.
    const startDayInTimezone = dayjs().tz(spotTimezone).startOf('day');

    // Days: Id of the current day in timezone (in the "days" array).
    let firstDayId = 0;
    clonedForecastData.days.forEach((day, index) => {
        if (day.time === startDayInTimezone.format()) {
            firstDayId = index;
        }
    });

    // Days: cuts the days before the current day, and those after the given number of days.
    clonedForecastData.days = clonedForecastData.days.slice(firstDayId, days + firstDayId);

    // Compressed days: Id of the hour corresponding to the current day in timezone (in the "compressed_days.hours" array).
    let firstCompressedHourId = 0;
    // ! Retro-compatibility notice: compressed_days.hours breaks the app if flat data is not retrieved.
    clonedForecastData.compressed_days.hours.forEach((hour, index) => {
        if (hour === startDayInTimezone.format()) {
            firstCompressedHourId = index;
        }
    });
    const lastCompressedHourId = firstCompressedHourId + (days * 4); // Last hour of the compressed days. "4" in the number of hours per compressed day.

    // Actual slice of the compressed_days arrays.
    clonedForecastData.compressed_days.hours = clonedForecastData.compressed_days.hours.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.is_good = clonedForecastData.compressed_days.is_good.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.is_light = clonedForecastData.compressed_days.is_light.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.swell_direction = clonedForecastData.compressed_days.swell_direction.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.swell_height = clonedForecastData.compressed_days.swell_height.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.swell_period = clonedForecastData.compressed_days.swell_period.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.wind_direction = clonedForecastData.compressed_days.wind_direction.slice(firstCompressedHourId, lastCompressedHourId);
    clonedForecastData.compressed_days.wind_speed = clonedForecastData.compressed_days.wind_speed.slice(firstCompressedHourId, lastCompressedHourId);

    // Good times.
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