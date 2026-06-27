import { geolocationIsAuthorized } from "mondosurf-library/redux/appConfigSlice";
import { store } from "mondosurf-library/redux/store";
import { getLocalStorageData } from "proxies/localStorage.helpers";

/**
 * Retrieves the geolocation auth state and writes it in Redux..
 *
 * @returns {void}
 */
export const retrieveGeolocationAuth = () => {
    getLocalStorageData('geolocation_authorization').then(geolocationAuth => {
        if (geolocationAuth && geolocationAuth === 'true') {
            store.dispatch(geolocationIsAuthorized());
        }
    });
}