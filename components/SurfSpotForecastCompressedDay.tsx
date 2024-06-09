import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ForecastDayDetail from 'mondosurf-library/components/ForecastDayDetail';
import ForecastRow from 'mondosurf-library/components/ForecastRow';
import { ICompressedData, ISurfSpotForecastDay, ISurfSpotGoodConditions } from 'mondosurf-library/model/iSurfSpot';
import modalService from 'mondosurf-library/services/modalService';

interface ISurfSpotForecastCompressedDay {
    day: ICompressedData;
    dayId: number;
    days?: ISurfSpotForecastDay[];
    timezone: string;
    goodConditions: ISurfSpotGoodConditions;
    spotName?: string;
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
                dayId: props.dayId,
                days: props.days,
                timezone: props.timezone,
                goodConditions: props.goodConditions,
                origin: 'FullForecast'
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
