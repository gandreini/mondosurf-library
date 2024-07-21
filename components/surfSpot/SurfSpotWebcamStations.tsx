import { ISurfSpot, ISurfSpotMeteoStation, ISurfSpotWebcam } from 'mondosurf-library/model/iSurfSpot';
import { mondoTranslate } from 'proxies/mondoTranslate';
import SurfSpotWebcam from 'mondosurf-library/components/surfSpot/SurfSpotWebcam';
import SurfSpotMeteoStation from 'mondosurf-library/components/surfSpot/SurfSpotMeteoStation';

interface ISurfSpotWebcamStations {
    spot: ISurfSpot;
}

const SurfSpotWebcamStations: React.FC<ISurfSpotWebcamStations> = (props) => {
    return (
        <div className="ms-surf-spot-webcam-stations">
            {/* Webcams */}
            {!props.spot.hide_location && props.spot.webcams && props.spot.webcams.length > 0 && (
                <section className="ms-surf-spot-webcam-stations__section">
                    <h2 className="ms-h3-title">{mondoTranslate('surf_spot.webcams')}</h2>
                    <div className="ms-grid-2-4">
                        {props.spot.webcams.map((item: ISurfSpotWebcam, key: number) => (
                            <SurfSpotWebcam key={key} url={item.url} name={item.name} thumb={item.thumb} />
                        ))}
                    </div>
                </section>
            )}

            {/* Meteo Stations */}
            {!props.spot.hide_location && props.spot.meteo_stations && props.spot.meteo_stations.length > 0 && (
                <section className="ms-surf-spot-webcam-stations__section">
                    <h2 className="ms-h3-title">{mondoTranslate('surf_spot.meteo_stations')}</h2>
                    <div className="ms-grid-2-4">
                        {props.spot.meteo_stations.map((item: ISurfSpotMeteoStation, key: number) => (
                            <SurfSpotMeteoStation key={key} url={item.url} name={item.name} thumb={item.thumb} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
export default SurfSpotWebcamStations;
