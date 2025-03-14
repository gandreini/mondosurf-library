// Client
'use client';

import { openCalendarModal, openModalToExecuteProAction } from 'features/modal/modal.helpers';
import Icon from 'mondosurf-library/components/Icon';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { checkPermissionsAndAddSpotToFavorites } from 'mondosurf-library/helpers/favorites.helpers';
import { shouldShowFavoritesBanner } from 'mondosurf-library/helpers/various.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { ADD_SPOT_URL } from 'proxies/localConstants';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IBanner {
    type: 'favorite' | 'calendar' | 'widget' | 'talkToUs' | 'getPro' | 'addMissingSpot' | 'comment';
    spotName?: string;
    spotSlug?: string;
    spotId?: number;
}

const Banner: React.FC<IBanner> = (props) => {
    // Redux
    const logged = useSelector((state: RootState) => state.user.logged);
    const favoriteSpots = useSelector((state: RootState) => state.user.favoriteSpots);

    // Handles the visibility of the favorites banner
    const [showFavoriteBanner, setShowFavoriteBanner] = useState<'true' | 'false' | 'loading'>('loading');

    useEffect(() => {
        if (logged === 'yes' && props.type === 'favorite') {
            setShowFavoriteBanner(shouldShowFavoritesBanner(Number(props.spotId)) ? 'true' : 'false');
        } else if (logged === 'no' && props.type === 'favorite') {
            setShowFavoriteBanner('true');
        }
    }, [props.spotId, logged, props.type, favoriteSpots]);

    // On click on favorite banner
    const onClickFavoriteBanner = () => {
        if (props.spotId && props.spotName) {
            checkPermissionsAndAddSpotToFavorites(props.spotId, props.spotName);
            // Tracking
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.FavBannerTap, {
                spotId: props.spotId,
                spotName: props.spotName
            });
        }
    };

    // On click on calendar banner
    const onClickCalendarBanner = () => {
        if (props.spotId && props.spotName) {
            openCalendarModal(props.spotId, props.spotName);
            // Tracking
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.CalBannerTap, {
                spotId: props.spotId,
                spotName: props.spotName
            });
        }
    };

    // On click on Widget banner
    const onClickWidgetBanner = () => {
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.WidgetBannerTap, {
            spotId: props.spotId,
            spotName: props.spotName
        });
    };

    // On click get pro banner
    const onGetProBannerClick = () => {
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.FullForecastGetProBannerTap, {
            spotId: props.spotId,
            spotName: props.spotName
        });
        openModalToExecuteProAction(
            'fullForecast',
            undefined,
            'Log in or sign up to Mondo to subscribe to Pro',
            undefined,
            undefined,
            undefined,
            mondoTranslate('pro.pro_modal.get_full_forecast')
        );
    };

    return (
        <>
            BANNER
            {/* Favorite banner */}
            {props.type === 'favorite' && props.spotId && props.spotName && (
                <>
                    {showFavoriteBanner === 'true' && (
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
                    {showFavoriteBanner === 'false' && (
                        <div
                            className="ms-banner ms-banner-favorite is-empty"
                            data-test="surf-spot-forecast-favorite-hidden-banner"></div>
                    )}
                </>
            )}
            {/* Calendar banner */}
            {props.type === 'calendar' && props.spotId && props.spotName && (
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
            {props.type === 'widget' && props.spotId && props.spotName && (
                <a href="https://forms.gle/4BikoTaPPscGaiUW8" target="_blank" rel="noreferrer">
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
                </a>
            )}
            {/* Talk to us banner */}
            {props.type === 'talkToUs' && (
                <MondoLink
                    className="ms-banner ms-banner-talk-to-us"
                    href="https://calendar.app.google/ZJcGjybqNqqrEh17A"
                    target="_blank">
                    <div className="ms-banner__emoji">🎤</div>
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">{mondoTranslate('banner.banner_talk_to_us_text')}</p>
                        <p className="ms-banner__subtext ms-body-text">
                            {mondoTranslate('banner.banner_talk_to_us_subtext')}
                        </p>
                    </div>
                </MondoLink>
            )}
            {/* Get pro */}
            {props.type === 'getPro' && (
                <MondoLink
                    className="ms-banner ms-banner-get-pro"
                    onClickCallback={onGetProBannerClick}
                    dataTest="surf-spot-full-forecast-banner">
                    <div className="ms-banner__emoji">🌊</div>
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">{mondoTranslate('banner.banner_get_pro_text')}</p>
                        {/* <p className="ms-banner__subtext ms-small-text">
                            {mondoTranslate('banner.banner_get_pro_subtext')}
                        </p> */}
                        <div className="ms-btn ms-btn-cta">{mondoTranslate('banner.banner_get_pro_button')}</div>
                    </div>
                </MondoLink>
            )}
            {/* Add missing spot */}
            {props.type === 'addMissingSpot' && (
                <MondoLink className="ms-banner ms-banner-add-missing-spot" href={ADD_SPOT_URL} target="_blank">
                    <Icon icon={'new-spot'} />
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">
                            {mondoTranslate('banner.banner_missing_spot_text')}
                        </p>
                        <p className="ms-banner__subtext ms-body-text">
                            {mondoTranslate('banner.banner_missing_spot_subtext')}
                        </p>
                    </div>
                </MondoLink>
            )}
            {/* Comment */}
            {props.type === 'comment' && (
                <MondoLink
                    className="ms-banner ms-banner-comment"
                    href={`/surf-spot/${props.spotSlug}/comments/${props.spotId}`}>
                    <div className="ms-banner__emoji">💬</div>
                    <div className="ms-banner__texts">
                        <p className="ms-h3-title ms-banner__text">
                            {mondoTranslate('banner.banner_comment_text', {
                                name: props.spotName
                            })}
                        </p>
                    </div>
                </MondoLink>
            )}
        </>
    );
};
export default Banner;
