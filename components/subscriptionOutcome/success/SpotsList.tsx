// Client
'use client';

import List from 'mondosurf-library/components/List';
import useGetFetch from 'mondosurf-library/api/useGetFetch';
import SurfSpotPreview from 'mondosurf-library/components/SurfSpotPreview';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { addSpotToFavourites } from 'mondosurf-library/helpers/favorites.helpers';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { deleteLocalStorageData, getLocalStorageData } from 'proxies/localStorage.helpers';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';

const SpotsList: React.FC = (props) => {
    // Query stuff
    const [spotsQuery, setSpotsQuery] = useState('');
    const [visitedSpotsArray, setVisitedSpotsArray] = useState<string[]>([]);
    const fetchedSpots = useGetFetch(spotsQuery);

    useEffect(() => {
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ProStartedShow, { subscriptionDuration: 'monthly' });

        getLocalStorageData('visitedSpots').then((visitedSpots) => {
            if (visitedSpots) {
                setVisitedSpotsArray(visitedSpots.split(','));
                setSpotsQuery('surf-spots-array/' + visitedSpots);
            }
        });

        getLocalStorageData('suspended_favorite').then((suspendedFavorite) => {
            if (suspendedFavorite) {
                const favoriteSpot = JSON.parse(suspendedFavorite);
                addSpotToFavourites(parseInt(favoriteSpot.id), favoriteSpot.name);
                deleteLocalStorageData('suspended_favorite');
            }
        });
    }, []);

    return (
        <>
            {/* No previously visited spots */}
            {(visitedSpotsArray.length === 0 ||
                (fetchedSpots.status === 'loaded' && fetchedSpots.payload.length === 0)) && (
                <div className="" data-test="subscription-success-empty-list">
                    {/* <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.follow_up_1')}</p> */}
                    <MondoLink href="/surf-spots-map" className="ms-home-hero__btn ms-btn ms-btn-l ms-btn-cta">
                        {mondoTranslate('basics.browse_map')}
                    </MondoLink>
                    <MondoLink href="/surf-spot-search" className="ms-btn ms-btn-l">
                        {mondoTranslate('basics.search_spot')}
                    </MondoLink>
                </div>
            )}

            {/* Previously visited spots */}
            {visitedSpotsArray.length > 0 && fetchedSpots.status === 'loaded' && fetchedSpots.payload.length > 0 && (
                <>
                    <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.follow_up_2')}</p>
                    <div className="ms-grid-1-1 ms-grid-v-1" data-test="subscription-success-list">
                        <List
                            components={fetchedSpots.payload.map((item: ISurfSpotPreview, index: number) => (
                                <SurfSpotPreview
                                    key={item.id}
                                    {...item}
                                    context="subscriptionConfirmed"
                                    showDirection={true}
                                    showMetadata={true}
                                />
                            ))}
                        />
                    </div>
                </>
            )}
        </>
    );
};
export default SpotsList;
