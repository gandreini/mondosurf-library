import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { IIcon } from 'mondosurf-library/model/iIcon';
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
    loading?: boolean;
    dataTest?: string;
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
        if (props.loading) cl += ' disabled ';
        return cl;
    };

    return (
        <>
            {props.url && (
                <MondoLink className={returnClass()} href={props.url} dataTest={props.dataTest || undefined}>
                    {props.icon && <Icon icon={props.icon} />}
                    {!props.loading && <span className="ms-btn__label">{props.label}</span>}
                    {props.loading && <Loader size="small" />}
                </MondoLink>
            )}
            {props.callback && (
                <button
                    type="submit"
                    className={returnClass()}
                    onClick={props.callback}
                    data-test={props.dataTest || undefined}>
                    {props.icon && <Icon icon={props.icon} />}
                    {!props.loading && <span className="ms-btn__label">{props.label}</span>}
                    {props.loading && <Loader size="small" />}
                </button>
            )}
        </>
    );
};
export default Button;
