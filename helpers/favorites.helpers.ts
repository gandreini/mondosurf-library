import { postApiAuthCall } from "communication/api";
import toastService from 'mondosurf-library/services/toastService';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import ISurfSpotPreview from "mondosurf-library/model/iSurfSpotPreview";
import { store } from "mondosurf-library/redux/store";
import { setFavoriteSpots } from "mondosurf-library/redux/userSlice";
import { deleteLocalStorageData, getLocalStorageData, setLocalStorageData } from "proxies/localStorage.helpers";
import { mondoTranslate } from "proxies/mondoTranslate";

/**
* Adds a spot to the user's favourites.
*
* @param   {number} spotId Id of the spot.
* @param   {string} spotName Name of the spot.
* @returns {Promise} A Promise of the post call to add the favourite.
*/
export const addSpotToFavourites = (spotId: number, spotName: string): Promise<any> => {
    const state = store.getState();
    const favoriteSpots: ISurfSpotPreview[] | null = state.user.favoriteSpots // Redux

    // The user hasn't permission to add favourites
    if (!hasProPermissions()) {
        return Promise.reject();
    }

    // Always clean up the suspended_favorite localStorage
    deleteLocalStorageData('suspended_favorite');

    // Ensure spotId is a number
    spotId = typeof spotId === 'string' ? parseInt(spotId) : spotId;

    // The spot is already in the favourites list, no need to call the API
    if (favoriteSpots != null && checkIfSpotIdIsInFavorites(favoriteSpots, spotId)) {
        toastService.success(mondoTranslate('toast.favourites.already_added_to_favourites', { spotName: spotName }));
        return Promise.resolve(true);
    }

    // The spot is not in the favourites list, we call the API
    const accessToken: string = state.user.accessToken // Redux

    return new Promise((resolve, reject) => {
        postApiAuthCall('user-add-favourite', accessToken, {
            spot_id: spotId
        })
            .then((response: any) => {
                if (response && response.status === 200 && response.data.success === true) {
                    store.dispatch(setFavoriteSpots(response.data.favourites_surf_spots)); // To redux state
                    toastService.success(spotName + ' added to your favourites!', 'data-test-toast-favorite-added');
                    resolve(true);
                } else {
                    toastService.error(mondoTranslate('toast.favourites.added_to_favourites_error'));
                    reject();
                }
            })
            .catch(function (error) {
                if (error.response.data.code === "FAVOURITE_ALREADY_SAVED") {
                    toastService.success(mondoTranslate('toast.favourites.already_added_to_favourites', { spotName: spotName }));
                    resolve(true);
                } else {
                    toastService.error(mondoTranslate('toast.favourites.added_to_favourites_error'));
                    reject(error);
                }
            });
    })
}

/**
* Removes a surf spots from the user's favourites.
*
* @param   {number} spotId Id of the spot.
* @param   {string} spotName Name of the spot.
* @returns {Promise} A Promise of the post call to remove the favourite.
*/
export const removeSpotFromFavourites = (spotId: number, spotName: string) => {
    const state = store.getState();
    const favoriteSpots = state.user.favoriteSpots // Redux.

    // Ensure spotId is a number
    spotId = typeof spotId === 'string' ? parseInt(spotId) : spotId; // Why do I have to do this?

    // The spot is not in the favourites list, no need to call the API
    if (favoriteSpots != null && !checkIfSpotIdIsInFavorites(favoriteSpots, spotId)) {
        toastService.success(mondoTranslate('toast.favourites.favourites_not_found_to_remove', { spotName: spotName }));
        return Promise.resolve(true);
    }

    // The spot is in the favourites list, we call the API to remove it.
    const accessToken: string = state.user.accessToken // Redux
    return new Promise((resolve, reject) => {
        postApiAuthCall('user-remove-favourite', accessToken, {
            spot_id: spotId
        })
            .then((response: any) => {
                if (response && response.status === 200 && response.data.success === true) {
                    store.dispatch(setFavoriteSpots(response.data.favourites_surf_spots)); // To redux state
                    toastService.success(mondoTranslate('toast.favourites.removed_from_favourites', { spotName: spotName }), 'data-test-toast-favorite-removed');
                    resolve(true);
                } else {
                    toastService.error(mondoTranslate('toast.favourites.removed_from_favourites_error'));
                    reject();
                }
            })
            .catch(function (error) {
                if (error.response.data.code === "FAVOURITE_NOT_FOUND") {
                    toastService.success(mondoTranslate('toast.favourites.favourites_not_found_to_remove', { spotName: spotName }));
                    resolve(true);
                } else {
                    toastService.error(mondoTranslate('toast.favourites.removed_from_favourites_error'));
                    reject(error);
                }
            });
    });
};

/**
 * Checks if a surf spot with a given ID is present in the list of favorite surf spots.
 * 
 * @param {ISurfSpotPreview[] | null} favorites - An array of surf spot objects to search within.
 * @param {number} spotId - The ID of the surf spot to search for in the favorites array.
 * @returns {boolean} Returns `true` if a surf spot with the given ID is found in the favorites array, otherwise `false`.
 * 
 * @example
 * const isSpotInFavorites = checkIfSpotIdIsInFavorites(favorites, 102);
 * console.log(isSpotInFavorites); // true
 */
export const checkIfSpotIdIsInFavorites = (favorites: ISurfSpotPreview[] | null, spotId: number): boolean => {
    if (favorites == null) return false;
    return favorites.some(spot => spot.id === spotId);
}

/**
 * Sets the spot that the user is willing to add to their favorites.
 * This is used to add the favorite in a lazy way, after the user has activated a Pro membership.
 *
 * @param   {number} favoriteSpotId Id of the spot that needs to be added to the favorites.
 * @param   {string} favoriteSpotName Name of the spot that needs to be added to the favorites.
 * @returns {void}
 */
export const setSuspendedFavorite = (favoriteSpotId: number, favoriteSpotName: string) => {
    setLocalStorageData("suspended_favorite", JSON.stringify({ id: favoriteSpotId.toString(), name: favoriteSpotName }));
}

/**
 * Checks the localStorage item 'suspended_favorite' and (if that's present) it add the spot to the favorites.
 * The localStorage 'suspended_favorite' is then deleted.
 *
 * @returns {void}
 */
export const addFavoriteFromSuspendedFavorite = () => {
    getLocalStorageData('suspended_favorite').then((response) => {
        if (response) {
            const favoriteSpot = JSON.parse(response);
            addSpotToFavourites(parseInt(favoriteSpot.id), favoriteSpot.name);
        }
    });
    deleteLocalStorageData('suspended_favorite');
}