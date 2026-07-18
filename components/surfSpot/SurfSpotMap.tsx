'use client';

import { FeatureCollection } from 'geojson';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';
import dynamic from 'next/dynamic';

// Map statically imports leaflet, which touches `window` at module load and
// throws during SSR. Importing it here statically made the guide's whole
// client segment (map + affiliate card + subscribe form) bail out of SSR —
// they only appeared after client hydration, invisible to crawlers/no-JS.
// Load it client-only, matching the other Map consumers (surf-spots-map,
// forecast-edit); the coordinates box below still SSRs (schema.org geo).
const Map = dynamic(() => import('mondosurf-library/components/Map'), { ssr: false });

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
