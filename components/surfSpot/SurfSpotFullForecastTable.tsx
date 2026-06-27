// Server

import LastUpdate from 'mondosurf-library/components/LastUpdate';
import { limitForecastToDaysRange } from 'mondosurf-library/helpers/forecast.helpers';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';
import SurfSpotForecastCompressedDay from 'mondosurf-library/components/SurfSpotForecastCompressedDay';
import { MAX_FORECAST_DAYS } from 'mondosurf-library/constants/constants';

interface ISurfSpotFullForecastTable {
    spot: ISurfSpot;
    spotForecast: ISurfSpotForecast;
}

const SurfSpotFullForecastTable: React.FC<ISurfSpotFullForecastTable> = (props) => {
    const forecast = limitForecastToDaysRange(props.spotForecast, MAX_FORECAST_DAYS, props.spot.timezone);

    return (
        <div className="ms-surf-spot-full-forecast-table" data-test="full-forecast">
            {props.spot && props.spot.forecast_update && forecast && forecast.compressed_days && (
                <>
                    {forecast.compressed_days.days.map((compressed_day, key) => (
                        <SurfSpotForecastCompressedDay
                            key={key}
                            day={compressed_day}
                            dayId={key}
                            days={forecast.days}
                            goodConditions={{
                                swellDirectionMin: props.spot.forecast_conditions_swell_direction_min,
                                swellDirectionMax: props.spot.forecast_conditions_swell_direction_max,
                                swellHeightMin: props.spot.forecast_conditions_swell_height_min,
                                swellHeightMax: props.spot.forecast_conditions_swell_height_max ?? -1,
                                swellPeriodMin: props.spot.forecast_conditions_swell_period_min,
                                windDirectionMin: props.spot.forecast_conditions_wind_direction_min,
                                windDirectionMax: props.spot.forecast_conditions_wind_direction_max,
                                windOffShoreSpeedMax: props.spot.forecast_conditions_wind_speed_max ?? -1,
                                windOnShoreSpeedMax: props.spot.forecast_conditions_on_shore_wind_speed_max ?? -1
                            }}
                            timezone={props.spot.timezone}
                            spotName={props.spot.name}
                            spotSlug={props.spot.slug}
                            spotId={props.spot.id}
                        />
                    ))}
                </>
            )}

            {/* Last update */}
            {forecast?.last_forecast_update && (
                <div className="ms-surf-spot-forecast__good-times-update">
                    <LastUpdate lastUpdate={forecast.last_forecast_update} />
                </div>
            )}
        </div>
    );
};
export default SurfSpotFullForecastTable;
