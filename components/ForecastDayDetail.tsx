// Client
'use client';

import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import LastUpdate from 'mondosurf-library/components/LastUpdate';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
import SurfSpotForecastDay from 'mondosurf-library/components/SurfSpotForecastDay';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { ISurfForecastRow, ISurfSpotForecastDay, ISurfSpotGoodConditions } from 'mondosurf-library/model/iSurfSpot';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { useEffect, useState } from 'react';

interface IForecastDayDetail {
    dayId: number;
    spotId: number;
    timezone?: string;
    goodConditions?: ISurfSpotGoodConditions;
    days?: ISurfSpotForecastDay[] | null;
    lastUpdate?: number;
    dayToShow?: number;
    hourToShow?: number;
    origin: 'GoodTime' | 'FullForecast';
}

const ForecastDayDetail: React.FC<IForecastDayDetail> = (props) => {
    const [surfSpotForecastQuery, setSurfSpotForecastQuery] = useState('');
    const fetchedSurfSpotForecast = useAuthGetFetch(surfSpotForecastQuery, {}, false);
    const [spotTimezone, setSpotTimezone] = useState<string>('');
    const [spotGoodConditions, setSpotGoodContditions] = useState<ISurfSpotGoodConditions | null>(null);
    const [spotForecastDay, setSpotForecastDay] = useState<ISurfForecastRow[] | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    useEffect(() => {
        if (props.timezone && props.goodConditions && props.days) {
            setSpotTimezone(props.timezone);
            setSpotGoodContditions(props.goodConditions);
            setSpotForecastDay(props.days[props.dayId].hourly_data);
        } else {
            setSurfSpotForecastQuery('surf-spot/forecast/' + props.spotId);
        }

        if (props.lastUpdate) setLastUpdate(props.lastUpdate);

        // Cleanup here.
        return function cleanup() {
            setSurfSpotForecastQuery('');
        };
    }, [props.spotId]);

    useEffect(() => {
        if (fetchedSurfSpotForecast.status === 'loaded') {
            setSpotTimezone(fetchedSurfSpotForecast.payload.spot_forecast.timezone);
            setSpotGoodContditions({
                swellDirectionMin: fetchedSurfSpotForecast.payload.forecast_conditions_swell_direction_min,
                swellDirectionMax: fetchedSurfSpotForecast.payload.forecast_conditions_swell_direction_max,
                swellHeightMin: fetchedSurfSpotForecast.payload.forecast_conditions_swell_height_min,
                swellHeightMax: fetchedSurfSpotForecast.payload.forecast_conditions_swell_height_max || null,
                swellPeriodMin: fetchedSurfSpotForecast.payload.forecast_conditions_swell_period_min,
                windDirectionMin: fetchedSurfSpotForecast.payload.forecast_conditions_wind_direction_min,
                windDirectionMax: fetchedSurfSpotForecast.payload.forecast_conditions_wind_direction_max,
                windOffShoreSpeedMax: fetchedSurfSpotForecast.payload.forecast_conditions_wind_speed_max || null,
                windOnShoreSpeedMax: fetchedSurfSpotForecast.payload.forecast_conditions_on_shore_wind_speed_max || null
            });
            setSpotForecastDay(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].hourly_data);
            setLastUpdate(fetchedSurfSpotForecast.payload.last_update);
        }
    }, [fetchedSurfSpotForecast, props.dayId]);

    useEffect(() => {
        if (spotForecastDay && spotGoodConditions && spotTimezone) {
            Tracker.trackEvent(['mp', 'ga'], TrackingEvent.SpotForecastDetailsShow, {
                spotId: props.spotId,
                origin: props.origin
            });
        }
    }, [props.spotId, spotForecastDay, spotGoodConditions, spotTimezone]);

    return (
        <>
            {/* Loading */}
            {!spotForecastDay && !spotGoodConditions && !spotTimezone && (
                <>
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                    <SkeletonLoader height="45px" marginBottom="3px" />
                </>
            )}

            {/* List */}
            {spotForecastDay && spotGoodConditions && spotTimezone && (
                <SurfSpotForecastDay
                    day={spotForecastDay}
                    dayId={props.dayId}
                    goodConditions={spotGoodConditions}
                    timezone={spotTimezone}
                    dayToShow={props.dayToShow}
                    hourToShow={props.hourToShow}
                />
            )}

            {/* Last update */}
            {lastUpdate && (
                <div className="ms-surf-spot-forecast__good-times-update">
                    <LastUpdate lastUpdate={lastUpdate} />
                </div>
            )}
        </>
    );
};
export default ForecastDayDetail;
