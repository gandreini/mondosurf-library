import { COLOR_VARIABLES } from '../constants/colorVariables';

interface IDirectionArrow {
    direction: number;
    style?: 'swell' | 'wind' | 'night';
}

const DirectionArrow: React.FC<IDirectionArrow> = (props: IDirectionArrow) => {
    // Returns the color
    const returnColor = () => {
        if (!props.style) return COLOR_VARIABLES.cssColorSwell;
        if (props.style === 'swell') return COLOR_VARIABLES.cssColorSwell;
        if (props.style === 'wind') return COLOR_VARIABLES.cssColorWind;
        if (props.style === 'night') return COLOR_VARIABLES.cssColorNightDark;
    };

    return (
        <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>{props.direction.toString() + '°'}</title>
                <path
                    d="M19.2556 0.0653101C19.6831 -0.171619 20.1632 0.280112 19.946 0.714861L10.4469 19.7253C10.2638 20.0916 9.73616 20.0916 9.55312 19.7253L0.0540167 0.714858C-0.163218 0.280109 0.316931 -0.171623 0.744429 0.0653069L9.75646 5.05999C9.90777 5.14385 10.0922 5.14385 10.2435 5.05999L19.2556 0.0653101Z"
                    fill={returnColor()}
                    transform={`rotate(${props.direction} 10 10)`}
                />
            </svg>
        </>
    );
};
export default DirectionArrow;
