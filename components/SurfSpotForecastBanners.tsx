import Banner from 'mondosurf-library/components/Banner';
import { ISurfSpot } from 'mondosurf-library/model/iSurfSpot';

interface ISurfSpotForecastBanners {
    spot: ISurfSpot;
}

const SurfSpotForecastBanners: React.FC<ISurfSpotForecastBanners> = (props: ISurfSpotForecastBanners) => {
    return (
        <>
            {props.spot && (
                <div className="ms-surf-spot-forecast__banners">
                    <section className="ms-grid-1-2">
                        <Banner
                            type={'calendar'}
                            spotName={props.spot.name}
                            spotId={props.spot.id}
                            spotCalendarUrl={props.spot.calendar_url}
                        />
                        <Banner
                            type={'widget'}
                            spotName={props.spot.name}
                            spotId={props.spot.id}
                            spotCalendarUrl={props.spot.calendar_url}
                        />
                    </section>
                </div>
            )}
        </>
    );
};
export default SurfSpotForecastBanners;
