/**
 * Casts a string into a boolean.
 *
 * @param   {string} stringToConvert String to convert.
 * @returns {boolean} String converted: true or false.
 */
export const stringToBool = (stringToConvert: string): boolean => {
    let returnBoolean;
    if (stringToConvert.toLocaleLowerCase() === "true") {
        returnBoolean = true;
    } else {
        returnBoolean = false;
    }
    return returnBoolean;
}

/**
 * Truncates a given string after N characters.
 * 
 * @param   {string} text Given string to truncate.
 * @param   {number} characters Number after how many characters to cut the string.
 * @returns {string} Text cut after N characters.
 */
export function truncateTextAfterNCharacters(text: string, characters: number): string {
    let stringToReturn: string = text;
    if (text.length > characters) {
        stringToReturn = text.slice(0, characters) + '...';
    }
    return stringToReturn;
}

/**
 * Method that verifies if a given string is a correct email.
 * 
 * @param   {string} email  Given email to be verified.
 * @returns {boolean} True if the email is correct.
 */
export const checkIfEmailIsValid = (email: string) => {
    var validRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}