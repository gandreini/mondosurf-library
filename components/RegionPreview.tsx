import IRegionPreview from 'mondosurf-library/model/iRegionPreview';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

// Component.
const RegionPreview: React.FC<IRegionPreview> = (props: IRegionPreview) => {
    return (
        <MondoLink
            className={props.loading ? 'ms-region-preview is-loading' : 'ms-region-preview'}
            itemScope
            itemType="https://schema.org/Place"
            itemProp="url"
            href={`/surf-spots-in/${props.countrySlug}/${props.slug}/${props.id}`}
            data-test="region-preview">
            <div className="ms-region-preview__contents">
                <span className="ms-region-preview__title-wrapper" itemProp="name">
                    <span
                        itemProp="name"
                        className="ms-region-preview__title"
                        {...(!props.loading && {
                            'data-test': 'region-preview-title'
                        })}>
                        {props.name}
                    </span>
                </span>

                <span className="ms-region-preview__counters">
                    {props.number_of_spots > 0 && (
                        <>
                            <span className="ms-value">{props.number_of_spots}</span>
                            <span className="ms-label">{mondoTranslate('basics.surf_spots')}</span>
                        </>
                    )}
                </span>
            </div>
        </MondoLink>
    );
};
export default RegionPreview;
