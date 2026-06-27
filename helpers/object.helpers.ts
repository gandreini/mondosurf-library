/**
 * Deep cloning of objects.
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

/**
 * Safely retrieves the value at the specified path within an object.
 * 
 * @param obj The object from which to extract the property.
 * @param path The path to the property in the object. Can be a dot-separated string or an array of strings/numbers.
 * @param defaultValue The default value to return if the property path does not exist. (Optional)
 * @returns The value at the specified path or the default value if the path is not found.
 */
export const getObjectNestedValue = (obj: Record<any, any>, path: string | string[], defaultValue?: any): any => {
    // Convert path to array if it's a string
    const pathArray = Array.isArray(path) ? path : path.split('.').map(p => p.replace(/\[(\w+)\]/g, '.$1')).filter(Boolean);

    // Reduce the path array to access the nested value
    const result = pathArray.reduce((currentObject, key) => {
        return (currentObject !== null && currentObject !== undefined) ? currentObject[key] : undefined;
    }, obj);

    // Return the result if it's not undefined, otherwise return the default value
    return result !== undefined ? result : defaultValue;
}