// Client
'use client';

import { openCalendarModal } from 'features/modal/modal.helpers';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { addSpotToFavourites, checkIfSpotIdIsInFavorites } from 'mondosurf-library/helpers/favorites.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import { useRouterProxy } from 'proxies/useRouter';
import Button from 'mondosurf-library/components/Button';

interface IBanner {
    type: 'favorite' | 'calendar' | 'widget';
    spotName: string;
    spotId: number;
    spotCalendarUrl: string;
}

const Banner: React.FC<IBanner> = (props) => {
    // React router.
    const router = useRouterProxy();

    // Redux.
    const logged = useSelector((state: RootState) => state.user.logged);
    const favoriteSpots = useSelector((state: RootState) => state.user.favoriteSpots);

    // On click on favorite banner
    const onClickFavoriteBanner = () => {
        addSpotToFavourites(props.spotId, props.spotName);
        // Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.FavBannerTap, {
            spotId: props.spotId,
            spotName: props.spotName
        });
    };

    // On click on calendar banner
    const onClickCalendarBanner = () => {
        openCalendarModal(props.spotId, props.spotName, props.spotCalendarUrl);
        // Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.CalBannerTap, {
            spotId: props.spotId,
            spotName: props.spotName
        });
    };

    // On click on Widget banner
    const onClickWidgetBanner = () => {
        router.push('https://forms.gle/4BikoTaPPscGaiUW8');
        // Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.WidgetBannerTap, {
            spotId: props.spotId,
            spotName: props.spotName
        });
    };

    return (
        <>
            {/* Favorite banner */}
            {props.type === 'favorite' && (
                <>
                    {console.log(
                        favoriteSpots,
                        logged,
                        checkIfSpotIdIsInFavorites(favoriteSpots, Number(props.spotId)),
                        props.spotId,
                        Number(props.spotId)
                    )}
                    {(logged != 'yes' ||
                        (logged === 'yes' && !favoriteSpots) ||
                        (logged === 'yes' &&
                            favoriteSpots &&
                            !checkIfSpotIdIsInFavorites(favoriteSpots, Number(props.spotId)) &&
                            favoriteSpots.length < 5)) && (
                        <div
                            className="ms-banner ms-banner-favorite"
                            onClick={onClickFavoriteBanner}
                            data-test="surf-spot-forecast-favorite-banner">
                            <Icon icon={'heart-empty'} />
                            <div className="ms-banner__texts">
                                <p className="ms-h3-title ms-banner__text">
                                    {mondoTranslate('banner.banner_favorite_text', {
                                        name: props.spotName
                                    })}
                                </p>
                                <p className="ms-banner__subtext ms-small-text">
                                    {mondoTranslate('banner.banner_favorite_subtext')}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Calendar banner */}
            {props.type === 'calendar' && (
                <div
                    className="ms-banner ms-banner-calendar"
                    onClick={onClickCalendarBanner}
                    data-test="surf-spot-forecast-calendar-banner">
                    <Icon icon={'add-calendar'} />
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">
                            {mondoTranslate('banner.banner_calendar_text', {
                                name: props.spotName
                            })}
                        </p>
                        <p className="ms-banner__subtext ms-small-text">
                            {mondoTranslate('banner.banner_calendar_subtext')}
                        </p>
                    </div>
                </div>
            )}

            {/* Widget banner */}
            {props.type === 'widget' && (
                <div
                    className="ms-banner ms-banner-widget"
                    onClick={onClickWidgetBanner}
                    data-test="surf-spot-forecast-widget-banner">
                    <div className="ms-banner-widget__image"></div>
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">
                            {mondoTranslate('banner.banner_widget_text', {
                                name: props.spotName
                            })}
                        </p>
                        <p className="ms-banner__subtext ms-small-text">
                            {mondoTranslate('banner.banner_widget_subtext', {
                                name: props.spotName
                            })}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
export default Banner;
