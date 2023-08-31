import { returnMonthShortLabel } from "helpers/labels.helpers";

/**
 * Checks if a given item si present in an array.
 *
 * @param   {T[]} array Array to be checked.
 * @param   {T} item Item to be found.
 * @returns {boolean} True if the item is there.
 */
export function isInArray<T>(array: T[], item: T): boolean {
    return array.includes(item);
}

/**
 * Removes a given item from an array.
 *
 * @param   {any[]} array Array from which to remove the item.
 * @param   {any} item Item to remove.
 * @returns {any[]} Return array with the item removed (or the original array if there was no corresponding item).
 */
export function removeItemFromArray(array: any[], item: any): any[] {
    const itemIndex = array.indexOf(item);
    if (itemIndex !== -1) {
        array.splice(itemIndex, 1);
    }
    return array;
}

/**
 * Sort a multidimensional array by its second column.
 * 
 * @param   {Array<[any, number]>} inputArray Multidimensional array composed of anything and a number.
 * @returns {Array<[any, number]>} Sorted array by the values of its second column (number).
 */
export function sortMultiArraySecondColumn(inputArray: Array<[any, number]>): Array<[any, number]> {
    inputArray.sort(sortMultiArraySecondColumnMatch);
    return inputArray;
}

/**
 * Matching function that is used to sort the element of a multidimensional array
 * (used by previous function "sortMultiArraySecondColumn").
 * 
 * @param   {number[] | string[]} a Parameter to match with b.
 * @param   {number[] | string[]} b Parameter to match with a.
 * @returns {number} 0 if the elements are equal, otherwise -1 or 1.
 */
function sortMultiArraySecondColumnMatch(a: number[] | string[], b: number[] | string[]): number {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

/**
 * Function that returns an array with the short labels of months.
 * 
 * @returns {string[]} String array with months' labels (Jan, Feb...).
 */
export function monthsArray(): string[] {
    return [
        returnMonthShortLabel(1),
        returnMonthShortLabel(2),
        returnMonthShortLabel(3),
        returnMonthShortLabel(4),
        returnMonthShortLabel(5),
        returnMonthShortLabel(6),
        returnMonthShortLabel(7),
        returnMonthShortLabel(8),
        returnMonthShortLabel(9),
        returnMonthShortLabel(10),
        returnMonthShortLabel(11),
        returnMonthShortLabel(12)
    ];
}

/**
 * Removes the first and last element from an array.
 *
 * @param   {T[]} array Array of elements of type T.
 * @returns {T[]} Array without the first and last elements.
 */
export const removeFirstAndLastItem = <T>(array: T[]): T[] => {
    if (array === undefined) array = [];
    return array.slice(1, array.length - 1);
}