interface ILoader {
    size?: "small" | "medium" | "large";
    text?: string;
}

const Loader = (props: ILoader) => {
    /**
     * Returns the css classes of the loaded.
     */
    const rootClass = () => {
        let cssClass = "ms-loader";
        if (props.size && props.size === "small")
            cssClass += " ms-loader-small ";
        if (props.size && props.size === "medium")
            cssClass += " ms-loader-medium ";
        if (props.size && props.size === "large")
            cssClass += " ms-loader-large ";
        return cssClass;
    };

    return (
        <div className={rootClass()}>
            {props.text && <p className="ms-loader__text">{props.text}</p>}
            <div className="ms-loader__content"></div>
        </div>
    );
};
export default Loader;
