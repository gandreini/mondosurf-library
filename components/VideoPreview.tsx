// Server

import IVideoPreview from 'mondosurf-library/model/iVideoPreview';
import MondoLink from 'proxies/MondoLink';

// Component.
const VideoPreview: React.FC<IVideoPreview> = async (props: IVideoPreview) => {
    return (
        <>
            {props.url && !props.loading && (
                <MondoLink href={props.url} target="_blank" className="ms-video-preview" rel="noreferrer">
                    {props.thumb && (
                        <div
                            className="ms-video-preview__thumb"
                            style={{
                                backgroundImage: 'url(' + props.thumb + ')'
                            }}></div>
                    )}
                    {!props.thumb && <div className="ms-video-preview__thumb is-default"></div>}
                    <h3 className="ms-video-preview__title">{props.title}</h3>
                </MondoLink>
            )}

            {/* Loading */}
            {props.loading && (
                <div className="ms-video-preview is-loading">
                    <div className="ms-video-preview__thumb"></div>
                    <h3 className="ms-video-preview__title"></h3>
                </div>
            )}
        </>
    );
};
export default VideoPreview;
