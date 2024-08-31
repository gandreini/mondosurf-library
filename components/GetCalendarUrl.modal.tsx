// Client
'use client';

import { postApiAuthCall } from 'mondosurf-library/api/api';
import toastService from 'mondosurf-library/services/toastService';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { addSpotToFavourites, checkIfSpotIdIsInFavorites } from 'mondosurf-library/helpers/favorites.helpers';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { copyToClipboard } from 'proxies/copyToClipboard.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import modalService from 'mondosurf-library/services/modalService';

interface IGetCalendarUrl {
    spotName: string;
    spotId: number;
    calendarUrl?: string;
}

const GetCalendarUrl: React.FC<IGetCalendarUrl> = (props) => {
    // Redux.
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const favoriteSpots = useSelector((state: RootState) => state.user.favoriteSpots);
    const googleCalTutorial = useSelector((state: RootState) => state.appConfig.tutorial_video_url_google_cal);
    const appleCalTutorial = useSelector((state: RootState) => state.appConfig.tutorial_video_url_apple_cal);

    // Used to be sure spotId is a number.
    const spotId = typeof props.spotId === 'number' ? props.spotId : parseInt(props.spotId);

    const [calendarUrl, setCalendarUrl] = useState<string>(props.calendarUrl ? props.calendarUrl : '');
    const [calendarUrlRetrieved, setCalendarUrlRetrieved] = useState<boolean>(false);
    const [displayFavoriteCheckbox, setDisplayFavoriteCheckbox] = useState<boolean>(true);

    // React hook form.
    const { register, getValues } = useForm({
        defaultValues: {
            addToFavoritesCheck: true
        }
    });

    // Retrieves the calendar url from the API, if empty
    // This happens when the user opens the modal before being logged in
    useEffect(() => {
        if (!calendarUrl || calendarUrl === '') {
            // Call to "calendar-url" API to retrieve the unique URL of the calendar
            postApiAuthCall('calendar-url', accessToken, {
                spot_id: spotId
            })
                .then((response: any) => {
                    if (response && response.status === 200 && response.data.success === true) {
                        setCalendarUrl(response.data.calendar_url);
                        setCalendarUrlRetrieved(true);
                    } else {
                        toastService.error(mondoTranslate('toast.calendar.error_retrieving_calendar_url'));
                        setCalendarUrlRetrieved(true);
                    }
                })
                .catch(function (error) {
                    toastService.error(mondoTranslate('toast.calendar.error_retrieving_calendar_url'));
                    setCalendarUrlRetrieved(true);
                });
        } else {
            setCalendarUrlRetrieved(true);
        }

        if (favoriteSpots && checkIfSpotIdIsInFavorites(favoriteSpots, spotId)) {
            setDisplayFavoriteCheckbox(false);
        }

        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalCalShow, {
            spotName: props.spotName,
            spotId: props.spotId
        });
    }, []);

    // Takes care of classes of the modal, for vertical alignment
    useEffect(() => {
        if (
            !hasProPermissions() ||
            !calendarUrlRetrieved ||
            ((!calendarUrl || calendarUrl === '') && calendarUrlRetrieved && hasProPermissions())
        ) {
            modalService.updateClasses({ classes: 'ms-modal-content-centered' });
        } else {
            modalService.updateClasses({ classes: '' });
        }
    }, [calendarUrl, calendarUrlRetrieved]);

    // Copies the calendar url to the clipboard and calls to function to add to favorites
    const onCopyCalendar = () => {
        copyToClipboard(calendarUrl, () => {
            toastService.emoji(
                mondoTranslate('toast.calendar.calendar_url_copied'),
                '🎉',
                'data-test-toast-calendar-url-copied'
            );
        });
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalCalURLTap, {
            spotName: props.spotName,
            spotId: props.spotId,
            addFavorite: addToFavoritesForTracking()
        });
        addToFavorites();
    };

    // Send the calendar url via mail to the user and calls to function to add to favorites
    const onSendCalendar = () => {
        postApiAuthCall('send-calendar-url-to-user-email', accessToken, {
            spot_id: props.spotId
        })
            .then((response: any) => {
                if (response && response.status === 200 && response.data.success === true) {
                    toastService.emoji(
                        mondoTranslate('toast.calendar.calendar_url_sent'),
                        '📨',
                        'data-test-toast-calendar-url-email-sent'
                    );
                    addToFavorites();
                } else {
                    toastService.error(mondoTranslate('toast.calendar.error_sending_email'));
                }
            })
            .catch(function (error) {
                toastService.error(mondoTranslate('toast.calendar.error_sending_email'));
            });
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalCalEmailTap, {
            spotName: props.spotName,
            spotId: props.spotId,
            addFavorite: addToFavoritesForTracking()
        });
    };

    // Adds the spot to the user's favourites, after a few checks
    const addToFavorites = () => {
        if (getValues('addToFavoritesCheck') && favoriteSpots && !checkIfSpotIdIsInFavorites(favoriteSpots, spotId)) {
            addSpotToFavourites(props.spotId, props.spotName);
        }
    };

    // Returns the string to add as tracking parameter: tells if the favorites is added
    const addToFavoritesForTracking = () => {
        let returnString = 'false';
        if (!displayFavoriteCheckbox) return 'notAvailable';
        if (getValues('addToFavoritesCheck')) return 'true';
        return returnString;
    };

    // Click on the link to watch the tutorial, for tracking purposes only
    const onGoogleTutorial = () => {
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalCalGoogleTap, {
            spotName: props.spotName,
            spotId: props.spotId
        });
    };

    // Click on the link to watch the tutorial, for tracking purposes only
    const onAppleTutorial = () => {
        // Tracking
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalCalAppleTap, {
            spotName: props.spotName,
            spotId: props.spotId
        });
    };

    return (
        <div className="ms-get_calendar_url_modal">
            {/* User has no permission to use the calendar */}
            {!hasProPermissions() && (
                <>
                    <p className="ms-body-text">
                        {mondoTranslate('calendar.get_calendar_url_modal.error_not_allowed')}
                    </p>
                </>
            )}

            {/* Retrieving calendar URL */}
            {!calendarUrlRetrieved && <Loader />}

            {/* Calendar URL is empty */}
            {(!calendarUrl || calendarUrl === '') && calendarUrlRetrieved && hasProPermissions() && (
                <>
                    <p className="ms-body-text">
                        {mondoTranslate('calendar.get_calendar_url_modal.error_no_calendar_url')}
                    </p>
                </>
            )}

            {/* Ready to go */}
            {calendarUrl && calendarUrl !== '' && calendarUrlRetrieved && hasProPermissions() && (
                <>
                    {/* Copy url */}
                    <section className="ms-get_calendar_url_modal__section" data-test="get-calendar-url-ready">
                        <p className="ms-body-text">
                            {mondoTranslate('calendar.get_calendar_url_modal.copy_text', { spotName: props.spotName })}
                        </p>
                        <button
                            className="ms-btn ms-btn-cta ms-btn-l ms-btn-full"
                            onClick={() => onCopyCalendar()}
                            data-test="get-calendar-url-copy-button">
                            {mondoTranslate('calendar.get_calendar_url_modal.copy_button', {
                                spotName: props.spotName
                            })}
                        </button>
                        {/* For automated testing purposes only */}
                        {process.env.REACT_APP_DEBUG_MODE === 'true' && (
                            <a className="is-hidden" data-test="get-calendar-url-test-url" href={calendarUrl}>
                                C
                            </a>
                        )}
                    </section>

                    {/* Send via email */}
                    <section className="ms-get_calendar_url_modal__section">
                        <p className="ms-body-text">
                            {mondoTranslate('calendar.get_calendar_url_modal.send_text', { spotName: props.spotName })}
                        </p>
                        <button
                            className="ms-btn ms-btn-cta ms-btn-l ms-btn-full"
                            onClick={() => onSendCalendar()}
                            data-test="get-calendar-url-email-button">
                            {mondoTranslate('calendar.get_calendar_url_modal.send_button', {
                                spotName: props.spotName
                            })}
                        </button>
                        {/* Checkbox to add spot to favorites */}
                        {displayFavoriteCheckbox && (
                            <form className="ms-get_calendar_url_modal__form" data-test="get-calendar-url-checkbox">
                                <input
                                    type="checkbox"
                                    id="form_add_to_favorites_check"
                                    {...register('addToFavoritesCheck', {})}
                                />
                                <label htmlFor="form_add_to_favorites_check">
                                    {mondoTranslate('calendar.get_calendar_url_modal.add_to_favorites', {
                                        spotName: props.spotName
                                    })}
                                </label>
                            </form>
                        )}
                    </section>

                    <hr />

                    {/* Info and links */}
                    <section className="ms-get_calendar_url_modal__section ms-get_calendar_url_modal__section-help">
                        <p className="ms-body-text">
                            {mondoTranslate('calendar.get_calendar_url_modal.tutorial', { spotName: props.spotName })}
                        </p>
                        <a
                            className="ms-btn ms-btn-full ms-get_calendar_url_modal__section-help-btn-1"
                            href={googleCalTutorial}
                            target="_blank"
                            onClick={onGoogleTutorial}
                            rel="noreferrer">
                            {mondoTranslate('calendar.get_calendar_url_modal.tutorial_link_1', {
                                spotName: props.spotName
                            })}
                        </a>
                        <a
                            className="ms-btn ms-btn-full"
                            href={appleCalTutorial}
                            target="_blank"
                            onClick={onAppleTutorial}
                            rel="noreferrer">
                            {mondoTranslate('calendar.get_calendar_url_modal.tutorial_link_2', {
                                spotName: props.spotName
                            })}
                        </a>
                    </section>
                </>
            )}
        </div>
    );
};

export default GetCalendarUrl;
