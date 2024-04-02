import { useRouterProxy } from 'proxies/useRouter';

interface IBanner {
    text: string;
    subtext?: string;
    icon?: string;
    imageBg?: string;
    url?: string;
    dataTest?: string;
    style?: 'default' | 'cta';
    callback?: () => void;
}

const Banner: React.FC<IBanner> = (props) => {
    // React router.
    const router = useRouterProxy();

    // On click on the banner
    const onClickBanner = () => {
        if (props.url) router.push(props.url);
        if (props.callback) props.callback();
    };

    return (
        <div
            className={`ms-banner ${props.style === 'cta' ? 'ms-banner-cta' : ''}`}
            onClick={onClickBanner}
            {...(props.dataTest && { 'data-test': props.dataTest })}
            style={{
                backgroundImage: props.imageBg ? 'url(' + props.imageBg + ')' : ''
            }}>
            {props.icon && <div className="ms-banner__icon ms-emoji-small">{props.icon}</div>}
            <div className="ms-banner__texts">
                <p className="ms-h3-title ms-banner__text">{props.text}</p>
                {props.subtext && <p className="ms-banner__subtext ms-small-text">{props.subtext}</p>}
            </div>
        </div>
    );
};
export default Banner;
