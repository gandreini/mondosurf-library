// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ForecastDayDetail from 'mondosurf-library/components/ForecastDayDetail';
import ForecastRow from 'mondosurf-library/components/ForecastRow';
import Icon from 'mondosurf-library/components/Icon';
import { ICompressedData, ISurfSpotForecastDay, ISurfSpotGoodConditions } from 'mondosurf-library/model/iSurfSpot';
import modalService from 'mondosurf-library/services/modalService';

interface ISurfSpotForecastCompressedDay {
    spotId: number;
    spotName?: string;
    spotSlug?: string;
    day: ICompressedData;
    dayId: number;
    days?: ISurfSpotForecastDay[];
    timezone: string;
    goodConditions: ISurfSpotGoodConditions;
}

const SurfSpotForecastCompressedDay: React.FC<ISurfSpotForecastCompressedDay> = (
    props: ISurfSpotForecastCompressedDay
) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // On click
    const onClick = () => {
        modalService.openModal({
            title:
                (props.spotName ? props.spotName : 'Forecast') +
                ', ' +
                dayjs(props.day.time).tz(props.timezone).format('ddd D MMM'),
            component: ForecastDayDetail,
            componentProps: {
                spotId: props.spotId,
                spotSlug: props.spotSlug,
                dayId: props.dayId,
                origin: 'FullForecast'
                // days: props.days,
                // timezone: props.timezone,
                // goodConditions: props.goodConditions,
            },
            classes: 'ms-modal-full-forecast'
        });
    };

    return (
        <div className="ms-surf-forecast-day ms-surf-forecast-compressed-day" onClick={onClick}>
            <div className="ms-surf-forecast-day__header">
                <p className="ms-surf-forecast-day__day">
                    {dayjs(props.day.time).tz(props.timezone).format('ddd D MMM')}
                </p>
                <p className="ms-surf-forecast-day__swell">Swell</p>
                <p className="ms-surf-forecast-day__wind">Wind</p>
                <p className="ms-surf-forecast-day__secondary-swell">Secondary swell</p>
                <Icon icon={'enlarge'} />
            </div>

            <div className="ms-surf-forecast-day__rows">
                {props.day.compressed_data.map((row, key) => (
                    <ForecastRow key={key} row={row} goodConditions={props.goodConditions} timezone={props.timezone} />
                ))}
            </div>
        </div>
    );
};
export default SurfSpotForecastCompressedDay;
