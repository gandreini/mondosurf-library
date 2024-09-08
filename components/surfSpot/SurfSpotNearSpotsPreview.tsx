import List from 'components/List';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';
import { mondoTranslate } from 'proxies/mondoTranslate';
import SurfSpotPreview from 'mondosurf-library/components/SurfSpotPreview';
import Button from 'mondosurf-library/components/Button';

interface ISurfSpotNearSpotsPreview {
    spotName: string;
    spotSlug: string;
    spotId: number;
    numberOfNearSpots: number;
    nearSpots: ISurfSpotPreview[];
}

const SurfSpotNearSpotsPreview: React.FC<ISurfSpotNearSpotsPreview> = (props) => {
    return (
        <section className="ms-surf-spot-near-spots-preview">
            <h2 className="ms-surf-spot-near-spots-preview__title ms-h2-title">
                {mondoTranslate('basics.near_spots')}
            </h2>
            <div className="ms-surf-spot-near-spots-preview__content">
                <div className="ms-surf-spot-near-spots-preview__left">
                    <section className="ms-surf-spot-near-spots-preview__list ms-grid-1-1">
                        <List
                            items={props.nearSpots}
                            renderItem={(item) => (
                                <SurfSpotPreview
                                    key={item.id}
                                    {...item}
                                    countrySlug={item.countrySlug}
                                    regionSlug={item.regionSlug}
                                    context="spotNearSpots"
                                    showDirection={false}
                                    showMetadata={true}
                                />
                            )}
                        />
                    </section>
                </div>
                <div className="ms-surf-spot-near-spots-preview__right">
                    <p className="ms-body-text">
                        {mondoTranslate('surf_spot.near_spots_preview_text', {
                            numberOfNearSpots: props.numberOfNearSpots.toString(),
                            spotName: props.spotName
                        })}
                    </p>
                    <Button
                        label={mondoTranslate('surf_spot.near_spots_preview_button', {
                            numberOfNearSpots: props.numberOfNearSpots.toString()
                        })}
                        url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}surf-spot/${props.spotSlug}/nearby/${props.spotId}`}
                    />
                </div>
            </div>
        </section>
    );
};
export default SurfSpotNearSpotsPreview;
