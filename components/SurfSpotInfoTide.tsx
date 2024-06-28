import { returnTideDetails } from 'features/surfSpot/surfSpot.helpers';
import { returnMovementTideLabel } from 'mondosurf-library/helpers/labels.helpers';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotInfoTide {
    surfSpotData: ISurfSpot;
    forecastData?: ISurfSpotForecast;
}

const SurfSpotInfoTide: React.FC<ISurfSpotInfoTide> = (props) => {
    /* function showTideTableModal() {
        modalService.openModal({
            title: mondoTranslate('tide.tide_table'),
            closeButtonText: mondoTranslate('basics.close'),
            component: TideTable,
            componentProps: {
                weeklyLimits: props.surfSpotData.spot_forecast!.tide_weekly.max_min,
                days: props.surfSpotData.spot_forecast!.days,
                timezone: props.surfSpotData.timezone
            },
            classes: 'ms-modal-tide-table'
        });
    } */

    return (
        <>
            {/* No tide info provided */}
            {props.surfSpotData.tide && props.surfSpotData.tide?.length === 0 && (
                <div className="ms-surf-spot-info-tide is-empty"></div>
            )}

            {/* Info provided */}
            {props.surfSpotData.tide && props.surfSpotData.tide?.length > 0 && (
                <section className="ms-surf-spot-info-tide">
                    <h2 className="ms-surf-spot-info-tide__title ms-body-text">{mondoTranslate('tide.best_tide')}</h2>

                    <p className="ms-surf-spot-info-tide__details">
                        {/* Tide */}
                        {props.surfSpotData.tide?.length === 3 && mondoTranslate('tide.tides_all_good')}
                        {props.surfSpotData.tide &&
                            props.surfSpotData.tide.length > 0 &&
                            props.surfSpotData.tide.length < 3 && (
                                <>
                                    <span className="ms-surf-spot-info-tide__details">
                                        {returnTideDetails(props.surfSpotData.tide)}
                                    </span>
                                </>
                            )}{' '}
                        {/* Tide movement */}
                        {props.surfSpotData.tide_movement && props.surfSpotData.tide_movement.length === 2 && (
                            <span className="ms-surf-spot-info-tide__details-movement">
                                ({mondoTranslate('tide.tide_movement_always_good')})
                            </span>
                        )}
                        {props.surfSpotData.tide_movement &&
                            props.surfSpotData.tide_movement.length > 0 &&
                            props.surfSpotData.tide_movement.length < 2 && (
                                <span className="ms-surf-spot-info-tide__details-movement">
                                    ({mondoTranslate('tide.tide_movement_good_at')}
                                    {': '}
                                    {returnMovementTideLabel(props.surfSpotData.tide_movement[0])})
                                </span>
                            )}
                    </p>

                    {/* <p className="ms-surf-spot-info-tide__good-moments">
                {props.forecastData &&
                    props.forecastData.days &&
                    props.forecastData.days[0].tide.good_tide &&
                    props.forecastData.days[0].tide.good_tide.length > 0 &&
                    hasProPermissions() && (
                        <TideGoodMoments
                            good_tide={props.forecastData.days[0].tide.good_tide}
                            timezone={props.surfSpotData.timezone}
                        />
                    )}
            </p>
            {props.forecastData && props.forecastData.days[1].tide && (
                <button
                    onClick={showTideTableModal}
                    className="ms-surf-spot-info-tide__button ms-btn ms-btn-cta ms-btn-s">
                    {mondoTranslate('tide.button_tide_table')}
                </button>
            )} */}
                </section>
            )}
        </>
    );
};
export default SurfSpotInfoTide;
