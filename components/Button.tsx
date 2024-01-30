import Icon from 'mondosurf-library/components/Icon';
import { IIcon } from 'mondosurf-library/modelStrict/iIcon';
import MondoLink from 'proxies/MondoLink';

interface IButton {
    url?: string;
    callback?: () => void;
    label: string;
    additionalClass?: string;
    style?: 'cta' | 'light' | 'normal';
    size?: 'xl' | 'l' | 'm' | 's';
    icon?: IIcon['icon'];
    fullWidth?: boolean;
}

const Button = (props: IButton) => {
    const returnClass = () => {
        let cl = 'ms-btn ';
        if (props.additionalClass) cl += props.additionalClass;
        if (props.size && props.size === 's') cl += ' ms-btn-s ';
        if (props.size && props.size === 'l') cl += ' ms-btn-l ';
        if (props.size && props.size === 'xl') cl += ' ms-btn-xl ';
        if (props.style && props.style === 'cta') cl += ' ms-btn-cta ';
        if (props.style && props.style === 'light') cl += ' ms-btn-light ';
        if (props.fullWidth) cl += ' ms-btn-full ';
        return cl;
    };

    return (
        <>
            {props.url && (
                <MondoLink className={returnClass()} href={props.url}>
                    {props.icon && <Icon icon={props.icon} />}
                    <span className="ms-btn__label">{props.label}</span>
                </MondoLink>
            )}
            {props.callback && (
                <button type="submit" className={returnClass()} onClick={props.callback}>
                    {props.icon && <Icon icon={props.icon} />}
                    <span className="ms-btn__label">{props.label}</span>
                </button>
            )}
        </>
    );
};
export default Button;
