import Metadata from 'mondosurf-library/components/Metadata';
import {
    returnBoardTypeLabel,
    returnBottomLabel,
    returnCrowdLabel,
    returnFrequencyLabel,
    returnQualityLabel,
    returnWaveLengthLabel,
    returnWaveSteepnessLabel
} from 'mondosurf-library/helpers/labels.helpers';
import { experienceText, returnReadableArray, returnSwellSizeRange } from 'mondosurf-library/helpers/surfSpot.helpers';
import { ISurfSpot } from 'mondosurf-library/model/iSurfSpot';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotAdditionalMetadata {
    surfSpotData: ISurfSpot;
}

const SurfSpotAdditionalMetadata: React.FC<ISurfSpotAdditionalMetadata> = (props) => {
    return (
        <div className="ms-surf-spot-additional-metadata">
            <section className="ms-grid-1-3 ms-grid-v-1" data-test="surf-spot-info">
                {/* Bottom */}
                {props.surfSpotData.bottom && (
                    <Metadata
                        label={mondoTranslate('basics.bottom')}
                        value={returnBottomLabel(props.surfSpotData.bottom)!}
                    />
                )}

                {/* Best size */}
                {props.surfSpotData.forecast_conditions_swell_height_min &&
                    props.surfSpotData.forecast_conditions_swell_height_max && (
                        <Metadata
                            label={mondoTranslate('surf_spot.best_size')}
                            value={
                                returnSwellSizeRange(
                                    props.surfSpotData.forecast_conditions_swell_height_min,
                                    props.surfSpotData.forecast_conditions_swell_height_max
                                )!
                            }
                        />
                    )}

                {props.surfSpotData.forecast_conditions_swell_height_min &&
                    (!props.surfSpotData.forecast_conditions_swell_height_max ||
                        props.surfSpotData.forecast_conditions_swell_height_max === -1) && (
                        <Metadata
                            label={mondoTranslate('surf_spot.best_size')}
                            value={returnSwellSizeRange(props.surfSpotData.forecast_conditions_swell_height_min)!}
                        />
                    )}

                {/* Wave length */}
                {props.surfSpotData.wave_length && (
                    <Metadata
                        label={mondoTranslate('surf_spot.wave_length')}
                        value={returnWaveLengthLabel(props.surfSpotData.wave_length)!}
                    />
                )}

                {/* Wave steepness */}
                {props.surfSpotData.wave_steepness && (
                    <Metadata
                        label={mondoTranslate('surf_spot.wave_steepness')}
                        value={returnWaveSteepnessLabel(props.surfSpotData.wave_steepness)!}
                    />
                )}

                {/* Frequency */}
                {props.surfSpotData.frequency && (
                    <Metadata
                        label={mondoTranslate('surf_spot.frequency')}
                        value={returnFrequencyLabel(props.surfSpotData.frequency)!}
                    />
                )}

                {/* Quality */}
                {props.surfSpotData.quality && (
                    <Metadata
                        label={mondoTranslate('surf_spot.quality')}
                        value={returnQualityLabel(props.surfSpotData.quality)!}
                    />
                )}

                {/* Experience */}
                {props.surfSpotData.experience && (
                    <Metadata
                        label={mondoTranslate('surf_spot.experience')}
                        value={experienceText(props.surfSpotData)}
                    />
                )}

                {/* Boards */}
                {props.surfSpotData.board &&
                    props.surfSpotData.board.length > 0 &&
                    props.surfSpotData.board.length === 5 && (
                        <Metadata
                            label={mondoTranslate('surf_spot.boards')}
                            value={mondoTranslate('surf_spot.all_boards_are_good')}
                        />
                    )}
                {props.surfSpotData.board &&
                    props.surfSpotData.board.length > 0 &&
                    props.surfSpotData.board.length < 5 && (
                        <Metadata
                            label={mondoTranslate('surf_spot.boards')}
                            value={returnReadableArray(props.surfSpotData.board, returnBoardTypeLabel, ', ')}
                        />
                    )}

                {/* Crowd */}
                {props.surfSpotData.crowd && (
                    <Metadata
                        label={mondoTranslate('surf_spot.crowd')}
                        value={returnCrowdLabel(props.surfSpotData.crowd)!}
                    />
                )}

                {/* Adaptive surf */}
                {props.surfSpotData.adaptive_surfing && props.surfSpotData.adaptive_surfing === true && (
                    <Metadata value={mondoTranslate('surf_spot.adaptive_surfing')} />
                )}

                {/* Surf schools */}
                {props.surfSpotData.surf_schools && props.surfSpotData.surf_schools === true && (
                    <Metadata value={mondoTranslate('surf_spot.surf_schools')} />
                )}
            </section>
        </div>
    );
};
export default SurfSpotAdditionalMetadata;
