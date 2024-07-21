import { ISurfSpot } from 'mondosurf-library/model/iSurfSpot';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotVariousLinks {
    spot: ISurfSpot;
}

const SurfSpotVariousLinks: React.FC<ISurfSpotVariousLinks> = (props) => {
    return (
        <div className="ms-surf-spot-various-links">
            <ul className="ms-grid-1-3">
                <li>
                    <MondoLink
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.windy.com/${props.spot.lat}/${props.spot.lng}/waves?waves,${props.spot.lat},${props.spot.lng},10`}>
                        {mondoTranslate('surf_spot.map_on_windy')}
                    </MondoLink>
                </li>
            </ul>
        </div>
    );
};
export default SurfSpotVariousLinks;
