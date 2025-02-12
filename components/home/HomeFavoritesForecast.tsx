import { useQueryClient } from '@tanstack/react-query';
import { isApp } from 'helpers/device.helpers';
import { callApi } from 'mondosurf-library/api/api';
import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import EmptyState from 'mondosurf-library/components/EmptyState';
import GoodTime from 'mondosurf-library/components/GoodTime';
import LastUpdate from 'mondosurf-library/components/LastUpdate';
import List from 'mondosurf-library/components/List';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { limitGoodTimesToDaysRange } from 'mondosurf-library/helpers/forecast.helpers';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import IGoodTime from 'mondosurf-library/model/iGoodTime';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';
import { RootState } from 'mondosurf-library/redux/store';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import {
    FORECAST_GARBAGE_COLLECTOR_TIME,
    FORECAST_STALE_TIME,
    PUBLIC_API_URL_V1,
    STABLE_GARBAGE_COLLECTOR_TIME,
    STABLE_STALE_TIME
} from 'proxies/localConstants';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/*
List of statuses to test:

1. User logged but has no favourites
- !favoriteSpots || favoriteSpots.length === 0

2. User logged has favourites, favourites forecast loading
- favoriteSpots.length > 0 && favoriteSpots != null
- fetchedFavoriteSpotsForecast.status === 'loading' || fetchedFavoriteSpotsForecast.status === 'init'

3. User logged has favourites, favourites being filtered
- favoriteSpots.length > 0 && favoriteSpots != null
- fetchedFavoriteSpotsForecast.status === 'loaded'
- favoritesArrayFiltered === false

4. User logged has favourites, favourites forecast is empty
- favoriteSpots.length > 0 && favoriteSpots != null
- fetchedFavoriteSpotsForecast.status === 'loaded'
- favoritesArrayFiltered === true
- goodTimesFiltered.length === 0

5. User logged has favourites, favourites forecast has good days
- favoriteSpots.length > 0 && favoriteSpots != null
- fetchedFavoriteSpotsForecast.status === 'loaded'
- favoritesArrayFiltered === true
- goodTimesFiltered.length > 0

6. Error retrieving forecast.

*/

