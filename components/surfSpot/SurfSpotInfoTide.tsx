import { returnMovementTideLabel } from 'mondosurf-library/helpers/labels.helpers';
import { returnTideDetails } from 'mondosurf-library/helpers/surfSpot.helpers';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotInfoTide {
    surfSpotData: ISurfSpot;
    forecastData?: ISurfSpotForecast;
    children?: React.ReactNode;
    showText?: boolean;
}

const SurfSpotInfoTide: React.FC<ISurfSpotInfoTide> = (props) => {
    const tideAlwaysGood =
        (props.surfSpotData.tide && props.surfSpotData.tide.length === 0) ||
        (props.surfSpotData.tide && props.surfSpotData.tide?.length === 3)
            ? true
            : false;

    return (
        <>
            {/* Info provided */}
            {props.surfSpotData.tide && (
                <section
                    className={`ms-surf-spot-info-tide ${props.showText ? 'ms-surf-spot-info-tide-has-text' : ''}`}>
                    <div className="ms-surf-spot-info-tide__left">
                        <h2 className="ms-surf-spot-info-tide__title ms-h3-title">
                            {mondoTranslate('tide.best_tide', { surfSpot: props.surfSpotData.name })}
                        </h2>

                        <p className="ms-surf-spot-info-tide__details">
                            {/* Tide */}
                            <span className="ms-body-text ms-surf-spot-info-tide__details-text">
                                {tideAlwaysGood && mondoTranslate('tide.tides_all_good')}
                                {!tideAlwaysGood && <>{returnTideDetails(props.surfSpotData.tide)}</>}
                            </span>{' '}
                            {/* Tide movement */}
                            {/* {props.surfSpotData.tide_movement && props.surfSpotData.tide_movement.length === 2 && (
                                <span className="ms-body-text ms-surf-spot-info-tide__details-movement-text">
                                    ({mondoTranslate('tide.tide_movement_always_good')})
                                </span>
                            )} */}
                            {props.surfSpotData.tide_movement &&
                                props.surfSpotData.tide_movement.length > 0 &&
                                props.surfSpotData.tide_movement.length < 2 && (
                                    <span className="ms-body-text ms-surf-spot-info-tide__details-movement-text">
                                        ({mondoTranslate('tide.tide_movement_good_at')}
                                        {': '}
                                        {returnMovementTideLabel(props.surfSpotData.tide_movement[0])})
                                    </span>
                                )}
                        </p>

                        {props.children}

                        {/* <Button
                            label={mondoTranslate('tide.button_tide_table')}
                            url={`${FRONTEND_URL}surf-spot/${props.surfSpotData.slug}/tide/${props.surfSpotData.id}`}
                        /> */}

                        {/* <p className="ms-surf-spot-info-tide__good-moments">
                        {props.forecastData &&
                            props.forecastData.days &&
                            props.forecastData.days[0].tide.good_tide &&
                            props.forecastData.days[0].tide.good_tide.length > 0 && (
                                <TideGoodMoments
                                    good_tide={props.forecastData.days[0].tide.good_tide}
                                    timezone={props.surfSpotData.timezone}
                                />
                            )}
                    </p> */}
                    </div>
                    {props.showText && (
                        <div className="ms-surf-spot-info-tide__right">
                            {tideAlwaysGood && (
                                <p className="ms-small-text">
                                    {mondoTranslate('tide.explanation_medium_all_good', {
                                        surfSpot: props.surfSpotData.name
                                    })}
                                </p>
                            )}
                            {!tideAlwaysGood && (
                                <p className="ms-small-text">
                                    {mondoTranslate('tide.explanation_medium_not_all_good', {
                                        surfSpot: props.surfSpotData.name
                                    })}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}
        </>
    );
};
export default SurfSpotInfoTide;
