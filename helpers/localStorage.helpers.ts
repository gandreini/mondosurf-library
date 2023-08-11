import { Storage } from '@capacitor/storage';

import { removeItemFromArray } from './arrays.helpers';
import { isApp } from "./device.helpers";

/**
 * Sets the local storage data.
 * It saves in the browser's local storage if used on web.
 * It calls the function setCapacitorStorage to save on Capacitor's Storage if on ios or android.
 * 
 * @param   {string} key Key of the parameter to be saved.
 * @param   {string} value Value of the parameter to be saved.
 */
export function setLocalStorageData(key: string, value: string): void {
    if (isApp()) {
        setCapacitorStorage(key, value);
    } else {
        localStorage.setItem(key, value);
    }
}

/**
 * Async function to save  a key/value on Capacitor Storage (for ios and android).
 * 
 * @param   {string} key Key of the parameter to be saved.
 * @param   {string} value Value of the parameter to be saved.
 */
async function setCapacitorStorage(key: string, value: string) {
    try {
        await Storage.set({
            key: key,
            value: value,
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Deletes one key/value from the local storage data.
 * It deletes from the browser's local storage if used on web.
 * It deletes from the Capacitor's Storage if on ios or android.
 * 
 * @param   {string} key Key of the parameter to be deleted.
 */
export function deleteLocalStorageData(key: string): void {
    if (isApp()) {
        Storage.remove({ key: key });
    } else {
        localStorage.removeItem(key);
    }
}

/**
 * Gets the local storage data both for web or iOS/Android.
 * Web: retrieves it from the browser localStorage.
 * iOS/Android: calls the function Storage.get to retrieve it from the Capacitor's Storage.
 * In both cases, it returns a promise.
 * 
 * @param   {string} key Key of the parameter to be saved.
 * @returns {Promise} Returns a promise. 
 */
export async function getLocalStorageData(key: string): Promise<string | null | undefined> {
    if (isApp()) {
        // Capacitor (Storage).
        const { value } = await Storage.get({ key: key });
        return value;
    } else {
        // Web (localStorage).
        let promise = new Promise<string | null | undefined>(function (resolve, reject) {
            resolve(localStorage.getItem(key));
        });
        return promise;
    }
}

/**
 * Every time the user browses a surf spot, the id is added to an array
 * in the local storage, to keep a history of the visited spots.
 *
 * @param   {string} spotId Id of the spot.
 */
export const addViewedSpotToLocalStorage = (spotId: string): void => {
    getLocalStorageData('visitedSpots').then((response) => {
        let visitedSpotsArray: string[] = [];
        // There's already a visitedSpots in the local storage.
        if (response) {
            visitedSpotsArray = response.split(',');
        }

        // Remove the spotId if already in the array.
        removeItemFromArray(visitedSpotsArray, spotId);

        // Adds the new spot id.
        const lastSpotId = [spotId];
        visitedSpotsArray = lastSpotId.concat(visitedSpotsArray);

        // Max number of items is 10.
        visitedSpotsArray = visitedSpotsArray.slice(0, 10);

        setLocalStorageData('visitedSpots', visitedSpotsArray.toString())
    })
        .catch((error) => {
            console.log("error", error);
        });
}