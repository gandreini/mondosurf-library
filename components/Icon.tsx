// Client and server

import { IIcon } from '@/mondosurf-library/modelStrict/iIcon';

const Icon: React.FC<IIcon> = (props: IIcon) => {
    /**
     * Returns the color of the icon.
     */
    const iconStyle = () => {
        return props.color
            ? {
                  color: props.color
              }
            : {};
    };

    return <span style={iconStyle()} className={'mondo-icon mondo-icon-' + props.icon}></span>;
};
export default Icon;
