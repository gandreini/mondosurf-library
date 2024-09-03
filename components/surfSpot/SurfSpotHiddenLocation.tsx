import Icon from 'mondosurf-library/components/Icon';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ISurfSpotHiddenLocation {
    spotName: string;
}

const SurfSpotHiddenLocation: React.FC<ISurfSpotHiddenLocation> = (props) => {
    return (
        <div className="ms-surf-spot-hidden-location">
            <Icon icon="mondo-logo" />
            <p className="ms-small-text">{mondoTranslate('surf_spot.location_hidden', { spotName: props.spotName })}</p>
        </div>
    );
};
export default SurfSpotHiddenLocation;
