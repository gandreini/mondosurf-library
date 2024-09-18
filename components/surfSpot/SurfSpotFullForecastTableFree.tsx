// Server

import SurfSpotForecastCompressedDay from 'mondosurf-library/components/SurfSpotForecastCompressedDay';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';

interface ISurfSpotFullForecastTableFree {
    spot: ISurfSpot;
    freeSpotForecast: ISurfSpotForecast;
}

const SurfSpotFullForecastTableFree: React.FC<ISurfSpotFullForecastTableFree> = (props) => {
    return (
        <>
            {props.spot &&
                props.spot.forecast_update &&
                props.freeSpotForecast &&
                props.freeSpotForecast.compressed_days && (
                    <>
                        {/* List */}
                        {props.freeSpotForecast.compressed_days.days.map((compressed_day, key) => (
                            <SurfSpotForecastCompressedDay
                                key={key}
                                day={compressed_day}
                                dayId={key}
                                days={props.freeSpotForecast.days}
                                goodConditions={{
                                    swellDirectionMin: props.spot.forecast_conditions_swell_direction_min,
                                    swellDirectionMax: props.spot.forecast_conditions_swell_direction_max,
                                    swellHeightMin: props.spot.forecast_conditions_swell_height_min,
                                    swellHeightMax: props.spot.forecast_conditions_swell_height_max
                                        ? props.spot.forecast_conditions_swell_height_max
                                        : -1,
                                    swellPeriodMin: props.spot.forecast_conditions_swell_period_min,
                                    windDirectionMin: props.spot.forecast_conditions_wind_direction_min,
                                    windDirectionMax: props.spot.forecast_conditions_wind_direction_max,
                                    windOffShoreSpeedMax: props.spot.forecast_conditions_wind_speed_max
                                        ? props.spot.forecast_conditions_wind_speed_max
                                        : -1,
                                    windOnShoreSpeedMax: props.spot.forecast_conditions_on_shore_wind_speed_max
                                        ? props.spot.forecast_conditions_on_shore_wind_speed_max
                                        : -1
                                }}
                                timezone={props.spot.timezone}
                                spotName={props.spot.name}
                                spotSlug={props.spot.slug}
                            />
                        ))}
                    </>
                )}
        </>
    );
};
export default SurfSpotFullForecastTableFree;
