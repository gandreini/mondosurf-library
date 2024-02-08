import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
import useFetch from 'mondosurf-library/fetching/useFetch';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { useEffect, useState } from 'react';

interface ISurfSpotPreviewQualityIcon {
    spotId: number;
}

const SurfSpotPreviewQualityIcon: React.FC<ISurfSpotPreviewQualityIcon> = (props: ISurfSpotPreviewQualityIcon) => {
    // Retrieves quality from the APIs.
    const [qualityQuery, setQualityQuery] = useState('');
    const fetchedQuality = useFetch(qualityQuery);
    const [surfQualityShort, setSurfQualityShort] = useState<number | null>(null);
    const [surfQualityLong, setSurfQualityLong] = useState<number | null>(null);

    useEffect(() => {
        setQualityQuery('surf-spot/forecast-is-good/' + props.spotId);
    }, []);

    useEffect(() => {
        if (fetchedQuality.status === 'loaded') {
            setSurfQualityLong(fetchedQuality.payload.forecast_is_good_long);
            setSurfQualityShort(fetchedQuality.payload.forecast_is_good_short);
        }
    }, [fetchedQuality]);

    return (
        <div className="ms-surf-spot-preview-quality-icon">
            {hasProPermissions() && surfQualityLong !== null && surfQualityLong !== -1 && (
                <GoodTimeQuality quality={surfQualityLong} size="s" singleStar={true} hideLabel={true} />
            )}
            {!hasProPermissions() && surfQualityShort !== null && surfQualityShort !== -1 && (
                <GoodTimeQuality quality={surfQualityShort} size="s" singleStar={true} hideLabel={true} />
            )}
        </div>
    );
};
export default SurfSpotPreviewQualityIcon;
