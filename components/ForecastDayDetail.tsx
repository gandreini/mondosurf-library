// Client
'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { callApiNew } from 'mondosurf-library/api/api';
import Button from 'mondosurf-library/components/Button';
import DayAstronomyTable from 'mondosurf-library/components/DayAstronomyTable';
import LastUpdate from 'mondosurf-library/components/LastUpdate';
import SkeletonLoader from 'mondosurf-library/components/SkeletonLoader';
import SurfSpotForecastDay from 'mondosurf-library/components/SurfSpotForecastDay';
import TideTableDay from 'mondosurf-library/components/tide/TideTableDay';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { getForecastStaleTime } from 'mondosurf-library/helpers/reactQuery.helpers';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import {
    ISurfForecastRow,
    ISurfSpotForecastDayTideHighLow,
    ISurfSpotGoodConditions
} from 'mondosurf-library/model/iSurfSpot';
import modalService from 'mondosurf-library/services/modalService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { FORECAST_GARBAGE_COLLECTOR_TIME } from 'proxies/localConstants';
import { useRouterProxy } from 'proxies/useRouter';
import { useEffect, useState } from 'react';

interface IForecastDayDetail {
    dayId: number;
    spotId: number;
    spotSlug: string;
    dayToShow?: number;
    hourToShow?: number;
    origin: 'GoodTime' | 'FullForecast';
    showSpotButton?: boolean;
    // lastUpdate?: number;
    // days?: ISurfSpotForecastDay[] | null;
    // goodConditions?: ISurfSpotGoodConditions;
    // timezone?: string;
}

const ForecastDayDetail: React.FC<IForecastDayDetail> = (props) => {
    // React router
    const router = useRouterProxy();

    // Dayjs plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Fetch forecast
    const { isPending, isError, data, error } = useQuery({
        queryKey: [hasProPermissions() ? 'spotForecastPro' + props.spotId : 'spotForecast' + props.spotId],
        queryFn: () => callApiNew('surf-spot/forecast/' + props.spotId, 'GET'),
        staleTime: getForecastStaleTime(),
        gcTime: FORECAST_GARBAGE_COLLECTOR_TIME
    });

    const showSpotButton = props.showSpotButton ? true : false;

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
        if (data) {
            setSpotTimezone(data.spot_forecast.timezone);
            setSpotGoodContditions({
                swellDirectionMin: data.forecast_conditions_swell_direction_min,
                swellDirectionMax: data.forecast_conditions_swell_direction_max,
                swellHeightMin: data.forecast_conditions_swell_height_min,
                swellHeightMax: data.forecast_conditions_swell_height_max || null,
                swellPeriodMin: data.forecast_conditions_swell_period_min,
                windDirectionMin: data.forecast_conditions_wind_direction_min,
                windDirectionMax: data.forecast_conditions_wind_direction_max,
                windOffShoreSpeedMax: data.forecast_conditions_wind_speed_max || null,
                windOnShoreSpeedMax: data.forecast_conditions_on_shore_wind_speed_max || null
            });
            setSpotForecastDay(data.spot_forecast.days[props.dayId].hourly_data);
            setLastUpdate(data.spot_forecast.last_forecast_update);
            setCivilDawn(data.spot_forecast.days[props.dayId].civil_dawn);
            setSunrise(data.spot_forecast.days[props.dayId].sunrise);
            setSunset(data.spot_forecast.days[props.dayId].sunset);
            setCivilDusk(data.spot_forecast.days[props.dayId].civil_dusk);
            setTide(data.spot_forecast.days[props.dayId].tide.high_low);
        }
    }, [data]);

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
        router.push(`/surf-spot/${props.spotSlug}/full-forecast/${props.spotId}`);

        setTimeout(() => {
            modalService.closeModal();
        }, 200);
    };

    return (
        <div className="ms-forecast-day-detail">
            <div className="ms-forecast-day-detail__content">
                {/* Loading */}
                {isPending && (
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

                {/* Forecast */}
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
                    <div className="ms-forecast-day-detail__last-update">
                        <LastUpdate lastUpdate={lastUpdate} />
                    </div>
                )}

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
                {tide && spotTimezone && <TideTableDay highLows={tide} timezone={spotTimezone} />}
            </div>

            <div className="ms-forecast-day-detail__footer">
                {/* Buttons */}
                <Button label="Close" callback={() => modalService.closeModal()} />
                {showSpotButton && <Button label="Full Forecast" callback={() => onNavigateToSpot()} />}
            </div>
        </div>
    );
};
export default ForecastDayDetail;
