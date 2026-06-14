import { FeatureCollection } from 'geojson';
import Map from 'mondosurf-library/components/Map';
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
