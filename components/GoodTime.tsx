// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import GoodTimeShare from 'mondosurf-library/components/GoodTimeShare';
import { returnLengthUnitShortLabel, returnSpeedUnitShortLabel } from 'mondosurf-library/helpers/labels.helpers';
import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { extDayMonthFormat, hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { directionAcronym } from 'mondosurf-library/helpers/labels.helpers';
import { convertSizeFromMeters, convertSpeedFromKph } from 'mondosurf-library/helpers/units.helpers';
import { oneDecimal } from 'mondosurf-library/helpers/various.helpers';
import IGoodTime from 'mondosurf-library/model/iGoodTime';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useRouterProxy } from 'proxies/useRouter';
import modalService from 'mondosurf-library/services/modalService';
import ForecastDayDetail from './ForecastDayDetail';
import Icon from 'mondosurf-library/components/Icon';

// Component.
const GoodTime: React.FC<IGoodTime> = (props) => {
    // React router.
    const router = useRouterProxy();

    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // ! TODO Timezone error here: +13 is not +1!
    // console.log('props.start_time', props.start_time);
    // const date1 = new Date(props.start_time);
    // console.log('date1', date1);
    // console.log(dayjs(props.start_time).format('Z'));
    // console.log(dayjs(props.start_time).format('z'));

    // console.log('props.start_time', props.start_time);
    // console.log('props.end_time', props.end_time);

    const startDate = dayjs(props.start_time).tz(props.timezone);
    const endDate = dayjs(props.end_time).tz(props.timezone);
    const bestQuality = props.good_highest_value ? props.good_highest_value : 0; // defaults to 0

    // Boolean true if the good time is currently active.
    const isOn: boolean =
        dayjs().unix() > dayjs(props.start_time).unix() && dayjs().unix() < dayjs(props.end_time).unix() ? true : false;

    // Modal to share good time.
    const onShowShareModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        modalService.openModal({
            text: mondoTranslate('good_time.share_text', {
                name: props.surf_spot_name
            }),
            component: GoodTimeShare,
            componentProps: {
                ...props
            },
            closeButtonText: mondoTranslate('basics.close'),
            classes: 'is-good-time-sharing',
            mobileFromBottom: true
        });
        // Tracking.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.GTShareTap, {
            surfSpotName: props.surf_spot_name,
            surfSpotId: props.surf_spot_id,
            quality: props.good_average,
            context: props.context
        });
        e.preventDefault();
        e.stopPropagation();
    };

    // On click
    const onGoodTimeClick = () => {
        // Tracking.
        trackEvent();

        modalService.openModal({
            title:
                (props.surf_spot_name ? props.surf_spot_name : 'Forecast') +
                ', ' +
                dayjs(props.start_time).tz(props.timezone).format('ddd D MMM'),
            component: ForecastDayDetail,
            componentProps: {
                dayId: props.day_id,
                spotId: props.surf_spot_id,
                spotSlug: props.surf_spot_slug,
                dayToShow: dayjs(props.start_time).tz(props.timezone).format('D'),
                hourToShow: dayjs(props.start_time).tz(props.timezone).format('H'),
                showSpotButton: props.context === 'homeFavorites' || props.context === 'homeNearSpots' ? true : false,
                origin: 'GoodTime'
            },
            classes: 'ms-modal-full-forecast'
        });
    };

    // Handles the click on the Good Time
    /* const onGoodTimeClick = () => {
        // Tracking.
        trackEvent();

        if (props.defaultClickBehavior && props.surf_spot_id && props.surf_spot_slug) {
            // Default navigation to the surf spot page.
            if (props.day_id !== -1)
                router.push(
                    `/surf-spot/${props.surf_spot_slug}/full-forecast/${props.surf_spot_id}?day=${startDate.format(
                        'D'
                    )}&hour=${startDate.format('H')}`
                );
        } else if (
            !props.defaultClickBehavior &&
            props.callback &&
            props.surf_spot_id &&
            props.surf_spot_slug &&
            props.start_time
        ) {
            // Invoking the callback.
            props.callback(props.surf_spot_id, props.surf_spot_slug, props.day_id, props.timezone, props.start_time);
        }
    }; */

    //Tracking: Tracks click event to Mixpanel and other trackers
    const trackEvent = () => {
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.GTTap, {
            surfSpotName: props.surf_spot_name,
            surfSpotId: props.surf_spot_id,
            quality: props.good_average,
            context: props.context
        });
    };

    return (
        <article
            className={`ms-good-time ms-good-time-${bestQuality} ${
                props.callback || props.defaultClickBehavior ? 'is-clickable' : ''
            }`}
            onClick={onGoodTimeClick}>
            {/* Quality */}
            <div className="ms-good-time__quality">
                <GoodTimeQuality quality={bestQuality} />

                <div className="ms-good-time__share" onClick={(e) => onShowShareModal(e)}>
                    <Icon icon={'share'} />
                </div>
            </div>

            <div className="ms-good-time__content">
                {/* Good Time info */}
                <div className="ms-good-time__info">
                    {!props.hideName && <h3 className="ms-good-time__spot-name">{props.surf_spot_name}</h3>}

                    {/* Day and hours */}
                    <div className="ms-good-time__time">
                        {isOn && <p className="ms-good-time__its-on">{mondoTranslate('good_time.on_now')}</p>}
                        <p className="ms-good-time__day">{startDate.format(extDayMonthFormat())}</p>{' '}
                        <div className="ms-good-time__hour">
                            <p className="ms-good-time__hour-from">
                                <span className="ms-good-time__time-icon">⏰</span>{' '}
                                <span className="ms-good-time__time-value">{startDate.format(hourMinFormat())}</span>
                            </p>{' '}
                            <p className="ms-good-time__hour-to">
                                <span className="ms-good-time__time-label">to</span>{' '}
                                <span className="ms-good-time__time-value">{endDate.format(hourMinFormat())}</span>
                            </p>
                        </div>
                    </div>

                    {/* Swell, Wind, ... */}
                    <div className="ms-good-time__details">
                        <div className="ms-good-time__details-block">
                            <div className="ms-good-time__details-label ms-color-swell">
                                {mondoTranslate('basics.swell')}
                            </div>
                            <div className="ms-good-time__details-value">
                                <span className="ms-good-time__details-value-data">
                                    {oneDecimal(convertSizeFromMeters(props.swell_height))}
                                </span>
                                <span className="ms-good-time__details-value-unit">{returnLengthUnitShortLabel()}</span>
                                <span className="ms-good-time__details-value-separator">{', '}</span>
                                <span className="ms-good-time__details-value-data">{props.swell_period}</span>
                                <span className="ms-good-time__details-value-unit">s</span>
                                <span className="ms-good-time__details-value-separator">{', '}</span>
                                <span className="ms-good-time__details-value-data">
                                    {directionAcronym(props.swell_direction)}
                                </span>
                            </div>
                        </div>
                        <div className="ms-good-time__details-block">
                            <div className="ms-good-time__details-label ms-color-wind">
                                {mondoTranslate('basics.wind')}
                            </div>
                            <div className="ms-good-time__details-value">
                                <span className="ms-good-time__details-value-data">
                                    {oneDecimal(convertSpeedFromKph(props.wind_speed))}
                                </span>
                                <span className="ms-good-time__details-value-unit">{returnSpeedUnitShortLabel()}</span>
                                <span className="ms-good-time__details-value-separator">{', '}</span>
                                <span className="ms-good-time__details-value-data">
                                    {directionAcronym(props.wind_direction)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
export default GoodTime;
