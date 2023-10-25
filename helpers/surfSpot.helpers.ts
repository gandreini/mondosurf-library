import { removeDuplicatesFromArray } from "./arrays.helpers";

/**
 * Returns an array of the directions strings (given a string like "SW-W-NW")
 * 
 * @param   {string} directions A string like "SW-W-NW".
 * @returns {string[]} Returns an array where the directions are split into an array like ["SW", "W", "NW"]
 */
export const returnDirectionsArray = (directions: string): string[] => {
    return directions.split("-");
}

/**
 * Splits the content of an array in a readable form.
 * Transform each element of the array using a given function.
 * 
 * @param   {string[] | number[]} arrayToConvert A string[] | number[] array to be processed. Ex. ["1", "2"].
 * @param   {Function | null} functionLabel Function that process each single element of the array.
 * @param   {string} separator Separator element to be added between elements.
 * @returns {string} Returns a string like "beginner, intermediate"
 */
export const returnReadableArray = (arrayToConvert: string[] | number[], functionLabel: Function | null, separator: string): string => {
    let returnString = "";
    for (let i = 0, max = arrayToConvert.length; i < max; i++) {
        if (functionLabel !== null) {
            returnString += functionLabel(arrayToConvert[i]);
        } else {
            returnString += arrayToConvert[i];
        }
        if (i < arrayToConvert.length - 1) returnString += separator;
    }
    return returnString;
}

/**
 * Returns an array of readable directions (i.e. "NW", "N", "NE") given a range in degrees with a min and max.
 *
 * @param   {number} degreesFrom Degrees start of the range.
 * @param   {number} degreesTo Degrees end of the range.
 * @returns {string[]} Array of strings picked from: "N", "NE", "E", "SE", "S", "SW", "W", "NW".
 */
export const readableDirectionFromDegrees = (degreesFrom: number, degreesTo: number): string[] => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const indexStart = findDirectionOctantIndex(degreesFrom);
    const indexEnd = findDirectionOctantIndex(degreesTo);

    let returnArray = [];

    if (indexStart < indexEnd) {
        for (let i = indexStart; i <= indexEnd; i++) {
            returnArray.push(directions[i]);
        }
    } else if (indexStart > indexEnd) {
        for (let i = indexStart; i <= 7; i++) {
            returnArray.push(directions[i]);
        }
        for (let i = 0; i <= indexEnd; i++) {
            returnArray.push(directions[i]);
        }
    } else if (indexStart === indexEnd) {
        if (
            (degreesFrom < degreesTo && degreesFrom > 337.5 && degreesFrom <= 360 && degreesTo > 337.5 && degreesTo <= 360) ||
            (degreesFrom < degreesTo && degreesFrom >= 0 && degreesFrom < 22.5 && degreesTo >= 0 && degreesTo < 22.5) ||
            (degreesFrom < degreesTo && degreesFrom >= 22.5 && degreesTo <= 337.5) ||
            (degreesFrom > degreesTo && degreesFrom > 337.5 && degreesFrom <= 360 && degreesTo >= 0 && degreesTo < 22.5)
        ) {
            // Same octant, only the octant they are must be highlighted.
            returnArray.push(directions[indexEnd]);
        } else if (
            (degreesFrom > degreesTo && degreesFrom > 337.5 && degreesFrom <= 360 && degreesTo > 337.5 && degreesTo <= 360) ||
            (degreesFrom > degreesTo && degreesFrom >= 0 && degreesFrom < 22.5 && degreesTo >= 0 && degreesTo < 22.5) ||
            (degreesFrom > degreesTo && degreesFrom >= 22.5 && degreesTo <= 337.5) ||
            (degreesFrom < degreesTo && degreesFrom >= 0 && degreesFrom < 22.5 && degreesTo > 337.5 && degreesTo <= 360)
        ) {
            // Same octant, all octants are must be highlighted.
            for (let i = 0; i <= 7; i++) {
                returnArray.push(directions[i]);
            }
        }
    }
    return returnArray;
}

