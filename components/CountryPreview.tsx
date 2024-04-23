import ICountry from 'mondosurf-library/model/iCountry';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

const CountryPreview: React.FC<ICountry> = (props: ICountry) => {
    return (
        <MondoLink
            className={props.loading ? 'ms-country-preview is-loading' : 'ms-country-preview'}
            itemScope
            itemType="https://schema.org/Place"
            itemProp="url"
            href={`/surf-regions-in/${props.slug}/${props.id}`}
            dataTest="country-preview">
            <div className="ms-country-preview__contents">
                <span className="ms-country-preview__title-flag" itemProp="name">
                    <span className="ms-country-preview__flag">{props.flag}</span>
                    <span
                        itemProp="name"
                        className="ms-country-preview__title"
                        {...(!props.loading && {
                            'data-test': 'country-preview-title'
                        })}>
                        {props.name}
                    </span>
                </span>

                <span className="ms-country-preview__counters">
                    {(() => {
                        if (props.number_of_regions && props.number_of_regions > 0) {
                            return (
                                <span className="ms-country-preview__counter">
                                    <span className="ms-value">{props.number_of_regions}</span>{' '}
                                    <span className="ms-label">{mondoTranslate('basics.regions')}</span>
                                </span>
                            );
                        }
                    })()}

                    {(() => {
                        if (props.number_of_spots && props.number_of_spots > 0) {
                            return (
                                <span className="ms-country-preview__counter">
                                    <span className="ms-value">{props.number_of_spots}</span>{' '}
                                    <span className="ms-label">{mondoTranslate('basics.surf_spots')}</span>
                                </span>
                            );
                        }
                    })()}
                </span>
            </div>
        </MondoLink>
    );
};
export default CountryPreview;
