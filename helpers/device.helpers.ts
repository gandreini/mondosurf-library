import { DeviceUUID } from 'device-uuid';

import { store } from "../redux/store";

/**
* Returns true if mobile device.
* Not to confuse with "getPlatform()" which checks if Mondo Surf is running
* as an app.
*
* @returns {boolean} True if the device is mobile.
*/
export function isMobile(): boolean {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check the with of the device and returns true if it's bigger that the provided minWidth.
 *
 * @param   {number} minWidth Returns true if the screen is wider than this value.
 * @returns {boolean} True if screen is wider than the provided value.
 */
export function screenWiderThan(minWidth: number): boolean {
    const mediaQuery = window.matchMedia('(min-width: ' + minWidth.toString() + 'px)');
    if (mediaQuery.matches) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the type of platform that react is running on from Redux.
 * Values can be "web", "ios", "android".
 * 
 * @returns {"web" | "ios" | "android"} Values: "web", "ios", "android".
 */
export function getPlatform(): "web" | "ios" | "android" {
    const state = store.getState();
    const platform = state.appConfig.platform; // Redux.
    return platform;
}

/**
 * Returns true if running on iOS or Android App.
 * False if it's on web.
 * 
 * @returns {boolean} True for iOS or Android App.
 */
export function isApp(): boolean {
    if (getPlatform() === "ios" || getPlatform() === "android") return true;
    return false;
}

/**
 * Checks if there's a device_id in the localStorage.
 * If there's no device_id, it creates one and returns it.
 * If there's already a device_id, it returns it.
 * The device_id is a unique identifier of the device.
 * 
 * @returns {string} The unique id of the device.
 */
export const getDeviceId = (): string => {
    if (!localStorage.getItem('device_id')) {
        const du = new DeviceUUID().parse();
        const dua = [
            du.platform,
            du.os,
            du.cpuCores,
            du.isDesktop,
            du.isMobile,
            du.isTablet,
            du.isWindows,
            du.isLinux,
            du.isLinux64,
            du.isMac,
            du.isiPad,
            du.isiPhone,
            du.isiPod,
            du.isSmartTV,
            du.pixelDepth,
            du.isTouchScreen
        ];
        const uuid = du.hashMD5(dua.join(':'));
        localStorage.setItem('device_id', uuid);
        return uuid;
    } else {
        return localStorage.getItem('device_id')!;
    }
}