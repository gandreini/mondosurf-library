import FavoriteAddButton from 'mondosurf-library/components/FavoriteAddButton';
import { returnTideDetails } from 'features/surfSpot/surfSpot.helpers';
import { returnBottomLabel } from 'mondosurf-library/helpers/labels.helpers';
import Icon from 'mondosurf-library/components/Icon';
import SurfSpotDirection from 'mondosurf-library/components/SurfSpotDirection';
import SurfSpotPreviewQualityIcon from 'mondosurf-library/components/SurfSpotPreviewQualityIcon';
import SurfSpotPreviewQualityRow from 'mondosurf-library/components/SurfSpotPreviewQualityRow';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

// Component.
const SurfSpotPreview: React.FC<ISurfSpotPreview> = (props: ISurfSpotPreview) => {
    /**
     * Returns the root class of the component.
     */
    const rootClassName = (): string => {
        let returnClassName = 'ms-surf-spot-preview';
        if (props.loading) returnClassName += ' is-loading ';
        return returnClassName;
    };

    const clickOnPreview = (e: React.MouseEvent) => {
        // Tracker.
        Tracker.trackEvent(['mp', 'ga'], TrackingEvent.SpotPreviewTap, {
            context: props.context,
            surfSpotId: props.id,
            surfSpotName: props.name
        });
    };

    return (
        <>
            {/* Loading */}
            {props.loading && (
                <div className={rootClassName()} key={props.id} data-test="surf-spot-preview">
                    <div className="ms-surf-spot-preview__link">
                        {/* Breadcrumbs */}
                        {props.showBreadcrumbs && (
                            <div className="ms-surf-spot-preview__breadcrumbs">
                                <div className="ms-surf-spot-preview__breadcrumbs-flag"></div>
                                <div className="ms-surf-spot-preview__breadcrumbs-country"></div>
                                <div className="ms-surf-spot-preview__breadcrumbs-region"></div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="ms-surf-spot-preview__header">
                            <div className="ms-surf-spot-preview__icon">
                                {props.direction && props.direction === 'A' && <Icon icon="wave-a-frame" />}
                                {props.direction && props.direction === 'R' && <Icon icon="wave-right" />}
                                {props.direction && props.direction === 'L' && <Icon icon="wave-left" />}
                                {!props.direction && <Icon icon="wave" />}
                            </div>
                            <h2 className="ms-surf-spot-preview__title"></h2>
                        </div>

                        {/* Content */}
                        <div className="ms-surf-spot-preview__content">
                            <div className="ms-surf-spot-preview__row ms-grid-2-2">
                                <div className="ms-surf-spot-preview__single-data"></div>
                                <div className="ms-surf-spot-preview__single-data"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loaded */}
            {!props.loading && (
                <div className={rootClassName()} key={props.id} data-test="surf-spot-preview">
                    <MondoLink
                        itemProp="url"
                        className="ms-surf-spot-preview__link"
                        href={
                            props.linkToGoodTimes
                                ? `/surf-spot/${props.slug}/forecast/${props.id}`
                                : `/surf-spot/${props.slug}/guide/${props.id}`
                        }
                        dataTest="surf-spot-preview-link"
                        onClickCallback={(e) => clickOnPreview(e)}>
                        {/* Breadcrumbs */}
                        {props.showBreadcrumbs && (
                            <div className="ms-surf-spot-preview__breadcrumbs">
                                <div className="ms-surf-spot-preview__breadcrumbs-flag">{props.flag}</div>
                                <div className="ms-surf-spot-preview__breadcrumbs-country">{props.country}</div>
                                <div className="ms-surf-spot-preview__breadcrumbs-region">{props.region}</div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="ms-surf-spot-preview__header">
                            <SurfSpotPreviewQualityIcon spotId={props.id} />
                            <div className="ms-surf-spot-preview__icon">
                                {props.direction && props.direction === 'A' && <Icon icon="wave-a-frame" />}
                                {props.direction && props.direction === 'R' && <Icon icon="wave-right" />}
                                {props.direction && props.direction === 'L' && <Icon icon="wave-left" />}
                                {!props.direction && <Icon icon="wave" />}
                            </div>
                            <h2 className="ms-surf-spot-preview__title" data-test="surf-spot-preview-title">
                                {props.name}
                            </h2>
                            {props.id && props.name && (
                                <FavoriteAddButton spotId={props.id} spotName={props.name} context={props.context} />
                            )}
                        </div>

                        {/* Content */}
                        {(props.showMetadata || props.showDirection) && (
                            <div className="ms-surf-spot-preview__content">
                                {props.showMetadata && (
                                    <div className="ms-surf-spot-preview__row ms-grid-2-2">
                                        {props.bottom && (
                                            <div className="ms-surf-spot-preview__single-data">
                                                <div className="ms-surf-spot-preview__label">
                                                    {mondoTranslate('basics.bottom')}
                                                </div>
                                                <div className="ms-surf-spot-preview__value">
                                                    {returnBottomLabel(props.bottom)}
                                                </div>
                                            </div>
                                        )}
                                        {props.tide && props.tide.length > 0 && (
                                            <div className="ms-surf-spot-preview__single-data">
                                                <div className="ms-surf-spot-preview__label">
                                                    {mondoTranslate('tide.tide')}
                                                </div>
                                                <div className="ms-surf-spot-preview__value">
                                                    {returnTideDetails(props.tide)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {props.showDirection && (
                                    <div className="ms-surf-spot-preview__row ms-grid-2-2">
                                        {props.swell_direction_min !== undefined &&
                                            props.swell_direction_max !== undefined && (
                                                <SurfSpotDirection
                                                    min={props.swell_direction_min}
                                                    max={props.swell_direction_max}
                                                    type={'swell'}
                                                    label={mondoTranslate('basics.swell')}
                                                    hideDegrees={true}
                                                />
                                            )}
                                        {props.wind_direction_min !== undefined &&
                                            props.wind_direction_max !== undefined && (
                                                <SurfSpotDirection
                                                    min={props.wind_direction_min}
                                                    max={props.wind_direction_max}
                                                    type={'wind'}
                                                    label={mondoTranslate('basics.wind')}
                                                    hideDegrees={true}
                                                />
                                            )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Forecast */}
                        {props.showForecast && <SurfSpotPreviewQualityRow spotId={props.id} />}
                    </MondoLink>
                </div>
            )}
        </>
    );
};
export default SurfSpotPreview;
