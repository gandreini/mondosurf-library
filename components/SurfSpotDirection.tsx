import ChartDirectionMini from '../components/ChartDirectionMini';
import { COLOR_VARIABLES } from '../constants/colorVariables';
import { readableDirectionFromDegreesRange } from '../helpers/surfSpot.helpers';

interface ISurfSpotDirection {
    min: number;
    max: number;
    label: string;
    type: 'swell' | 'wind';
    hideLabel?: boolean;
}

const SurfSpotDirection: React.FC<ISurfSpotDirection> = (props: ISurfSpotDirection) => {
    const returnDirectionColor = () => {
        if (props.type === 'swell') return COLOR_VARIABLES.cssColorSwell;
        if (props.type === 'wind') return COLOR_VARIABLES.cssColorWind;
        return COLOR_VARIABLES.cssColorGray06;
    };

    return (
        <div className={`ms-surf-spot-direction ms-surf-spot-direction-${props.type}`}>
            <div className="ms-surf-spot-direction__chart">
                <ChartDirectionMini
                    direction={readableDirectionFromDegreesRange(props.min, props.max)}
                    directionColor={returnDirectionColor()}
                />
            </div>
            <div className="ms-surf-spot-direction__text">
                {!props.hideLabel && <div className="ms-surf-spot-direction__label">{props.label}</div>}
                <div className="ms-surf-spot-direction__value">
                    {readableDirectionFromDegreesRange(props.min, props.max).join(', ')}
                </div>
                <div className="ms-surf-spot-direction__small-text">{props.min + '°-' + props.max + '°'}</div>
            </div>
        </div>
    );
};
export default SurfSpotDirection;
