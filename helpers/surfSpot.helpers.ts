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

/**
 * Converts a range of degrees into a readable list of cardinal and intercardinal directions.
 * 
 * This function takes a minimum and maximum degree value, normalizes them within the 0 to 360-degree range, 
 * and returns a list of directions that fall within this range. The directions are derived based on standard 
 * cardinal and intercardinal points (N, NE, E, SE, S, SW, W, NW).
 * 
 * The function identifies the octant (45-degree sector) in which each degree parameter falls and compiles 
 * a list of all directions from the starting octant to the ending one. If the range crosses the 0-degree point, 
 * the function correctly handles the wraparound.
 * 
 * @param minDegrees - The starting degree of the range (inclusive). Values outside the 0-360 range will be normalized.
 * @param maxDegrees - The ending degree of the range (inclusive). Values outside the 0-360 range will be normalized.
 * @returns An array of strings representing the cardinal and intercardinal directions within the specified degree range.
 * 
 */
export const readableDirectionFromDegreesRange = (minDegrees: number, maxDegrees: number): string[] => {
    // Array to return
    let returnArray = [];

    // Normalize degrees to handle cases where degrees are below 0 or above 360
    minDegrees = ((minDegrees % 360) + 360) % 360;
    maxDegrees = ((maxDegrees % 360) + 360) % 360;

    // Definitions of the various sectors/octants
    const octants = [
        { minDegrees: 0, maxDegrees: 45, startDirection: "N", endDirection: "NE" },
        { minDegrees: 45, maxDegrees: 90, startDirection: "NE", endDirection: "E" },
        { minDegrees: 90, maxDegrees: 135, startDirection: "E", endDirection: "SE" },
        { minDegrees: 135, maxDegrees: 180, startDirection: "SE", endDirection: "S" },
        { minDegrees: 180, maxDegrees: 225, startDirection: "S", endDirection: "SW" },
        { minDegrees: 225, maxDegrees: 270, startDirection: "SW", endDirection: "W" },
        { minDegrees: 270, maxDegrees: 315, startDirection: "W", endDirection: "NW" },
        { minDegrees: 315, maxDegrees: 360, startDirection: "NW", endDirection: "N" }
    ]

    // Finds the octant for the min degrees
    const minDegreesOctant = returnDirectionOctant(minDegrees, octants);
    let degreesIncreased = sumDegrees(minDegrees, 45);
    returnArray.push(octants[minDegreesOctant].endDirection);

    // Rearranges the array, so that the minDegreesOctant is removed, and the following one is the first
    const rearrangedOctants = octants.slice(minDegreesOctant + 1).concat(octants.slice(0, minDegreesOctant));

    // Loops the rearranged octants
    for (let i = 0; i < rearrangedOctants.length; i++) {
        // Break when we are in the octant of the max degrees
        if (maxDegrees < rearrangedOctants[i].maxDegrees &&
            maxDegrees >= rearrangedOctants[i].minDegrees) break;

        returnArray.push(rearrangedOctants[i].endDirection);
        degreesIncreased = sumDegrees(degreesIncreased, 45);
    }

    return returnArray;
}

/**
 * Determines the octant in which a specific direction falls.
 * 
 * This function is designed to identify the octant (a 45-degree sector) that a given direction degree falls into. 
 * It's based on a predefined set of octants, each representing a cardinal or intercardinal direction (N, NE, E, SE, etc.).
 * Each octant is defined by a minimum and maximum degree value, indicating its range.
 * 
 * The function iterates through the list of octants and returns the index of the octant where the specified degree fits.
 * Special case handling is done for 0 degrees, which is considered to fall into the last octant (index 7, representing NW to N).
 * 
 * @param direction - The degree (from 0 to 360) representing the direction we are checking. It's assumed to be normalized within this range.
 * @param octants - An array of objects, each representing an octant. Each object should have 'minDegrees' and 'maxDegrees' properties defining the octant's range.
 * @returns The index (0-based) of the octant in which the 'direction' falls. Returns 0 as a fallback, though standard usage should never hit this case.
 * 
 */
const returnDirectionOctant = (direction: number, octants: any[]): number => {
    // Case direction = 0
    if (direction === 0) return 7;

    for (let i: number = 0; i < octants.length; i++) {
        if (direction > octants[i].minDegrees && direction <= octants[i].maxDegrees) return i;
    }
    // Fallback, should never go here!
    return 0;
}

// ---


/**
 * Returns an array of readable directions (i.e. "NW", "N", "NE") given a range in degrees with a min and max.
 *
 * @param   {number} degreesFrom Degrees start of the range.
 * @param   {number} degreesTo Degrees end of the range.
 * @returns {string[]} Array of strings picked from: "N", "NE", "E", "SE", "S", "SW", "W", "NW".
 */
/* 
// DEPRECATED
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
} */

/**
 * Returns the octant index (0 to 7) of a given direction in degrees.
 *
 * @param   {number} degrees A direction in degrees.
 * @returns {number} The ID of the octant, where "N" is 0, "NE" is 1, "E" is 2...
 */
/*
// DEPRECATED
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
 */