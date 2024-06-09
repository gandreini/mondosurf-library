import { CSSProperties } from 'react';

interface ISkeletonLoader {
    height?: string;
    width?: string;
    marginBottom?: string;
}

const SkeletonLoader: React.FC<ISkeletonLoader> = (props: ISkeletonLoader) => {
    let customStyle: CSSProperties = {};

    if (props.height) {
        customStyle.height = props.height;
    }
    if (props.width) {
        customStyle.width = props.width;
    }
    if (props.marginBottom) {
        customStyle.marginBottom = props.marginBottom;
    }

    return <div className="ms-skeleton-loader" style={customStyle}></div>;
};

export default SkeletonLoader;
