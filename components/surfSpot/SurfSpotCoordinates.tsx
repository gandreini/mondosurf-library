import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

// Spot coordinates box with schema.org GeoCoordinates markup + Google-Maps /
// see-on-map links. Shared by the guide map (MapLibre) and SurfSpotMap (Leaflet)
// so the SEO-relevant markup lives in one place.
interface ISurfSpotCoordinates {
    lat: number;
    lng: number;
    latParking?: number;
    lngParking?: number;
}

const SurfSpotCoordinates: React.FC<ISurfSpotCoordinates> = ({ lat, lng, latParking, lngParking }) => (
    <div
        className="ms-surf-spot-map__coordinates"
        itemProp="geo"
        itemType="http://schema.org/GeoCoordinates"
        itemScope
        data-test="surf-spot-coordinates">
        <div className="ms-surf-spot-map__coordinates-text">
            {mondoTranslate('surf_spot.coordinates')}{' '}
            <span className="ms-surf-spot-map__coordinates-lat" itemProp="latitude">
                {lat.toFixed(6)}{' '}
            </span>
            <span className="ms-surf-spot-map__coordinates-lng" itemProp="longitude">
                {lng.toFixed(6)}
            </span>
        </div>
        <div className="ms-surf-spot-map__coordinates-actions">
            <MondoLink
                className="ms-btn"
                href={`https://maps.google.com/?q=${latParking ? latParking : lat},${
                    lngParking ? lngParking : lng
                }`}
                title={mondoTranslate('surf_spot.open_in_google_maps')}
                target="_blank"
                rel="noreferrer">
                <span className="ms-surf-spot-map__coordinates-google-icon"></span>
                {mondoTranslate('surf_spot.google_maps')}
            </MondoLink>
            <MondoLink className="ms-btn" href={`/surf-spots-map?lat=${lat}&lng=${lng}`}>
                {mondoTranslate('surf_spot.see_on_map')}
            </MondoLink>
        </div>
    </div>
);

export default SurfSpotCoordinates;
