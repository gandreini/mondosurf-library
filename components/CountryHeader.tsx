import ICountry from 'mondosurf-library/model/iCountry';
import Breadcrumbs from 'mondosurf-library/components/Breadcrumbs';
import BreadcrumbHome from 'mondosurf-library/components/BreadcrumbHome';
import Breadcrumb from 'mondosurf-library/components/Breadcrumb';
import { mondoTranslate } from 'proxies/mondoTranslate';
import BreadcrumbCurrent from 'mondosurf-library/components/BreadcrumbCurrent';
import PageTitle from 'mondosurf-library/components/PageTitle';
import Button from 'mondosurf-library/components/Button';
import Metadata from 'mondosurf-library/components/Metadata';

interface ICountryHeader {
    countryId: string;
    countrySlug: string;
    countryData: ICountry;
}

const CountryHeader: React.FC<ICountryHeader> = (props) => {
    return (
        <div className="ms-inner-header">
            {/* Breadcrumbs */}
            <div className="ms-side-spacing">
                <Breadcrumbs>
                    <BreadcrumbHome />
                    <Breadcrumb
                        label={mondoTranslate('basics.surf_spots')}
                        url="/surf-spots-guides-forecasts"
                        contentPosition="2"
                    />
                    <BreadcrumbCurrent
                        label={props.countryData.name}
                        contentPosition="3"
                        href={`/surf-regions-in/${props.countrySlug}/${props.countryId}`}
                    />
                </Breadcrumbs>
            </div>

            {/* Page title */}
            <div className="ms-inner-header__title-buttons">
                <PageTitle
                    title={props.countryData.name}
                    flag={props.countryData.flag}
                    backlink="/surf-spots-guides-forecasts"
                    backlinkTitle="Surf spots"
                />
                <Button
                    url={`/surf-spots-map?country=${props.countryId}`}
                    label={mondoTranslate('basics.see_on_map')}
                    size="s"
                    icon="tab-bar-map"
                    dataTest="search-button"
                />
            </div>

            {/* Metadata */}
            <div className="ms-inner-header__metadata">
                <Metadata
                    label={mondoTranslate('basics.regions')}
                    value={props.countryData.number_of_regions.toString()}
                    inline={true}
                />
                <Metadata
                    label={mondoTranslate('basics.surf_spots')}
                    value={props.countryData.number_of_spots.toString()}
                    inline={true}
                />
            </div>
        </div>
    );
};
export default CountryHeader;
