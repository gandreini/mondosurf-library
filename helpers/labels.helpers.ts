import { store } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';

/**
 * Returns a full translatable direction label.
 *
 * @param   {string | undefined} direction Direction provided as "A", "L" or "R".
 * @returns {returnType} Direction label in a readable format.
 */
export const returnDirectionLabel = (direction: string | undefined): string | undefined => {
    switch (direction) {
        case 'A':
            return mondoTranslate('basics.a_frame');
        case 'L':
            return mondoTranslate('basics.left');
        case 'R':
            return mondoTranslate('basics.right');
        case undefined:
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns a full translatable bottom label.
 * Options: 
 * 0 - Not available, 
 * 1 - Sand, 
 * 2 - Sand and rocks, 
 * 3 - Rocks, 
 * 4 - Rocks and sand, 
 * 5 - Coral reef, 
 * 6 - Coral reef and sand, 
 * 7 - Boulders/Big rocks, 
 * 8 - Cobbles
 * 
 * @param {string | undefined} bottomId Number id of the bottom.
 * @returns {string | undefined} Bottom of the spot described with a full label.
 */
export function returnBottomLabel(
    bottomId: string | undefined
): string | undefined {

    switch (bottomId) {
        case 'NA':
            return mondoTranslate('basics.bottom_not_available');
        case 'SN':
            return mondoTranslate('basics.sand');
        case 'SR':
            return mondoTranslate('basics.sand_rocks');
        case 'RK':
            return mondoTranslate('basics.rocks');
        case 'RS':
            return mondoTranslate('basics.rocks_sand');
        case 'CR':
            return mondoTranslate('basics.coral_reef');
        case 'CS':
            return mondoTranslate('basics.coral_reef_sand');
        case 'BD':
            return mondoTranslate('basics.boulders');
        case 'CB':
            return mondoTranslate('basics.cobbles');
        case undefined:
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns a full translatable month short label.
 * 
 * @param {number} monthId Number representing the month (from 1 to 12).
 */
export function returnMonthShortLabel(
    monthId: number
): string {

    switch (monthId) {
        case 1:
            return mondoTranslate('months_short.1');
        case 2:
            return mondoTranslate('months_short.2');
        case 3:
            return mondoTranslate('months_short.3');
        case 4:
            return mondoTranslate('months_short.4');
        case 5:
            return mondoTranslate('months_short.5');
        case 6:
            return mondoTranslate('months_short.6');
        case 7:
            return mondoTranslate('months_short.7');
        case 8:
            return mondoTranslate('months_short.8');
        case 9:
            return mondoTranslate('months_short.9');
        case 10:
            return mondoTranslate('months_short.10');
        case 11:
            return mondoTranslate('months_short.11');
        case 12:
            return mondoTranslate('months_short.12');
        default:
            return "";
    }
}

/**
 * Returns a full translatable month full label.
 * 
 * @param {number} monthId Number representing the month (from 1 to 12).
 */
export function returnMonthLongLabel(
    monthId: number
): string {

    switch (monthId) {
        case 1:
            return mondoTranslate('months_long.1');
        case 2:
            return mondoTranslate('months_long.2');
        case 3:
            return mondoTranslate('months_long.3');
        case 4:
            return mondoTranslate('months_long.4');
        case 5:
            return mondoTranslate('months_long.5');
        case 6:
            return mondoTranslate('months_long.6');
        case 7:
            return mondoTranslate('months_long.7');
        case 8:
            return mondoTranslate('months_long.8');
        case 9:
            return mondoTranslate('months_long.9');
        case 10:
            return mondoTranslate('months_long.10');
        case 11:
            return mondoTranslate('months_long.11');
        case 12:
            return mondoTranslate('months_long.12');
        default:
            return "";
    }
}

/**
 * Returns a full translatable wetsuit label.
 * 
 * @param {number} wetsuitId Number representing the wetsuit (from 1 to 5).
 */
export function returnWetsuitLabel(
    wetsuitId: number
): string {

    switch (wetsuitId) {
        case 1:
            return mondoTranslate('wetsuits.1');
        case 2:
            return mondoTranslate('wetsuits.2');
        case 3:
            return mondoTranslate('wetsuits.3');
        case 4:
            return mondoTranslate('wetsuits.4');
        case 5:
            return mondoTranslate('wetsuits.5');
        default:
            return "";
    }
}

/**
 * Returns tide label give the code.
 * 
 * @param tide string Direction provided as "L", "M" or "H".
 */
export function returnTideLabel(
    tide: string
): string {
    switch (tide) {
        case 'L':
            return mondoTranslate('tide.low');
        case 'M':
            return mondoTranslate('tide.medium');
        case 'H':
            return mondoTranslate('tide.high');
        default:
            return '';
    }
}

/**
 * Returns tide movement label give the code.
 * 
 * @param tide string Direction provided as "R", "F".
 */
export function returnMovementTideLabel(
    tideMovement: string
): string {
    switch (tideMovement) {
        case 'R':
            return mondoTranslate('tide.rising');
        case 'F':
            return mondoTranslate('tide.falling');
        default:
            return '';
    }
}

/**
 * Returns length units label given "mt" or ft".
 * 
 * @param length string Length provided as "mt", "ft".
 */
export function returnLengthUnitLabel(): string {
    const state = store.getState();
    const lengthUnit: string = state.units.lengthUnit; // Redux.
    switch (lengthUnit) {
        case 'mt':
            return mondoTranslate('units.meters');
        case 'ft':
            return mondoTranslate('units.feet');
        default:
            return mondoTranslate('units.meters');
    }
}

/**
 * Returns short length units label given "mt" or ft".
 * 
 * @param length string Length provided as "mt", "ft".
 */
export function returnLengthUnitShortLabel(): string {
    const state = store.getState();
    const lengthUnit: string = state.units.lengthUnit; // Redux.
    switch (lengthUnit) {
        case 'mt':
            return mondoTranslate('units.meters_short');
        case 'ft':
            return mondoTranslate('units.feet_short');
        default:
            return mondoTranslate('units.meters_short');
    }
}

/**
 * Returns speed units label given "kph" or "kn".
 * 
 * @param speed string Speed provided as "kph", "kn".
 */
export function returnSpeedUnitLabel(): string {
    const state = store.getState();
    const speedUnit: string = state.units.speedUnit; // Redux.
    switch (speedUnit) {
        case 'kph':
            return mondoTranslate('units.kph');
        case 'kn':
            return mondoTranslate('units.kn');
        default:
            return mondoTranslate('units.kph');
    }
}

/**
 * Returns speed units short label given "kph" or "kn".
 * 
 * @param speed string Speed provided as "kph", "kn".
 */
export function returnSpeedUnitShortLabel(): string {
    const state = store.getState();
    const speedUnit: string = state.units.speedUnit; // Redux.
    switch (speedUnit) {
        case 'kph':
            return mondoTranslate('units.kph_short');
        case 'kn':
            return mondoTranslate('units.kn_short');
        default:
            return mondoTranslate('units.kph_short');
    }
}

/**
 * Returns label for wave length.
 * 
 * @param {string | undefined} waveLengthId Value the wave length.
 * @returns {string | undefined} The readable label for the wave length.
 */
export function returnWaveLengthLabel(
    waveLengthId: string | undefined
): string | undefined {

    switch (waveLengthId) {
        case '1':
            return mondoTranslate('wave_length.1');
        case '2':
            return mondoTranslate('wave_length.2');
        case '3':
            return mondoTranslate('wave_length.3');
        case '4':
            return mondoTranslate('wave_length.4');
        case '5':
            return mondoTranslate('wave_length.5');
        case undefined:
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns label for wave steepness.
 * 
 * @param {string | undefined} waveSteepnessId Value the wave steepness.
 * @returns {string | undefined} The readable label for the wave steepness.
 */
export function returnWaveSteepnessLabel(
    waveSteepnessId: string | undefined
): string | undefined {

    switch (waveSteepnessId) {
        case '1':
            return mondoTranslate('wave_steepness.1');
        case '2':
            return mondoTranslate('wave_steepness.2');
        case '3':
            return mondoTranslate('wave_steepness.3');
        case '4':
            return mondoTranslate('wave_steepness.4');
        case '5':
            return mondoTranslate('wave_steepness.5');
        case undefined:
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns label for wave frequency.
 * 
 * @param {string | undefined} frequencyId Value the wave frequency.
 * @returns {string | undefined} Return description.
 */
export function returnFrequencyLabel(
    frequencyId: string | undefined
): string | undefined {

    switch (frequencyId) {
        case '1':
            return mondoTranslate('frequency.1');
        case '2':
            return mondoTranslate('frequency.2');
        case '3':
            return mondoTranslate('frequency.3');
        case '4':
            return mondoTranslate('frequency.4');
        case undefined:
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns label for wave quality.
 * 
 * @param {string | undefined} qualityId Value the wave quality.
 * @returns {string | undefined} Returns the label for the wave quality.
 */
export function returnQualityLabel(
    qualityId: string | undefined
): string | undefined {

    switch (qualityId) {
        case '1':
            return mondoTranslate('quality.1');
        case '2':
            return mondoTranslate('quality.2');
        case '3':
            return mondoTranslate('quality.3');
        case '4':
            return mondoTranslate('quality.4');
        case '5':
            return mondoTranslate('quality.5');
        case '5':
            return undefined;
        default:
            return undefined;
    }
}

/**
 * Returns label for surf spot required experience.
 * 
 * @param   {string} experienceId Value the experience.
 * @returns {string} Text description of the level.
 */
export function returnExperienceLabel(
    experienceId: string
): string {

    switch (experienceId) {
        case '1':
            return mondoTranslate('experience.beginners');
        case '2':
            return mondoTranslate('experience.intermediate');
        case '3':
            return mondoTranslate('experience.advanced');
        default:
            return "";
    }
}

/**
 * Returns label for the user profile experience.
 * Compared to 'returnExperienceLabel', it provides
 * labels in singular (rather than plural).
 * 
 * @param   {number} experience Value the experience.
 * @returns {string} Text description of the user's surfing level.
 */
export function returnProfileLevelLabel(
    experience: number
): string {

    switch (experience) {
        case 1:
            return mondoTranslate('experience.beginner');
        case 2:
            return mondoTranslate('experience.intermediate');
        case 3:
            return mondoTranslate('experience.advanced');
        default:
            return "";
    }
}

/**
 * Returns label for type of surfboard to be used in a given surf spot.
 * 
 * @param {string} boardId Value the board type.
 */
export function returnBoardTypeLabel(
    boardId: string
): string {

    switch (boardId) {
        case '1':
            return mondoTranslate('surfboard_type.softboard');
        case '2':
            return mondoTranslate('surfboard_type.short');
        case '3':
            return mondoTranslate('surfboard_type.mid_retro');
        case '4':
            return mondoTranslate('surfboard_type.long');
        case '5':
            return mondoTranslate('surfboard_type.gun');
        default:
            return "";
    }
}

/**
 * Returns label for the crowd in a given surf spot.
 * 
 * @param {string | undefined} crowdId Value the crowd in the spot.
 * @returns {string | undefined} Returns the label for the crowd.
 */
export function returnCrowdLabel(
    crowdId: string | undefined
): string | undefined {

    switch (crowdId) {
        case '1':
            return mondoTranslate('crowd.empty');
        case '2':
            return mondoTranslate('crowd.few_surfers');
        case '3':
            return mondoTranslate('crowd.moderate');
        case '4':
            return mondoTranslate('crowd.crowded');
        case '5':
            return mondoTranslate('crowd.ultra_crowded');
        case undefined:
            return undefined
        default:
            return undefined;
    }
}

/**
 * Function to manually add translations to be added to the json translations files.
 * This function doesn't do anything and is never used.
 * It is only scraped by the script that fills the translations file.
 */
export function additionalTranslations(): void {
    const basicsSurfboard = mondoTranslate('basics.surfboard');
    const basicsExperience = mondoTranslate('basics.experience');
    const basicsMonths = mondoTranslate('basics.months');
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
