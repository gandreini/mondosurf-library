// Client
'use client';

import useGetFetch from 'mondosurf-library/api/useGetFetch';
import Button from 'mondosurf-library/components/Button';
import EmptyState from 'mondosurf-library/components/EmptyState';
import GoodTime from 'mondosurf-library/components/GoodTime';
import List from 'mondosurf-library/components/List';
import Loader from 'mondosurf-library/components/Loader';
import SurfSpotPreview from 'mondosurf-library/components/SurfSpotPreview';
import { limitGoodTimesToDaysRange } from 'mondosurf-library/helpers/forecast.helpers';
import IGoodTime from 'mondosurf-library/model/iGoodTime';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';
import { getUserLocation } from 'proxies/getUserLocation';
import { NEAR_SPOTS_DISTANCE_KM } from 'proxies/localConstants';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';

const HomeNearSpotsForecast: React.FC = () => {
    // Near spots query stuff
    const [nearSpotsQuery, setNearSpotsQuery] = useState('');
    const fetchedNearSpots = useGetFetch(nearSpotsQuery);

    // Variables that hold the actual lists of good times and spots
    const [nearSpots, setNearSpots] = useState<ISurfSpotPreview[]>([]);
    const [goodTimes, setGoodTimes] = useState<IGoodTime[]>([]);
    const [status, setStatus] = useState<
        | 'init'
        | 'requestingGeolocation'
        | 'geolocationRetrieved'
        | 'geolocationDenied'
        | 'positionUnavailable'
        | 'geolocationTimeout'
        | 'fetchingData'
        | 'fetchedData'
        | 'fetchError'
    >('init');

    useEffect(() => {
        // Triggered only when data is fetched
        if (fetchedNearSpots.status === 'loaded') {
            setStatus('fetchedData');
            // Setting near spots
            if (fetchedNearSpots.payload.near_spots && fetchedNearSpots.payload.near_spots.length > 0) {
                setNearSpots(fetchedNearSpots.payload.near_spots);
            } else {
                setNearSpots([]);
            }

            // Removes Good Times that are in the past or too far in the future
            const filteredGoodTimes = limitGoodTimesToDaysRange(fetchedNearSpots.payload.good_times);
            setGoodTimes(filteredGoodTimes);
        } else if (fetchedNearSpots.status === 'error') {
            setStatus('fetchError');
        }
    }, [fetchedNearSpots]);

    // Event handler: click on the button to retrieve near spots data
    const onGetNearSpots = () => {
        setStatus('requestingGeolocation');
        getUserLocation()
            .then((response) => {
                setStatus('fetchingData');
                setNearSpotsQuery(
                    'near-spots-forecast/' +
                        response.coords.latitude +
                        '/' +
                        response.coords.longitude +
                        '/' +
                        NEAR_SPOTS_DISTANCE_KM
                );
            })
            .catch((error) => {
                console.log('error', error);
                if (error === 'PERMISSION_DENIED' || error === 'UNKNOWN_ERROR') setStatus('geolocationDenied');
                if (error === 'POSITION_UNAVAILABLE') setStatus('positionUnavailable');
                if (error === 'TIMEOUT') setStatus('geolocationTimeout');
            });
    };

    return (
        <div className="ms-home-near-spots-forecast" data-test="home-near-spots-forecast">
            <div className="ms-desktop-max-width ms-side-spacing">
                {/* Button */}
                {status === 'init' && (
                    <div className="ms-home-near-spots-forecast__cta">
                        <h2 className="ms-home-near-spots-forecast__title ms-h3-title">
                            {mondoTranslate('home.near_spots_forecast.title')}
                        </h2>
                        <p className="ms-body-text">{mondoTranslate('home.near_spots_forecast.text')}</p>
                        <Button
                            label={mondoTranslate('home.near_spots_forecast.button')}
                            callback={onGetNearSpots}
                            size="xl"
                            style="cta"
                            dataTest="home-near-spots-forecast-cta"
                        />
                    </div>
                )}

                {/* Fetching */}
                {status === 'requestingGeolocation' && (
                    <Loader text={mondoTranslate('home.near_spots_forecast.loading_geolocation')} />
                )}
                {status === 'fetchingData' && (
                    <Loader text={mondoTranslate('home.near_spots_forecast.loading_spots')} />
                )}

                {/* Results: ready */}
                {status === 'fetchedData' && (
                    <section
                        className="ms-home-near-spots-forecast__results"
                        data-test="home-near-spots-forecast-results">
                        {/* Good times */}
                        {goodTimes.length > 0 && (
                            <div className="ms-home-near-spots-forecast__results-group">
                                <h2 className="ms-home-near-spots-forecast__title ms-h3-title">
                                    {mondoTranslate('home.near_spots_forecast.good_times')}
                                </h2>
                                <div className="ms-grid-1-2">
                                    <List
                                        components={goodTimes.map((item: IGoodTime, index: number) => (
                                            <GoodTime
                                                key={index}
                                                {...item}
                                                defaultClickBehavior={true}
                                                context="homeNearSpots"
                                            />
                                        ))}
                                        pageSize={6}
                                    />
                                </div>
                            </div>
                        )}

                        {/* No Good times, near spots */}
                        {nearSpots.length > 0 && (
                            <div className="ms-home-near-spots-forecast__results-group">
                                <h2 className="ms-home-near-spots-forecast__title ms-h3-title">
                                    {mondoTranslate('home.near_spots_forecast.title')}
                                </h2>
                                <div className="ms-grid-1-2" data-test="home-near-spots-forecast-list">
                                    <List
                                        components={nearSpots.map((item: ISurfSpotPreview, index: number) => (
                                            <SurfSpotPreview
                                                key={item.id}
                                                {...item}
                                                context="homeNearSpots"
                                                showMetadata={true}
                                                showDirection={false}
                                            />
                                        ))}
                                        pageSize={6}
                                    />
                                </div>
                            </div>
                        )}

                        {/* No near spots */}
                        {nearSpots.length === 0 && (
                            <EmptyState
                                emoji="🤷‍♂️"
                                text={mondoTranslate('home.near_spots_forecast.empty_text')}
                                buttonLabel={mondoTranslate('home.near_spots_forecast.empty_button')}
                                buttonUrl="/surf-spots-map"
                                buttonSize="xl"
                                buttonStyle="cta"
                            />
                        )}
                    </section>
                )}

                {/* Impossible to retrieve geolocation */}
                {(status === 'geolocationDenied' ||
                    status === 'positionUnavailable' ||
                    status === 'geolocationTimeout') && (
                    <div className="ms-home-near-spots-forecast__error">
                        <EmptyState
                            text={mondoTranslate('home.near_spots_forecast.geolocation_unsupported')}
                            buttonCallback={onGetNearSpots}
                            buttonLabel={mondoTranslate('home.near_spots_forecast.geolocation_try_again')}
                        />
                    </div>
                )}

                {/* Error state */}
                {status === 'fetchError' && (
                    <div className="ms-home-near-spots-forecast__server-error">
                        <EmptyState text={mondoTranslate('home.near_spots_forecast.server_error')} />
                    </div>
                )}
            </div>
        </div>
    );
};
export default HomeNearSpotsForecast;
