// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import useAuthGetFetch from 'mondosurf-library/api/useAuthGetFetch';
import Button from 'mondosurf-library/components/Button';
import DayAstronomyTable from 'mondosurf-library/components/DayAstronomyTable';
import DayTideTable from 'mondosurf-library/components/DayTideTable';
import LastUpdate from 'mondosurf-library/components/LastUpdate';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
import SurfSpotForecastDay from 'mondosurf-library/components/SurfSpotForecastDay';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import {
    ISurfForecastRow,
    ISurfSpotForecastDay,
    ISurfSpotForecastDayTideHighLow,
    ISurfSpotGoodConditions
} from 'mondosurf-library/model/iSurfSpot';
import modalService from 'mondosurf-library/services/modalService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { useRouterProxy } from 'proxies/useRouter';
import { useEffect, useState } from 'react';

interface IForecastDayDetail {
    dayId: number;
    spotId: number;
    spotSlug: string;
    timezone?: string;
    goodConditions?: ISurfSpotGoodConditions;
    days?: ISurfSpotForecastDay[] | null;
    lastUpdate?: number;
    dayToShow?: number;
    hourToShow?: number;
    origin: 'GoodTime' | 'FullForecast';
    showSpotButton?: boolean;
}

const ForecastDayDetail: React.FC<IForecastDayDetail> = (props) => {
    // React router.
    const router = useRouterProxy();

    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const showSpotButton = props.showSpotButton ? true : false;

    const [surfSpotForecastQuery, setSurfSpotForecastQuery] = useState('');
    const fetchedSurfSpotForecast = useAuthGetFetch(surfSpotForecastQuery, {}, false);
    const [spotTimezone, setSpotTimezone] = useState<string>('');
    const [spotGoodConditions, setSpotGoodContditions] = useState<ISurfSpotGoodConditions | null>(null);
    const [spotForecastDay, setSpotForecastDay] = useState<ISurfForecastRow[] | null>(null);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    // Astronomy
    const [civilDawn, setCivilDawn] = useState<string | null>(null);
    const [sunrise, setSunrise] = useState<string | null>(null);
    const [sunset, setSunset] = useState<string | null>(null);
    const [civilDusk, setCivilDusk] = useState<string | null>(null);

    // Tide
    const [tide, setTide] = useState<ISurfSpotForecastDayTideHighLow[] | null>(null);

    useEffect(() => {
        if (props.timezone && props.goodConditions && props.days) {
            setSpotTimezone(props.timezone);
            setSpotGoodContditions(props.goodConditions);
            setSpotForecastDay(props.days[props.dayId].hourly_data);
            setCivilDawn(props.days[props.dayId].civil_dawn);
            setSunrise(props.days[props.dayId].sunrise);
            setSunset(props.days[props.dayId].sunset);
            setCivilDusk(props.days[props.dayId].civil_dusk);
            setTide(props.days[props.dayId].tide.high_low);
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
            setCivilDawn(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].civil_dawn);
            setSunrise(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].sunrise);
            setSunset(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].sunset);
            setCivilDusk(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].civil_dusk);
            setTide(fetchedSurfSpotForecast.payload.spot_forecast.days[props.dayId].tide.high_low);
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

    // Navigates to a spot page
    const onNavigateToSpot = () => {
        router.push(`/surf-spot/${props.spotSlug}/guide/${props.spotId}`);

        setTimeout(() => {
            modalService.closeModal();
        }, 200);
    };

    return (
        <div className="ms-forecast-day-detail">
            <div className="ms-forecast-day-detail__content">
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
                {/* {lastUpdate && (
                <div className="ms-surf-spot-forecast__good-times-update">
                    <LastUpdate lastUpdate={lastUpdate} />
                </div>
            )} */}
                {/* Astronomy */}
                {civilDawn && sunrise && sunset && civilDusk && spotTimezone && (
                    <DayAstronomyTable
                        civil_dawn={dayjs(civilDawn).tz(spotTimezone).format(hourMinFormat())}
                        sunrise={dayjs(sunrise).tz(spotTimezone).format(hourMinFormat())}
                        sunset={dayjs(sunset).tz(spotTimezone).format(hourMinFormat())}
                        civil_dusk={dayjs(civilDusk).tz(spotTimezone).format(hourMinFormat())}
                    />
                )}

                {/* Tide */}
                {tide && spotTimezone && <DayTideTable highLows={tide} timezone={spotTimezone} />}
            </div>

            <div className="ms-forecast-day-detail__footer">
                {/* Buttons */}
                <Button label="Close" callback={() => modalService.closeModal()} />
                {showSpotButton && <Button label="Spot page" callback={() => onNavigateToSpot()} />}
            </div>
        </div>
    );
};
export default ForecastDayDetail;
