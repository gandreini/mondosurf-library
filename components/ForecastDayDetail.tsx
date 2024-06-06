import SurfSpotForecastDay from 'features/surfSpotForecast/SurfSpotForecastDay';
import { ISurfSpotForecastDay, ISurfSpotGoodConditions } from 'mondosurf-library/model/iSurfSpot';

interface IForecastDayDetail {
    timezone: string;
    goodConditions: ISurfSpotGoodConditions;
    days?: ISurfSpotForecastDay[] | null;
    spotId?: number;
    dayId?: number;
}

const ForecastDayDetail: React.FC<IForecastDayDetail> = (props) => {
    return (
        <>
            {/* List */}
            {props.days && props.dayId && (
                <SurfSpotForecastDay
                    day={props.days[props.dayId].hourly_data}
                    dayId={props.dayId}
                    goodConditions={props.goodConditions}
                    timezone={props.timezone}
                />
            )}

            {/* Last update */}
            {/* <div className="ms-surf-spot-forecast__good-times-update">
                <LastUpdateProxy lastUpdate={spotForecast.spot_forecast.last_forecast_update} />
            </div> */}
        </>
    );
};
export default ForecastDayDetail;
