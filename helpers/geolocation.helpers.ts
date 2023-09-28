import { FAKE_USER_LAT, FAKE_USER_LNG } from "../../constants/localConstants";
import { getLocalStorageDataWeb, setLocalStorageDataWeb } from "../helpers/localStorage.helpers";
import { geolocationIsAuthorized } from "../redux/appConfigSlice";
import { store } from "../redux/store";

/**
 * Function that returns a promise to retrieve the user's device lat and lng.
 * It also writes a local storage variable to remember that the user accepted the geolocation.
 * Uses Javascript geolocation.getCurrentPosition for web.
 * 
 * @returns {Promise<GeolocationPosition>} Returns a promise. 
 */
export function getUserPositionWeb(): Promise<GeolocationPosition> {
    let geoPromise: Promise<GeolocationPosition>;

    // Fake values retrieved from .env (only for testing).
    if (FAKE_USER_LAT && FAKE_USER_LNG) {
        geoPromise = new Promise((resolve, reject) => {
            resolve(
                {
                    coords: {
                        latitude: Number(FAKE_USER_LAT),
                        longitude: Number(FAKE_USER_LNG),
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                }
            )
        }
        );
        return geoPromise;
    }

    geoPromise = new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
            setLocalStorageDataWeb('geolocation_authorization', 'true');
            store.dispatch(geolocationIsAuthorized());
            resolve(pos);
        }, reject, {
            enableHighAccuracy: true,
            timeout: 8000, // maximum length of time the device is allowed to take in order to return a position
            maximumAge: 20000 // 20 seconds cached position age
        })
    );
    return geoPromise;
}

/**
 * Retrieves the geolocation auth state and writes it in Redux.
 *
 * @returns {void}
 */
export const retrieveGeolocationAuthWeb = () => {
    const geolocationAuth = getLocalStorageDataWeb('geolocation_authorization');
    if (geolocationAuth !== null && geolocationAuth === 'true') {
        store.dispatch(geolocationIsAuthorized());
    }
}