/**
 * Returns the octant index (0 to 7) of a given direction in degrees.
 *
 * @param   {number} degrees A direction in degrees.
 * @returns {number} The ID of the octant, where "N" is 0, "NE" is 1, "E" is 2...
 */
const findDirectionOctantIndex = (degrees: number): number => {
    if ((degrees > 337.5 && degrees <= 360) || (degrees >= 0 && degrees <= 22.5)) {
        return 0;
    } else if (degrees > 22.5 && degrees <= 67.5) {
        return 1;
    } else if (degrees > 67.5 && degrees <= 112.5) {
        return 2;
    } else if (degrees > 112.5 && degrees <= 157.5) {
        return 3;
    } else if (degrees > 157.5 && degrees <= 202.5) {
        return 4;
    } else if (degrees > 202.5 && degrees <= 247.5) {
        return 5;
    } else if (degrees > 247.5 && degrees <= 292.5) {
        return 6;
    } else if (degrees > 292.5 && degrees <= 337.5) {
        return 7;
    }
    return 0;
}

/**
 * Returns an array of cardinal direction acronyms based on a given degree range.
 * 
 * @param minDegrees - The starting degree of the range (inclusive).
 * @param maxDegrees - The ending degree of the range (inclusive).
 * 
 * @remarks
 * - The function handles cases where `minDegrees` is greater than `maxDegrees`, indicating the range spans across the 0-degree point.
 * - The returned directions are based on the 8 cardinal points: N, NE, E, SE, S, SW, W, NW.
 * - Degrees should be provided in the range [0, 360). However, the function normalizes values outside this range.
 * 
 * @returns An array of direction acronyms that fall within the specified degree range.
 * 
 * @example
 * ```typescript
 * const directions = getDirectionsInRange(315, 45); // Returns ['N', 'NE', 'NW']
 * ```
 */
export const getDirectionsInRange = (minDegrees: number, maxDegrees: number): string[] => {
    // Normalize degrees to handle cases where degrees are below 0 or above 360
    minDegrees = ((minDegrees % 360) + 360) % 360;
    maxDegrees = ((maxDegrees % 360) + 360) % 360;

    const directionRanges = [
        { degrees: 0, dir: 'N' },
        { degrees: 360, dir: 'N' },
        { degrees: 45, dir: 'NE' },
        { degrees: 90, dir: 'E' },
        { degrees: 135, dir: 'SE' },
        { degrees: 180, dir: 'S' },
        { degrees: 225, dir: 'SW' },
        { degrees: 270, dir: 'W' },
        { degrees: 315, dir: 'NW' }
    ];

    const directions: string[] = [];

    directionRanges.forEach((range) => {
        if (minDegrees < maxDegrees) {
            if (
                (minDegrees <= range.degrees && maxDegrees >= range.degrees)
            ) {
                directions.push(range.dir);
            }
        } else if (minDegrees > maxDegrees) {
            if (
                // ((minDegrees <= 360 && minDegrees >= range.degrees) || (maxDegrees <= range.degrees && maxDegrees >= 0))
                ((range.degrees >= minDegrees && range.degrees <= 360) || (range.degrees >= 0 && range.degrees <= maxDegrees))
            ) {
                directions.push(range.dir);
            }
        }
    });

    return removeDuplicatesFromArray(directions)
}

/**
 * Adds a given amount to the current degrees and wraps the result to ensure it's between 0 and 359.
 * 
 * @param currentDegrees - The current degree value (should be between 0 and 359).
 * @param amountToAdd - The amount of degrees to add (can be negative to subtract).
 * @returns The new degree value wrapped between 0 and 359.
 */
export const sumDegrees = (currentDegrees: number, amountToAdd: number): number => {
    let newDegrees = (currentDegrees + amountToAdd) % 360;
    if (newDegrees < 0) {
        newDegrees += 360;  // Ensure it's positive
    }
    return Math.round(newDegrees);
}