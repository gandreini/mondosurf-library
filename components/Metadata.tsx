interface IMetadata {
    label?: string;
    value: string | React.ReactNode;
    inline?: boolean;
}

const Metadata: React.FC<IMetadata> = (props) => {
    const classes = () => {
        let className = 'ms-metadata';
        if (props.inline) {
            className += ' ms-metadata__inline ';
        }
        return className;
    };

    return (
        <div className={classes()}>
            {props.label && <p className="ms-metadata__label">{props.label}</p>}
            <p className="ms-metadata__value">{props.value}</p>
        </div>
    );
};

export default Metadata;
