import { COLOR_VARIABLES } from 'mondosurf-library/constants/colorVariables';

interface IChartDirectionMini {
    direction: string[];
    directionColor: string;
    bgColor?: string;
}

const ChartDirectionMini: React.FC<IChartDirectionMini> = (props) => {
    const bgColor = props.bgColor ? props.bgColor : COLOR_VARIABLES.cssColorGray03;
    return (
        <svg height="20" width="20" viewBox="0 0 20 20">
            <circle r="10" cx="10" cy="10" fill={bgColor} />
            {props.direction.includes('NE') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 292.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('N') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 247.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('NW') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 202.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('W') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 157.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('SW') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 112.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('S') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 67.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('SE') && (
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke={props.directionColor}
                    strokeWidth="9"
                    strokeDasharray="0 calc( 22.5 * 31.42 / 360 ) calc( 45 * 31.42 / 360 ) 31.42"
                />
            )}
            {props.direction.includes('E') && (
                <>
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke={props.directionColor}
                        strokeWidth="9"
                        strokeDasharray="0 calc( 0 * 31.42 / 360 ) calc( 22.5 * 31.42 / 360 ) 31.42"
                    />
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke={props.directionColor}
                        strokeWidth="9"
                        strokeDasharray="0 calc( 337.5 * 31.42 / 360 ) calc( 22.5 * 31.42 / 360 ) 31.42"
                    />
                </>
            )}
            <circle r="9" cx="10" cy="10" strokeWidth="0" stroke={props.directionColor} fill="transparent"></circle>
        </svg>
    );
};
export default ChartDirectionMini;
