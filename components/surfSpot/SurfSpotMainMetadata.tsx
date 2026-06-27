import Icon from 'mondosurf-library/components/Icon';
import SurfSpotDirection from 'mondosurf-library/components/SurfSpotDirection';
import { returnDirectionLabel } from 'mondosurf-library/helpers/labels.helpers';
import { ISurfSpot } from 'mondosurf-library/model/iSurfSpot';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotMainMetadata {
    surfSpotData: ISurfSpot;
}

const SurfSpotMainMetadata: React.FC<ISurfSpotMainMetadata> = (props) => {
    return (
        <section className="ms-surf-spot-main-metadata ms-grid-1-3 ms-grid-v-1" data-test="surf-spot-special-info">
            {props.surfSpotData.direction && (
                <div className="ms-surf-spot-main-metadata__metadata ms-surf-spot-main-metadata__direction">
                    <p className="ms-label">{mondoTranslate('surf_spot.wave_direction')}</p>
                    <div className="ms-surf-spot-main-metadata__direction-icon">
                        {props.surfSpotData.direction === 'A' && <Icon icon="wave-a-frame" />}
                        {props.surfSpotData.direction === 'R' && <Icon icon="wave-right" />}
                        {props.surfSpotData.direction === 'L' && <Icon icon="wave-left" />}
                        {props.surfSpotData.direction !== 'A' &&
                            props.surfSpotData.direction !== 'R' &&
                            props.surfSpotData.direction !== 'L' && <Icon icon="wave" />}
                    </div>
                    <p className="ms-value" data-test="surf-spot-info-direction">
                        {returnDirectionLabel(props.surfSpotData.direction)}
                    </p>
                </div>
            )}

            {props.surfSpotData.forecast_conditions_swell_direction_min !== undefined &&
                props.surfSpotData.forecast_conditions_swell_direction_max !== undefined &&
                !(
                    props.surfSpotData.forecast_conditions_swell_direction_min === 0 &&
                    props.surfSpotData.forecast_conditions_swell_direction_max === 0
                ) && (
                    <div className="ms-surf-spot-main-metadata__metadata ms-surf-spot-main-metadata__swell">
                        <p className="ms-label">{mondoTranslate('surf_spot.best_swell')}</p>

                        <SurfSpotDirection
                            min={props.surfSpotData.forecast_conditions_swell_direction_min}
                            max={props.surfSpotData.forecast_conditions_swell_direction_max}
                            label={mondoTranslate('basics.swell')}
                            type="swell"
                            hideLabel={true}
                        />
                    </div>
                )}

            {props.surfSpotData.forecast_conditions_wind_direction_min !== undefined &&
                props.surfSpotData.forecast_conditions_wind_direction_max !== undefined &&
                !(
                    props.surfSpotData.forecast_conditions_wind_direction_min === 0 &&
                    props.surfSpotData.forecast_conditions_wind_direction_max === 0
                ) && (
                    <div className="ms-surf-spot-main-metadata__metadata ms-surf-spot-main-metadata__wind">
                        <p className="ms-label">{mondoTranslate('surf_spot.best_wind')}</p>
                        <SurfSpotDirection
                            min={props.surfSpotData.forecast_conditions_wind_direction_min}
                            max={props.surfSpotData.forecast_conditions_wind_direction_max}
                            label={mondoTranslate('basics.wind')}
                            type="wind"
                            hideLabel={true}
                        />
                    </div>
                )}
        </section>
    );
};
export default SurfSpotMainMetadata;
