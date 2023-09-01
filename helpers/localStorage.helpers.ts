import { removeItemFromArray } from './arrays.helpers';

/**
 * Sets the local storage data.
 * It saves in the browser's local storage if used on web.
 * 
 * @param   {string} key Key of the parameter to be saved.
 * @param   {string} value Value of the parameter to be saved.
 */
export function setLocalStorageDataWeb(key: string, value: string): void {
    localStorage.setItem(key, value);
}

/**
 * Deletes one key/value from the local storage data.
 * It deletes from the browser's local storage if used on web.
 * 
 * @param   {string} key Key of the parameter to be deleted.
 */
export function deleteLocalStorageDataWeb(key: string): void {
    localStorage.removeItem(key);
}

/**
 * Gets the local storage data from the browser localStorage.
 * 
 * @param   {string} key Key of the parameter to be retrieved.
 * @returns {string | null} Value of the data.
 */
export function getLocalStorageDataWeb(key: string): string | null {
    return localStorage.getItem(key);
}

/**
 * Every time the user browses a surf spot, the id is added to an array
 * in the local storage, to keep a history of the visited spots.
 *
 * @param   {string} spotId Id of the spot.
 */
export const addViewedSpotToLocalStorageWeb = (spotId: string): void => {
    let visitedSpots = getLocalStorageDataWeb('visitedSpots');
    let visitedSpotsArray: string[] = [];

    if (visitedSpots !== null) {
        visitedSpotsArray = visitedSpots.split(',');
    }

    // Remove the spotId if already in the array.
    removeItemFromArray(visitedSpotsArray, spotId);

    // Adds the new spot id.
    const lastSpotId = [spotId];
    visitedSpotsArray = lastSpotId.concat(visitedSpotsArray);

    // Max number of items is 10.
    visitedSpotsArray = visitedSpotsArray.slice(0, 10);

    setLocalStorageDataWeb('visitedSpots', visitedSpotsArray.toString())
}