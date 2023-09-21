import Button from '@/components/Button';

interface IEmptyState {
    emoji?: string;
    title?: string;
    text?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    buttonStyle?: 'cta' | 'light' | 'normal';
    buttonSize?: 'xl' | 'l' | 'm' | 's';
    buttonCallback?: () => void;
}

const EmptyState: React.FC<IEmptyState> = (props) => {
    return (
        <div className="ms-empty-state">
            {props.emoji && <p className="ms-empty-state__emoji ms-emoji">{props.emoji}</p>}
            {props.title && <p className="ms-empty-state__title ms-emoji">{props.title}</p>}
            {props.text && <p className="ms-empty-state__text ms-body-text">{props.text}</p>}
            {props.buttonLabel && props.buttonCallback && (
                <Button
                    label={props.buttonLabel}
                    callback={props.buttonCallback}
                    size={props.buttonSize ? props.buttonSize : 'm'}
                    style={props.buttonStyle ? props.buttonStyle : 'normal'}
                />
            )}
            {props.buttonLabel && props.buttonUrl && (
                <Button
                    label={props.buttonLabel}
                    url={props.buttonUrl}
                    size={props.buttonSize ? props.buttonSize : 'm'}
                    style={props.buttonStyle ? props.buttonStyle : 'normal'}
                />
            )}
        </div>
    );
};
export default EmptyState;
