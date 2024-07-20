import { ISurfSpot } from 'mondosurf-library/model/iSurfSpot';
import Banner from 'mondosurf-library/components/Banner';

interface ISurfSpotForecastBanners {
    spot: ISurfSpot;
}

const SurfSpotForecastBanners: React.FC<ISurfSpotForecastBanners> = async (props: ISurfSpotForecastBanners) => {
    return (
        <>
            {props.spot && (
                <div className="ms-surf-spot-forecast__banners">
                    <section className="ms-surf-spot-forecast__banners-row">
                        <Banner
                            type={'favorite'}
                            spotName={props.spot.name}
                            spotId={props.spot.id}
                            spotCalendarUrl={props.spot.calendar_url}
                        />
                        <Banner
                            type={'calendar'}
                            spotName={props.spot.name}
                            spotId={props.spot.id}
                            spotCalendarUrl={props.spot.calendar_url}
                        />
                    </section>
                    <section className="ms-surf-spot-forecast__banners-row">
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
