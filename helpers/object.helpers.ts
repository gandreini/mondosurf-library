/**
 * Deep cloning of objects (no need to use lodash).
 * Use it like this:
 * const clonedObject = cloneObject<myType>(objectToBeCloned);
 * 
 * @param   {T} inputObject Object to be cloned. Type (T) passed as generics.
 * @returns {T} Cloned object.
 */
export const cloneObject = <T>(inputObject: T): T => {
    return JSON.parse(JSON.stringify(inputObject));
}
/*
Old version
export const cloneObject = (inputObject: object): object => {
    return JSON.parse(JSON.stringify(inputObject));
}
*/

/**
 * Check if the give object is empty.
 * 
 * @param   {object} inputObject Object to be checked.
 * @returns {boolean} True if empty, false if not.
 */
export const objectIsEmpty = (inputObject: object): boolean => {
    if (Object.entries(inputObject).length === 0) {
        return true;
    } else {
        return false;
    }
}

