import IRegionPreview from 'mondosurf-library/model/iRegionPreview';
import MondoLink from 'proxies/MondoLink';
import { FRONTEND_URL } from 'proxies/localConstants';
import { mondoTranslate } from 'proxies/mondoTranslate';

const RegionPreview: React.FC<IRegionPreview> = (props: IRegionPreview) => {
    return (
        <MondoLink
            className={props.loading ? 'ms-region-preview is-loading' : 'ms-region-preview'}
            itemScope
            itemType="https://schema.org/DefinedRegion"
            href={`/surf-spots-in/${props.countrySlug}/${props.slug}/${props.id}`}
            dataTest="region-preview">
            <meta
                itemProp="url"
                content={`${FRONTEND_URL}surf-spots-in/${props.countrySlug}/${props.slug}/${props.id}`}
            />
            <div className="ms-region-preview__contents">
                <span className="ms-region-preview__title-wrapper">
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
                    <span className="ms-region-preview__counter">
                        {props.number_of_spots > 0 && (
                            <>
                                <span className="ms-value">{props.number_of_spots}</span>
                                <span className="ms-label">{mondoTranslate('basics.surf_spots')}</span>
                            </>
                        )}
                        {props.loading && (
                            <>
                                <span className="ms-value"></span>
                                <span className="ms-label"></span>
                            </>
                        )}
                    </span>
                </span>
            </div>
        </MondoLink>
    );
};
export default RegionPreview;
