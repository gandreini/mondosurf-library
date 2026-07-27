'use client';

import { FeatureCollection } from 'geojson';
// The Map statically imports leaflet, which touches `window` at module load and
// throws during SSR. Each platform loads it via its own proxy: web wraps it in
// next/dynamic (ssr:false) so the rest of the guide's client segment still SSRs
// (the coordinates box below carries the schema.org geo); the app (no SSR)
// imports it directly. This keeps SurfSpotMap itself platform-agnostic.
import Map from 'proxies/LazyMap';
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
