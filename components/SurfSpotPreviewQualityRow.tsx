'use client';

import useGetFetch from 'mondosurf-library/api/useGetFetch';
import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
import Loader from 'mondosurf-library/components/Loader';
import { useEffect, useState } from 'react';

interface ISurfSpotPreviewQualityRow {
    spotId: number;
}

const SurfSpotPreviewQualityRow: React.FC<ISurfSpotPreviewQualityRow> = ({ spotId }) => {
    const fetchedQuality = useGetFetch(`surf-spot/forecast-is-good/${spotId}`);
    const [surfForecastEnabled, setSurfForecastEnabled] = useState<number | null>(null);
    const [surfQuality, setSurfQuality] = useState<number | null>(null);

    useEffect(() => {
        if (fetchedQuality.status === 'loaded') {
            setSurfForecastEnabled(fetchedQuality.payload.forecast_update);
            setSurfQuality(fetchedQuality.payload.forecast_is_good_long);
        }
    }, [fetchedQuality]);

    return (
        <>
            {/* Loading */}
            {fetchedQuality.status === 'loading' && (
                <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                    <Loader size="small" />
                </div>
            )}

            {/* Spot Quality */}
            {fetchedQuality.status === 'loaded' && surfForecastEnabled && surfQuality !== null && (
                <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                    <span className="ms-surf-spot-preview-quality-row__forecast-text ms-small-text">Next 7 days:</span>
                    <GoodTimeQuality quality={surfQuality} size="s" />
                </div>
            )}

            {/* No forecast for the spot */}
            {fetchedQuality.status === 'loaded' && !surfForecastEnabled && (
                <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                    <span className="ms-surf-spot-preview-quality-row__no-forecast-text ms-small-text">
                        No forecast for this spot
                    </span>
                </div>
            )}
        </>
    );
};
export default SurfSpotPreviewQualityRow;
