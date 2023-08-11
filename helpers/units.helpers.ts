import { store } from '../redux/store';

/**
 * Converts size in meters of feet.
 * Default given value is always meters.
 * 
 * @param size number Size given in meters.
 * @param unit "mt" | "ft" Meters or feet.
 */
export function convertSizeFromMeters(
    size: number
): number {
    const state = store.getState();
    const lengthUnit: string = state.units.lengthUnit; // Redux.
    let returnSize = 0;
    if (lengthUnit === 'mt') {
        returnSize = size;
    } else if (lengthUnit === 'ft') {
        returnSize = size * 3.2808;
    }
    return returnSize;
}

/**
 * Converts speed in kilometers per hour of knots.
 * Default given value is always kilometers per hour.
 * 
 * @param speed number Speed given in kilometers per hour.
 * @param unit 'kmh' | 'kn' Kilometers per hour or knots.
 */
export function convertSpeedFromKph(
    speed: number
): number {
    const state = store.getState();
    const speedUnit: string = state.units.speedUnit; // Redux.
    let returnSpeed = 0;
    if (speedUnit === 'kph') {
        returnSpeed = speed;
    } else if (speedUnit === 'kn') {
        returnSpeed = speed / 1.852;
    }
    return returnSpeed;
}

/**
 * Converts temperature from Celsius to Fahrenheit degrees.
 * Default given value is always Celsius degrees.
 * 
 * @param temperature number Temperature give in Celsius degrees.
 * @param unit 'c' | 'f' Celsius or Fahrenheit.
 */
export function convertTemperatureFromC(
    temperature: number
): number {
    const state = store.getState();
    const temperatureUnit: string = state.units.temperatureUnit; // Redux.
    let returnTemperature = 0;
    if (temperatureUnit === 'c') {
        returnTemperature = temperature;
    } else if (temperatureUnit === 'f') {
        returnTemperature = (temperature * 9 / 5) + 32;
    }
    return returnTemperature;
}

/**
 * Return an array with the size returned in the current unit.
 * 
 * @param inputArray number[] array of numbers to be converted.
 */
export function convertSizeFromMetersArray(inputArray: number[]): number[] {
    return inputArray.map(value => convertSizeFromMeters(value));
}

/**
 * Return an array with the speed returned in the current unit.
 * 
 * @param inputArray number[] array of numbers to be converted.
 */
export function convertSpeedFromKphArray(inputArray: number[]): number[] {
    return inputArray.map(value => convertSpeedFromKph(value));
}

/**
 * Return an array with the temperature returned in the current unit.
 * 
 * @param inputArray number[] array of numbers to be converted.
 */
export function convertTemperatureFromCArray(inputArray: number[]): number[] {
    return inputArray.map(value => convertTemperatureFromC(value));
}

/**
 * Converts degrees in the cartesian system.
 * 
 * @param inputArray number[] array of numbers to be converted.
 */

/**
 * Converts degrees in the cartesian system, given the angle in degrees
 * and parameters that describe the geometry.
 *
 * @param   {number} angleInDegrees Angle of the position in degrees.
 * @param   {number} centerX Position of the center of the system.
 * @param   {number} centerY Position of the center of the system.
 * @param   {number} circleRadius Radius of the system.
 * @returns {{x:number, y:number}}} Return description.
 */
export const polarToCartesian = (angleInDegrees: number, centerX: number, centerY: number, circleRadius: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + circleRadius * Math.cos(angleInRadians),
        y: centerY + circleRadius * Math.sin(angleInRadians)
    };
};

/**
 * X and Y in a cartesian system converted to degrees.
 *
 * @param   {number} x X position in cartesian system.
 * @param   {number} y Y position in cartesian system.
 * @returns {number} Degrees describing the position of the item.
 */
export const cartesianToPolar = (x: number, y: number): number => {
    let degrees = Math.atan(y / x) * (180 / Math.PI);
    if (x >= 0 && y < 0) {
        // First quadrant
        degrees = degrees + 90;
    } else if (x >= 0 && y >= 0) {
        // Second quadrant
        degrees = degrees + 90;
    } else if (x < 0 && y >= 0) {
        // Third quadrant
        degrees = degrees + 270;
    } else if (x < 0 && y < 0) {
        // Fourth quadrant
        degrees = degrees + 270;
    }
    return degrees;
};