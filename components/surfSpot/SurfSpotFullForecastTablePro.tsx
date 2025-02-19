// Client
'use client';

import Banner from 'mondosurf-library/components/Banner';
import SurfSpotForecastCompressedDay from 'mondosurf-library/components/SurfSpotForecastCompressedDay';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';
import { RootState } from 'mondosurf-library/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface ISurfSpotFullForecastTablePro {
    spot: ISurfSpot;
    proSpotForecast: ISurfSpotForecast;
}

const SurfSpotFullForecastTablePro: React.FC<ISurfSpotFullForecastTablePro> = (props) => {
    // Redux
    const logged = useSelector((state: RootState) => state.user.logged);
    const accountType = useSelector((state: RootState) => state.user.accountType);

    const [hasProPermissions, setHasProPermissions] = useState<'yes' | 'no' | 'checking'>('checking');

    useEffect(() => {
        if (logged === 'yes' && (accountType === 'admin' || accountType === 'pro' || accountType === 'trial')) {
            setHasProPermissions('yes');
        } else {
            setHasProPermissions('no');
        }
    }, [logged, accountType]);

    return (
        <div className="ms-surf-spot-full-forecast-table-pro">
            {hasProPermissions === 'yes' && (
                <>
                    {props.spot &&
                        props.spot.forecast_update &&
                        props.proSpotForecast &&
                        props.proSpotForecast.compressed_days && (
                            <>
                                {/* List */}
                                {props.proSpotForecast.compressed_days.days.map((compressed_day, key) => (
                                    <SurfSpotForecastCompressedDay
                                        key={key}
                                        day={compressed_day}
                                        dayId={key + 3}
                                        days={props.proSpotForecast.days}
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
                                        spotId={props.spot.id}
                                    />
                                ))}
                            </>
                        )}
                </>
            )}
            {hasProPermissions === 'no' && (
                <div className="ms-surf-spot-full-forecast-table-pro__banner">
                    <Banner type={'getPro'} />
                </div>
            )}
        </div>
    );
};
export default SurfSpotFullForecastTablePro;
