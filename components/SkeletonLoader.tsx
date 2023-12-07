interface ISkeletonLoader {
    height?: string;
    width?: string;
    marginBottom?: string;
}

const SkeletonLoader: React.FC<ISkeletonLoader> = (props: ISkeletonLoader) => {
    const style: React.CSSProperties = {};

    if (props.height) {
        style.height = props.height;
    }
    if (props.width) {
        style.width = props.width;
    }
    if (props.marginBottom) {
        style.marginBottom = props.marginBottom;
    }

    return <div className="ms-skeleton-loader" style={style}></div>;
};

export default SkeletonLoader;