const HomeFavoritesForecast: React.FC = () => {
    // Redux
    const userLogged = useSelector((state: RootState) => state.user.logged);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const favoriteSpots = useSelector((state: RootState) => state.user.favoriteSpots);
    const storageRefreshToken = useSelector((state: RootState) => state.user.capacitorRefreshToken); // Used by ios and android

    const queryClient = useQueryClient();

    // This is switched to true when the good days are loaded and have been filtered to hide the ones in the past
    const [favoritesArrayFiltered, setFavoritesArrayFiltered] = useState<boolean>(false);

    const [favouriteSpotsQuery, setFavoriteSpotsQuery] = useState('');
    const [goodTimesFiltered, setGoodTimesFiltered] = useState<IGoodTime[]>([]);
    const fetchedFavoriteSpotsForecast = useAuthGetFetch(favouriteSpotsQuery, {}, true);

    useEffect(() => {
        // Launches the actual query to the API
        if (isApp()) {
            // App: we also check if the Capacitor Refresh Token exists, before contacting the API
            if (
                accessToken &&
                storageRefreshToken !== '' &&
                userLogged === 'yes' &&
                favoriteSpots != null &&
                favoriteSpots.length > 0
            ) {
                setFavoriteSpotsQuery('user-favourites-forecast');
            }
        } else {
            // Web: data check before contacting the API
            if (accessToken && userLogged === 'yes' && favoriteSpots != null && favoriteSpots.length > 0) {
                setFavoriteSpotsQuery('user-favourites-forecast');
            }
        }

        // Tracking: no favorites
        if (favoriteSpots === null || favoriteSpots.length === 0) {
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.HomeFavsGTsShow, {
                favorites: 0
            });
        }
    }, [accessToken, userLogged, favoriteSpots, storageRefreshToken]);

    useEffect(() => {
        if (fetchedFavoriteSpotsForecast.status === 'loaded') {
            // Good Times between the current time and the max allowed days for the user.
            const filteredGoodTimes = limitGoodTimesToDaysRange(fetchedFavoriteSpotsForecast.payload.good_times);
            // Filters out the Good Times that are in the past.
            setGoodTimesFiltered(filteredGoodTimes);
            setFavoritesArrayFiltered(true);
            trackOnLoad(filteredGoodTimes.length, favoriteSpots!);

            // Prefetch spots guides and forecasts
            filteredGoodTimes.forEach((goodTime) => {
                if (goodTime.surf_spot_id) {
                    queryClient.prefetchQuery({
                        queryKey: ['spotGuide' + goodTime.surf_spot_id],
                        queryFn: () =>
                            callApi(PUBLIC_API_URL_V1! + 'surf-spot/guide/' + goodTime.surf_spot_id, 'GET', []),
                        staleTime: STABLE_STALE_TIME,
                        gcTime: STABLE_GARBAGE_COLLECTOR_TIME
                    });
                    queryClient.prefetchQuery({
                        queryKey: [
                            hasProPermissions()
                                ? 'spotForecastPro' + goodTime.surf_spot_id
                                : 'spotForecast' + goodTime.surf_spot_id
                        ],
                        queryFn: () =>
                            callApi(PUBLIC_API_URL_V1! + 'surf-spot/forecast/' + goodTime.surf_spot_id, 'GET', []),
                        staleTime: FORECAST_STALE_TIME,
                        gcTime: FORECAST_GARBAGE_COLLECTOR_TIME
                    });
                }
            });
        } else {
            setGoodTimesFiltered([]);
        }
    }, [fetchedFavoriteSpotsForecast]);

    /**
     * Tracking: Handles the events tracking.
     */
    const trackOnLoad = (goodTimesLength: number, favorites: ISurfSpotPreview[] | null) => {
        if (goodTimesLength === 0) {
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.HomeFavsGTsShow, {
                goodTimes: 0,
                favorites: favorites === null ? 0 : favorites.length
            });
        } else if (goodTimesLength > 0) {
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.HomeFavsGTsShow, {
                goodTimes: goodTimesLength,
                favorites: favorites === null ? 0 : favorites.length
            });
        }
    };

    return (
        <div className="ms-home-favorites-spots-forecast">
            <div className="ms-desktop-max-width ms-side-spacing">
                {/* 1. User logged but has no favourites. */}
                {(!favoriteSpots || favoriteSpots.length === 0) && (
                    <div
                        className="ms-home-favorites-spots-forecast__no-favourites ms-centered ms-max-width"
                        data-test="home-favorites-forecast-no-favs">
                        <EmptyState
                            title={mondoTranslate('home.favourites.no_favourites_text')}
                            text={mondoTranslate('profile.favourite_spots_empty_text')}
                            emoji="🤖"
                            buttonLabel={mondoTranslate('basics.browse_spots')}
                            buttonUrl="/surf-spots-guides-forecasts"
                            buttonStyle="cta"
                            buttonSize="xl"
                        />
                    </div>
                )}

                {/* 2. User logged has favourites, favourites forecast loading */}
                {(fetchedFavoriteSpotsForecast.status === 'loading' ||
                    fetchedFavoriteSpotsForecast.status === 'init') &&
                    favoriteSpots != null &&
                    favoriteSpots.length > 0 && (
                        <div className="ms-home-favorites-spots-forecast__loading">
                            <Loader />
                        </div>
                    )}

                {/* 3. User logged has favourites, favourites being filtered */}
                {fetchedFavoriteSpotsForecast.status === 'loaded' &&
                    favoriteSpots != null &&
                    favoriteSpots.length > 0 &&
                    !favoritesArrayFiltered && (
                        <div className="ms-home-favorites-spots-forecast__loading">
                            <Loader />
                        </div>
                    )}

                {favoriteSpots != null &&
                    favoriteSpots.length > 0 &&
                    fetchedFavoriteSpotsForecast.status === 'loaded' &&
                    favoritesArrayFiltered && (
                        <div className="ms-home-favorites-spots-forecast__good-times">
                            <div
                                className={`${
                                    goodTimesFiltered.length === 0 ? ' is-empty ms-centered ms-max-width' : ''
                                }`}>
                                <h3 className="ms-home-favorites-spots-forecast__good-times-title ms-h2-title">
                                    {mondoTranslate('home.favourites.title')}
                                </h3>

                                {/* 4. User logged has favourites, favourites forecast is empty */}
                                {goodTimesFiltered.length === 0 && (
                                    <div
                                        className="ms-home-favorites-spots-forecast__no-good-times ms-centered ms-max-width"
                                        data-test="home-favorites-forecast-no-good-times">
                                        <p className="ms-emoji">
                                            {mondoTranslate('home.favourites.no_good_times_icon')}
                                        </p>
                                        <p className="ms-body-text">
                                            {mondoTranslate('home.favourites.no_good_times_text')}
                                        </p>
                                    </div>
                                )}

                                {/* 5. User logged has favourites, favourites forecast has good days */}
                                {goodTimesFiltered.length > 0 && (
                                    <List
                                        components={goodTimesFiltered.map((goodTime: any, index: number) => (
                                            <GoodTime
                                                key={index}
                                                {...goodTime}
                                                defaultClickBehavior={true}
                                                context="homeFavorites"
                                            />
                                        ))}
                                        pageSize={4}
                                        dataTest="home-favorites-forecast-good-times"
                                        wrapperClasses="ms-home__good-days ms-grid-2 ms-grid-v-1"
                                    />
                                )}

                                {/* Forecast update */}
                                {fetchedFavoriteSpotsForecast.payload.last_update && (
                                    <div
                                        className={`ms-home-favorites-spots-forecast__last-update ${
                                            goodTimesFiltered.length === 0 ? 'has-ho-results' : ''
                                        }`}>
                                        <LastUpdate
                                            lastUpdate={fetchedFavoriteSpotsForecast.payload.last_update}></LastUpdate>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                {/* Logged but error retrieving favourites */}
                {favoriteSpots != null &&
                    favoriteSpots.length > 0 &&
                    fetchedFavoriteSpotsForecast.status === 'error' && (
                        <div className="ms-home-favorites-spots-forecast__error ms-centered ms-max-width">
                            <p className="ms-home-favorites-spots-forecast__error-text ms-body-text">
                                {mondoTranslate('home.favourites.error')}
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};
export default HomeFavoritesForecast;
