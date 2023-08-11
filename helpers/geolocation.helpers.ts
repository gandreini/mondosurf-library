import { Geolocation, Position } from '@capacitor/geolocation';

import { geolocationIsAuthorized } from "../redux/appConfigSlice";
import { store } from "../redux/store";
import { getPlatform } from "./device.helpers";
import { setLocalStorageData } from "./localStorage.helpers";
import { getLocalStorageData } from "./localStorage.helpers";

/**
 * Function that returns a promise to retrieve the user's device lat and lng.
 * It also writes a local storage variable to remember that the user accepted the geolocation.
 * Uses Javascript geolocation.getCurrentPosition for web, and Capacitor geolocation.getCurrentPosition for ios/android.
 * More resources here: https://capacitorjs.com/docs/apis/geolocation#getcurrentposition
 * 
 * @returns {Promise} Returns a promise. 
 */
export function getUserPosition(): Promise<GeolocationPosition | Position> {
    let geoPromise: any; // Initially set as any, it will be set to a Promise.

    // Fake values retrieved from .env (only for testing).
    if (process.env.REACT_APP_FAKE_USER_LAT && process.env.REACT_APP_FAKE_USER_LNG) {
        geoPromise = new Promise((resolve, reject) => {
            resolve(
                {
                    coords:
                    {
                        latitude: Number(process.env.REACT_APP_FAKE_USER_LAT),
                        longitude: Number(process.env.REACT_APP_FAKE_USER_LNG)
                    }
                }
            )
        }
        );
        return geoPromise;
    }

    if (getPlatform() === 'web') {
        geoPromise = new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
                setLocalStorageData('geolocation_authorization', 'true');
                store.dispatch(geolocationIsAuthorized());
                resolve(pos);
            }, reject, {
                enableHighAccuracy: true,
                timeout: 8000, // maximum length of time the device is allowed to take in order to return a position
                maximumAge: 20000 // 20 seconds cached position age
            })
        );
    } else if (getPlatform() === 'android' || getPlatform() === 'ios') {
        geoPromise = new Promise((resolve, reject) =>
            Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 8000, // maximum length of time the device is allowed to take in order to return a position
                maximumAge: 20000 // 20 seconds cached position age
            }).then(pos => {
                setLocalStorageData('geolocation_authorization', 'true');
                store.dispatch(geolocationIsAuthorized());
                resolve(pos)
            }).catch(err => { reject(err) })

        );
    }
    return geoPromise;
}

/**
 * Retrieves the geolocation auth state and writes it in Redux..
 *
 * @returns {void}
 */
export const retrieveGeolocationAuth = () => {
    getLocalStorageData('geolocation_authorization').then((response) => {
        if (response && response === 'true') {
            store.dispatch(geolocationIsAuthorized());
        }
    });
}