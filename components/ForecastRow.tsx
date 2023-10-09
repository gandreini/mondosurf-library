import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import GoodTimeQuality from '@/mondosurf-library/components/GoodTimeQuality';
import Icon from '@/mondosurf-library/components/Icon';
import { directionIsWithinRange } from '@/mondosurf-library/helpers/forecast.helpers';
import { ISurfForecastRow } from '@/mondosurf-library/modelStrict/iSurfSpot';

import DirectionArrow from './DirectionArrow';

interface IForecastRow {
    row: ISurfForecastRow;
    timezone: string;
    goodConditions: {
        swellDirectionMin: number;
        swellDirectionMax: number;
        swellHeightMin: number;
        swellHeightMax?: number;
        swellPeriodMin: number;
        windDirectionMin: number;
        windDirectionMax: number;
        windOffShoreSpeedMax?: number;
        windOnShoreSpeedMax?: number;
    };
}

const ForecastRow: React.FC<IForecastRow> = (props: IForecastRow) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Check if the wind speed is good taking into account all parameters
    const returnWindIsGood = (windSpeed: number, windDirection: number) => {
        if (
            directionIsWithinRange(
                windDirection,
                props.goodConditions.windDirectionMin,
                props.goodConditions.windDirectionMax
            )
        ) {
            // Offshore
            if (
                props.goodConditions.windOffShoreSpeedMax &&
                props.goodConditions.windOffShoreSpeedMax !== -1 &&
                windSpeed > props.goodConditions.windOffShoreSpeedMax
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            // Onshore
            if (
                props.goodConditions.windOnShoreSpeedMax &&
                props.goodConditions.windOnShoreSpeedMax !== -1 &&
                windSpeed < props.goodConditions.windOnShoreSpeedMax
            ) {
                return true;
            } else {
                return false;
            }
        }
    };

    return (
        <div
            id={`day-${dayjs(props.row.time).tz(props.timezone).format('D')}-hour-${dayjs(props.row.time)
                .tz(props.timezone)
                .format('H')}`}
            className={`ms-forecast-row ${!props.row.is_light ? 'ms-forecast-row-night' : ''} ${
                'ms-forecast-row-quality' + props.row.is_good.toString()
            }`}>
            {/* Time */}
            <div className="ms-forecast-row__time">
                <span className="ms-forecast-row__time-label">
                    {dayjs(props.row.time).tz(props.timezone).format('H')}
                </span>
            </div>

            {/* Quality */}
            <div className="ms-forecast-row__quality">
                {!props.row.is_light && <Icon icon={'night-2'} />}
                {props.row.is_light && <GoodTimeQuality quality={props.row.is_good} vertical={true} />}
            </div>

            {/* Swell size */}
            <div
                className={`ms-forecast-row__swell-size ${
                    props.row.swell_height < props.goodConditions.swellHeightMin && 'is-no-good'
                } ${
                    props.goodConditions.swellHeightMax &&
                    props.goodConditions.swellHeightMax !== -1 &&
                    props.row.swell_height > props.goodConditions.swellHeightMax &&
                    'is-no-good'
                }`}>
                <span className="ms-forecast-row__swell-size-value">{props.row.swell_height.toFixed(1)}</span>
                <span className="ms-forecast-row__swell-size-unit">mt</span>
            </div>

            {/* Swell period */}
            <div
                className={`ms-forecast-row__swell-period ${
                    props.row.swell_period < props.goodConditions.swellPeriodMin && 'is-no-good'
                }`}>
                <span className="ms-forecast-row__swell-period-value">{props.row.swell_period.toFixed(1)}</span>
                <span className="ms-forecast-row__swell-period-unit">s</span>
            </div>

            {/* Swell direction */}
            <div
                className={`ms-forecast-row__swell-direction ${
                    !directionIsWithinRange(
                        props.row.swell_direction,
                        props.goodConditions.swellDirectionMin,
                        props.goodConditions.swellDirectionMax
                    ) && 'is-no-good'
                }`}>
                <DirectionArrow
                    direction={props.row.swell_direction}
                    style={`${props.row.is_light ? 'swell' : 'night'}`}
                />
            </div>

            {/* Wind speed */}
            <div
                className={`ms-forecast-row__wind-speed ${
                    !returnWindIsGood(props.row.wind_speed, props.row.wind_direction) && 'is-no-good'
                }`}>
                <div className="ms-forecast-row__wind-speed-label">Wind</div>
                <div className="ms-forecast-row__wind-speed-content">
                    <div className="ms-forecast-row__wind-speed-value">{props.row.wind_speed.toFixed(1)}</div>
                    <div className="ms-forecast-row__wind-speed-unit">kph</div>
                </div>
            </div>

            {/* Wind direction */}
            <div
                className={`ms-forecast-row__wind-direction ${
                    !directionIsWithinRange(
                        props.row.wind_direction,
                        props.goodConditions.windDirectionMin,
                        props.goodConditions.windDirectionMax
                    ) && 'is-no-good'
                }`}>
                <DirectionArrow
                    direction={props.row.wind_direction}
                    style={`${props.row.is_light ? 'wind' : 'night'}`}
                />
            </div>
        </div>
    );
};
export default ForecastRow;
