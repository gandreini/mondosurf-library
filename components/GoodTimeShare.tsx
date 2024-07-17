// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Button from 'mondosurf-library/components/Button';
import { extDayMonthFormat, hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { returnLengthUnitShortLabel, returnSpeedUnitShortLabel } from 'mondosurf-library/helpers/labels.helpers';
import { directionAcronym } from 'mondosurf-library/helpers/labels.helpers';
import { convertSizeFromMeters, convertSpeedFromKph } from 'mondosurf-library/helpers/units.helpers';
import IGoodTimes from 'mondosurf-library/model/iGoodTime';
import toastService from 'mondosurf-library/services/toastService';
import { copyToClipboard } from 'proxies/copyToClipboard.helpers';
import { FACEBOOK_APP_ID, FRONTEND_URL } from 'proxies/localConstants';
import { mondoTranslate } from 'proxies/mondoTranslate';

const GoodTimeShare: React.FC<IGoodTimes> = (props: IGoodTimes) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const waUrl = mondoTranslate('good_time.share_wa_url', {
        spot_name: props.surf_spot_name,
        spot_id: props.surf_spot_id,
        spot_slug: props.surf_spot_slug,
        day: dayjs(props.start_time).tz(props.timezone).format(extDayMonthFormat()),
        start_time: dayjs(props.start_time).tz(props.timezone).format(hourMinFormat()),
        end_time: dayjs(props.end_time).tz(props.timezone).format(hourMinFormat()),
        swell_height: convertSizeFromMeters(props.swell_height).toFixed(2),
        swell_period: props.swell_period.toFixed(2),
        swell_direction: directionAcronym(props.swell_direction),
        wind_speed: convertSpeedFromKph(props.wind_speed).toFixed(2),
        wind_direction: directionAcronym(props.wind_direction),
        day_id: props.day_id,
        lengthUnit: returnLengthUnitShortLabel(),
        speedUnit: returnSpeedUnitShortLabel()
    });
    const fbUrl = mondoTranslate('good_time.share_fb_url', {
        spot_name: props.surf_spot_name,
        spot_id: props.surf_spot_id,
        spot_slug: props.surf_spot_slug,
        day: dayjs(props.start_time).tz(props.timezone).format(extDayMonthFormat()),
        start_time: dayjs(props.start_time).tz(props.timezone).format(hourMinFormat()),
        end_time: dayjs(props.end_time).tz(props.timezone).format(hourMinFormat()),
        swell_height: convertSizeFromMeters(props.swell_height).toFixed(2),
        swell_period: props.swell_period.toFixed(2),
        swell_direction: directionAcronym(props.swell_direction),
        wind_speed: convertSpeedFromKph(props.wind_speed).toFixed(2),
        wind_direction: directionAcronym(props.wind_direction),
        day_id: props.day_id,
        lengthUnit: returnLengthUnitShortLabel(),
        speedUnit: returnSpeedUnitShortLabel(),
        fbId: FACEBOOK_APP_ID
    });

    // Handles click on Whatsapp button, for tracking
    const onWhatsappClick = () => {
        // Tracking.
        /*  Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalGTWaTap, {
            surfSpotName: props.surf_spot_name,
            surfSpotId: props.surf_spot_id,
            quality: props.good_average,
            context: props.context
        }); */
    };

    // Handles click on Facebook button, for tracking
    const onFacebookClick = () => {
        // Tracking.
        /*  Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalGTFbTap, {
            surfSpotName: props.surf_spot_name,
            surfSpotId: props.surf_spot_id,
            quality: props.good_average,
            context: props.context
        }); */
    };

    // Handles click on Copy URL button, to copy the URL and for tracking
    const onCopyClick = () => {
        copyToClipboard(copyUrl, () => {
            toastService.success(mondoTranslate('toast.good_time_url_copied'));
        });
        // Tracking.
        /* Tracker.trackEvent(['mp', 'ga'], TrackingEvent.ModalGTURLTap, {
            surfSpotName: props.surf_spot_name,
            surfSpotId: props.surf_spot_id,
            quality: props.good_average,
            context: props.context
        }); */
    };

    const copyUrl = `${FRONTEND_URL}surf-spot/forecast/${props.surf_spot_id}/${props.surf_spot_slug}?day=${props.day_id}`;

    return (
        <div className="ms-good-time-share">
            <Button
                label={mondoTranslate('good_time.share_whatsapp_btn')}
                url={encodeURI(waUrl)}
                targetBlank={true}
                rel="noreferrer"
                additionalClass="ms-good-time-share__button ms-btn-wa"
                fullWidth={true}
                size="xl"
            />
            <Button
                label={mondoTranslate('good_time.share_facebook_btn')}
                url={encodeURI(fbUrl)}
                targetBlank={true}
                rel="noreferrer"
                additionalClass="ms-good-time-share__button ms-btn-fb"
                fullWidth={true}
                size="xl"
            />
            <Button
                label={mondoTranslate('good_time.copy_url_btn')}
                callback={onCopyClick}
                additionalClass="ms-good-time-share__button"
                fullWidth={true}
                size="xl"
            />
        </div>
    );
};
export default GoodTimeShare;
