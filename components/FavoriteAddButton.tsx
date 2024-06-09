// Client
'use client';

import { openModalToExecuteProAction } from 'features/modal/modal.helpers';
import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import {
    addFavoriteFromSuspendedFavorite,
    addSpotToFavourites,
    checkIfSpotIdIsInFavorites,
    removeSpotFromFavourites,
    setSuspendedFavorite
} from 'mondosurf-library/helpers/favorites.helpers';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import modalService from 'mondosurf-library/services/modalService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IFavouriteAddButton {
    spotId: number;
    spotName: string;
    addedCallback?: (spotId: number) => void;
    removedCallback?: (spotId: number) => void;
    context?: 'homeNearSpots' | 'subscriptionConfirmed' | 'region' | 'spotNearSpots' | 'search' | 'spotPageBigButton';
}

const FavoriteAddButton: React.FC<IFavouriteAddButton> = (props: IFavouriteAddButton) => {
    // Redux.
    const logged = useSelector((state: RootState) => state.user.logged);
    const favoriteSpots = useSelector((state: RootState) => state.user.favoriteSpots);

    const [spotIsInFavourites, setSpotIsInFavourites] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (favoriteSpots != null) {
            // For some - unobvious - reason spot id is not always a number.
            const spotId = typeof props.spotId === 'number' ? props.spotId : parseInt(props.spotId);
            setSpotIsInFavourites(checkIfSpotIdIsInFavorites(favoriteSpots, spotId));
        }
    }, [props.spotId, favoriteSpots]);

    /**
     * Adds a spot to the user's favourites.
     */
    const onAddToFavourites = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.FavIconTap, {
            surfSpotName: props.spotName,
            action: 'add',
            context: props.context,
            surfSpotId: props.spotId
        });
        setLoading(true);
        addSpotToFavourites(props.spotId, props.spotName)
            .then((response) => {
                setSpotIsInFavourites(true);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
        e.preventDefault();
        e.stopPropagation();
    };

    /**
     * Removes a spot from the user's favourites.
     * Opens a modal for confirmation.
     */
    const onRemoveFromFavourites = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Tracking.
        Tracker.trackEvent(['mp'], TrackingEvent.FavIconTap, {
            action: 'remove',
            context: props.context,
            surfSpotId: props.spotId,
            surfSpotName: props.spotName
        });
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        removeSpotFromFavourites(props.spotId, props.spotName)
            .then((response) => {
                setSpotIsInFavourites(false);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    // Opens the login modal and add the spots to the favourites as a result
    const onAddToFavouritesNotLogged = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Tracking.
        Tracker.trackEvent(['mp'], TrackingEvent.FavIconTap, {
            action: 'add',
            context: props.context,
            surfSpotId: props.spotId,
            surfSpotName: props.spotName
        });
        setSuspendedFavorite(props.spotId, props.spotName);
        openModalToExecuteProAction(
            'favoriteAddButton',
            mondoTranslate('favorites.log_in_modal_title'),
            mondoTranslate('favorites.log_in_modal_text', { spotName: props.spotName }),
            mondoTranslate('favorites.trial_modal_title'),
            mondoTranslate('favorites.trial_modal_text', { spotName: props.spotName }),
            mondoTranslate('favorites.subscribe_modal_title'),
            mondoTranslate('favorites.subscribe_modal_text', { spotName: props.spotName }),
            () => {
                addFavoriteFromSuspendedFavorite();
                modalService.closeModal();
            }
        );
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            {/* Loading */}
            {loading && (
                <button
                    aria-label={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    title={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    className="ms-favourite-add-button is-loading">
                    <Loader size="small" />
                </button>
            )}

            {/* Not logged or logged but has no permissions */}
            {!loading && (logged === 'no' || (logged === 'yes' && !hasProPermissions())) && (
                <button
                    className="ms-favourite-add-button ms-favourite-add-button-add-not-logged"
                    onClick={(e) => onAddToFavouritesNotLogged(e)}
                    aria-label={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    title={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    data-test="favorite-add-button">
                    <Icon icon="heart-empty" />
                </button>
            )}

            {/* Logged, has permissions, spot not in favorites */}
            {!loading && logged === 'yes' && hasProPermissions() && !spotIsInFavourites && (
                <button
                    className="ms-favourite-add-button ms-favourite-add-button-add"
                    onClick={(e) => onAddToFavourites(e)}
                    aria-label={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    title={mondoTranslate('favorites.add_to_favorites', { spotName: props.spotName })}
                    data-test="favorite-add-button">
                    <Icon icon="heart-empty" />
                </button>
            )}

            {/* Logged, has permissions, spot in favorites */}
            {!loading && logged === 'yes' && hasProPermissions() && spotIsInFavourites && (
                <button
                    className="ms-favourite-add-button ms-favourite-add-button-remove"
                    onClick={(e) => onRemoveFromFavourites(e)}
                    aria-label={mondoTranslate('favorites.remove_from_favorites', { spotName: props.spotName })}
                    title={mondoTranslate('favorites.remove_from_favorites', { spotName: props.spotName })}
                    data-test="favorite-remove-button">
                    <Icon icon="heart" />
                </button>
            )}
        </>
    );
};
export default FavoriteAddButton;
