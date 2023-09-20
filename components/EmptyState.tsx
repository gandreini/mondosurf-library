interface IEmptyState {
    emoji?: string;
    title?: string;
    text?: string;
}

const EmptyState: React.FC<IEmptyState> = (props) => {
    return (
        <div className="ms-empty-state">
            {props.emoji && <p className="ms-empty-state__emoji ms-emoji">{props.emoji}</p>}
            {props.title && <p className="ms-empty-state__title ms-emoji">{props.title}</p>}
            {props.text && <p className="ms-empty-state__text ms-body-text">{props.text}</p>}
        </div>
    );
};
export default EmptyState;
