import { ISurfSpotWebcam } from 'mondosurf-library/model/iSurfSpot';
import MondoLink from 'proxies/MondoLink';

const SurfSpotWebcam: React.FC<ISurfSpotWebcam> = (props) => {
    // Inline style of the image element.
    const elementStyle = props.thumb
        ? {
              backgroundImage: `url(${props.thumb})`
          }
        : {
              backgroundImage: `url('/images/default-thumb-webcam.jpg')`
          };

    return (
        <>
            {props.url && (
                <MondoLink href={props.url} className="ms-surf-spot-webcam" target="_blank" rel="nofollow">
                    <div className="ms-surf-spot-webcam__thumb" style={elementStyle}></div>
                    <p className="ms-surf-spot-webcam__title">{props.name}</p>
                </MondoLink>
            )}
        </>
    );
};
export default SurfSpotWebcam;
