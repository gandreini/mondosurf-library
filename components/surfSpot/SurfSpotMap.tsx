import { FeatureCollection } from 'geojson';
import Map from 'mondosurf-library/components/Map';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotMap {
    lat: number;
    lng: number;
    latParking?: number;
    lngParking?: number;
    geojson: FeatureCollection;
}

const SurfSpotMap: React.FC<ISurfSpotMap> = (props) => {
    return (
        <div className="ms-surf-spot-map">
            {/* Map */}
            <div className="ms-surf-spot-map__map">
                <section className="ms-map-global">
                    <Map
                        geojson={props.geojson}
                        lat={props.lat}
                        lng={props.lng}
                        hideGeolocationButton={true}
                        noDragOnMobile={true}
                    />
                </section>
            </div>

            {/* Coordinates box */}
            <div
                className="ms-surf-spot-map__coordinates"
                itemProp="geo"
                itemType="http://schema.org/GeoCoordinates"
                itemScope
                data-test="surf-spot-coordinates">
                <div className="ms-surf-spot-map__coordinates-text">
                    {mondoTranslate('surf_spot.coordinates')}{' '}
                    <span className="ms-surf-spot-map__coordinates-lat" itemProp="latitude">
                        {props.lat.toFixed(6)}{' '}
                    </span>
                    <span className="ms-surf-spot-map__coordinates-lng" itemProp="longitude">
                        {props.lng.toFixed(6)}
                    </span>
                </div>
                <div className="ms-surf-spot-map__coordinates-actions">
                    <MondoLink
                        className="ms-btn"
                        href={`https://maps.google.com/?q=${props.latParking ? props.latParking : props.lat},${
                            props.lngParking ? props.lngParking : props.lng
                        }`}
                        title={mondoTranslate('surf_spot.open_in_google_maps')}
                        target="_blank"
                        rel="noreferrer">
                        <span className="ms-surf-spot-map__coordinates-google-icon"></span>
                        {mondoTranslate('surf_spot.google_maps')}
                    </MondoLink>
                    <MondoLink className="ms-btn" href={`/surf-spots-map?lat=${props.lat}&lng=${props.lng}`}>
                        {mondoTranslate('surf_spot.see_on_map')}
                    </MondoLink>
                </div>
            </div>
        </div>
    );
};
export default SurfSpotMap;
