import Button from 'mondosurf-library/components/Button';

interface IInvasiveBanner {
    text: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
    buttonFunction?: () => void;
    buttonLabel?: string;
}

const InvasiveBanner: React.FC<IInvasiveBanner> = (props) => {
    return (
        <div className={`ms-invasive-banner ms-invasive-banner__type-${props.type}`}>
            <p className="ms-body-text ms-invasive-banner__text">{props.text}</p>
            {props.buttonFunction && props.buttonLabel && (
                <>
                    <Button
                        additionalClass="ms-invasive-banner__button"
                        callback={props.buttonFunction}
                        label={props.buttonLabel}
                        size="m"
                        style="cta"
                    />
                </>
            )}
        </div>
    );
};
export default InvasiveBanner;
