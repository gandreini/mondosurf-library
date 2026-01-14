'use client';

import useGetFetch from 'mondosurf-library/api/useGetFetch';
import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
import { useEffect, useState } from 'react';

interface ISurfSpotPreviewQualityIcon {
    spotId: number;
}

const SurfSpotPreviewQualityIcon: React.FC<ISurfSpotPreviewQualityIcon> = ({ spotId }) => {
    const fetchedQuality = useGetFetch(`surf-spot/forecast-is-good/${spotId}`);
    const [surfQuality, setSurfQuality] = useState<number | null>(null);

    useEffect(() => {
        if (fetchedQuality.status === 'loaded') {
            setSurfQuality(fetchedQuality.payload.forecast_is_good_long);
        }
    }, [fetchedQuality]);

    return (
        <div className="ms-surf-spot-preview-quality-icon">
            {surfQuality !== null && surfQuality !== -1 && (
                <GoodTimeQuality quality={surfQuality} size="s" singleStar={true} hideLabel={true} />
            )}
        </div>
    );
};
export default SurfSpotPreviewQualityIcon;
