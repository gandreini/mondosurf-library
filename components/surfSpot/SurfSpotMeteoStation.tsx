import { ISurfSpotMeteoStation } from 'mondosurf-library/model/iSurfSpot';
import MondoImage from 'proxies/MondoImage';
import MondoLink from 'proxies/MondoLink';

const SurfSpotMeteoStation: React.FC<ISurfSpotMeteoStation> = (props) => {
    return (
        <>
            {props.url && (
                <MondoLink href={props.url} className="ms-surf-spot-meteo-station" target="_blank" rel="nofollow">
                    <div className="ms-surf-spot-meteo-station__thumb">
                        <MondoImage
                            src={props.thumb_large || props.thumb || '/images/default-thumb-meteo-station.jpg'}
                            lowResSrc={props.thumb || undefined}
                            alt={props.name}
                            className="ms-surf-spot-meteo-station__thumb-img"
                            sizes="(min-width: 1024px) 25vw, 50vw"
                        />
                    </div>
                    <p className="ms-surf-spot-meteo-station__title">{props.name}</p>
                </MondoLink>
            )}
        </>
    );
};
export default SurfSpotMeteoStation;
