import { ISurfSpotMeteoStation } from 'mondosurf-library/model/iSurfSpot';
import MondoLink from 'proxies/MondoLink';

const SurfSpotMeteoStation: React.FC<ISurfSpotMeteoStation> = (props) => {
    // Inline style of the image element.
    const elementStyle = props.thumb
        ? {
              backgroundImage: `url(${props.thumb})`
          }
        : {
              backgroundImage: `url('/images/default-thumb-meteo-station.jpg')`
          };

    return (
        <>
            {props.url && (
                <MondoLink href={props.url} className="ms-surf-spot-meteo-station" target="_blank" rel="nofollow">
                    <div className="ms-surf-spot-meteo-station__thumb" style={elementStyle}></div>
                    <p className="ms-surf-spot-meteo-station__title">{props.name}</p>
                </MondoLink>
            )}
        </>
    );
};
export default SurfSpotMeteoStation;
