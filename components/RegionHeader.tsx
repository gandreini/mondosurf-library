import Breadcrumbs from 'mondosurf-library/components/Breadcrumbs';
import BreadcrumbHome from 'mondosurf-library/components/BreadcrumbHome';
import Breadcrumb from 'mondosurf-library/components/Breadcrumb';
import { mondoTranslate } from 'proxies/mondoTranslate';
import BreadcrumbCurrent from 'mondosurf-library/components/BreadcrumbCurrent';
import PageTitle from 'mondosurf-library/components/PageTitle';
import Button from 'mondosurf-library/components/Button';
import Metadata from 'mondosurf-library/components/Metadata';
import IRegion from 'mondosurf-library/model/iRegion';

interface IRegionHeader {
    countrySlug: string;
    regionSlug: string;
    regionId: string;
    regionData: IRegion;
}

const RegionHeader: React.FC<IRegionHeader> = (props) => {
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
                    <Breadcrumb
                        label={props.regionData.country_name}
                        url={`/surf-regions-in/${props.regionData.country_slug}/${props.regionData.country_id}`}
                        contentPosition="3"
                    />
                    <BreadcrumbCurrent
                        label={props.regionData.name}
                        contentPosition="4"
                        href={`/surf-spots-in/${props.countrySlug}/${props.regionSlug}/${props.regionId}`}
                    />
                </Breadcrumbs>
            </div>

            {/* Page title */}
            <div className="ms-inner-header__title-buttons">
                <PageTitle
                    title={props.regionData.name}
                    flag={props.regionData.flag}
                    backlink={`/surf-regions-in/${props.regionData.country_slug}/${props.regionData.country_id}`}
                    backlinkTitle="Surf region"
                />
                <Button
                    url={`/surf-spots-map?region=${props.regionId}`}
                    label={mondoTranslate('basics.see_on_map')}
                    size="s"
                    icon="tab-bar-map"
                    dataTest="search-button"
                />
            </div>

            {/* Metadata */}
            <div className="ms-inner-header__metadata">
                <Metadata
                    label={mondoTranslate('basics.surf_spots')}
                    value={props.regionData.number_of_spots.toString()}
                    inline={true}
                />
            </div>
        </div>
    );
};
export default RegionHeader;
