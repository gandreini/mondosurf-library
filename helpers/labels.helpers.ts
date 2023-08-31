/**
 * Returns the wetsuit font icon string to be used by css, given the wetsuit code (from 1 to 5).
 * @param wetsuitCode number Is the code of the wetsuit.
 * @returns wetsuit icon string
 */
export function returnWetsuitIcon(wetsuitCode: number): 'swimsuit' | 'springsuit' | 'wetsuit-full' | 'wetsuit-winter' | 'wetsuit-freeze1' {
    switch (wetsuitCode) {
        case 1: {
            return 'swimsuit';
        }
        case 2: {
            return 'springsuit';
        }
        case 3: {
            return 'wetsuit-full';
        }
        case 4: {
            return 'wetsuit-winter';
        }
        case 5: {
            return 'wetsuit-freeze1';
        }
        default: {
            return 'swimsuit';
        }
    }
}

/**
 * Returns a direction label like "N", "NW", "SSE", given the direction in degrees.
 * 
 * @param direction number Direction as number (degrees).
 * @returns string Acronym of the direction as "N", "NW", "SSE"...
 */
export function directionAcronym(direction: number): string {
    let returnString = '';
    if (direction >= 348.75 || direction <= 11.25) {
        returnString = "N";
    } else if (direction > 11.25 && direction < 33.75) {
        returnString = "NNE";
    } else if (direction >= 33.75 && direction <= 56.25) {
        returnString = "NE";
    } else if (direction > 56.25 && direction < 78.75) {
        returnString = "ENE";
    } else if (direction >= 78.75 && direction <= 101.25) {
        returnString = "E";
    } else if (direction > 101.25 && direction < 123.75) {
        returnString = "ESE";
    } else if (direction >= 123.75 && direction <= 146.25) {
        returnString = "SE";
    } else if (direction > 146.25 && direction < 168.75) {
        returnString = "SSE";
    } else if (direction >= 168.75 && direction <= 191.25) {
        returnString = "S";
    } else if (direction > 191.25 && direction < 213.75) {
        returnString = "SSW";
    } else if (direction >= 213.75 && direction <= 236.25) {
        returnString = "SW";
    } else if (direction > 236.25 && direction < 258.75) {
        returnString = "WSW";
    } else if (direction >= 258.75 && direction <= 281.25) {
        returnString = "W";
    } else if (direction > 281.25 && direction < 303.75) {
        returnString = "WNW";
    } else if (direction >= 303.75 && direction <= 326.25) {
        returnString = "NW";
    } else if (direction > 326.25 && direction < 348.75) {
        returnString = "NNW";
    }

    return returnString;
}

/**
 * Renders a readable description of the timezone offset, given the value as a number.
 * It receives 8.75, and returns GMT+08:45.
 *
 * @param   {number} value Value to be converted in readable string.
 * @returns {string} String like GMT+08:45.
 */
export function GTMOffsetLabel(value: number): string {
    let decimalLabel = ":00";
    let integerLabel = "00";

    // Decimals
    if (value.toString().includes(".")) {
        const decimal = value.toString().split(".")[1];
        switch (decimal) {
            case "5":
                decimalLabel = ":30";
                break;
            case "75":
                decimalLabel = ":45";
                break;
        }
    }

    // Minus/Plus.
    let minusPlusLabel = "+";
    if (value < 0) minusPlusLabel = "-";

    // Integer part.
    integerLabel = ('0' + Math.floor(Math.abs(value))).slice(-2)

    return "GMT" + minusPlusLabel + integerLabel + decimalLabel;
}
