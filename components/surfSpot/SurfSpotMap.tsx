'use client';

import { FeatureCollection } from 'geojson';
// The Map statically imports leaflet, which touches `window` at module load and
// throws during SSR. Each platform loads it via its own proxy: web wraps it in
// next/dynamic (ssr:false) so the rest of the guide's client segment still SSRs
// (the coordinates box below carries the schema.org geo); the app (no SSR)
// imports it directly. This keeps SurfSpotMap itself platform-agnostic.
import Map from 'proxies/LazyMap';
import SurfSpotCoordinates from 'mondosurf-library/components/surfSpot/SurfSpotCoordinates';

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

            {/* Coordinates box (extracted component: schema.org GeoCoordinates + links) */}
            <SurfSpotCoordinates
                lat={props.lat}
                lng={props.lng}
                latParking={props.latParking}
                lngParking={props.lngParking}
            />
        </div>
    );
};
export default SurfSpotMap;
