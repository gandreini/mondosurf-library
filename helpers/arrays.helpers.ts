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
 * Removes the first and last element from an array.
 *
 * @param   {T[]} array Array of elements of type T.
 * @returns {T[]} Array without the first and last elements.
 */
export const removeFirstAndLastItem = <T>(array: T[]): T[] => {
    if (array === undefined) array = [];
    return array.slice(1, array.length - 1);
}

/**
 * Removes duplicate values from an array.
 *
 * @param {T[]} arr - The array from which to remove duplicates.
 * @returns {T[]} A new array with duplicates removed.
 * @template T - The type of elements in the array.
 */
export const removeDuplicatesFromArray = <T>(arr: T[]): T[] => {
    // Creating a Set automatically removes duplicates, as sets only allow unique values.
    const uniqueSet: Set<T> = new Set(arr);

    // Convert the Set back to an array.
    const uniqueArray: T[] = Array.from(uniqueSet);

    return uniqueArray;
}

