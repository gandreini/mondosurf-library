'use client';

import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
import Loader from 'mondosurf-library/components/Loader';
import useGetFetch from 'mondosurf-library/fetching/useGetFetch';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { useEffect, useState } from 'react';

interface ISurfSpotPreviewQualityRow {
    spotId: number;
}

const SurfSpotPreviewQualityRow: React.FC<ISurfSpotPreviewQualityRow> = (props: ISurfSpotPreviewQualityRow) => {
    // Retrieves quality from the APIs.
    const [qualityQuery, setQualityQuery] = useState('');
    const fetchedQuality = useGetFetch(qualityQuery);
    const [surfForecastEnabled, setSurfForecastEnabled] = useState<number | null>(null);
    const [surfQualityShort, setSurfQualityShort] = useState<number | null>(null);
    const [surfQualityLong, setSurfQualityLong] = useState<number | null>(null);

    useEffect(() => {
        setQualityQuery('surf-spot/forecast-is-good/' + props.spotId);
    }, []);

    useEffect(() => {
        if (fetchedQuality.status === 'loaded') {
            setSurfForecastEnabled(fetchedQuality.payload.forecast_update);
            setSurfQualityLong(fetchedQuality.payload.forecast_is_good_long);
            setSurfQualityShort(fetchedQuality.payload.forecast_is_good_short);
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

            {/* Pro */}
            {fetchedQuality.status === 'loaded' &&
                surfForecastEnabled &&
                hasProPermissions() &&
                surfQualityLong !== null && (
                    <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                        <span className="ms-surf-spot-preview-quality-row__forecast-text ms-small-text">
                            Next 7 days:
                        </span>
                        <GoodTimeQuality quality={surfQualityLong} size="s" />
                    </div>
                )}

            {/* Not pro */}
            {fetchedQuality.status === 'loaded' &&
                surfForecastEnabled &&
                !hasProPermissions() &&
                surfQualityShort !== null && (
                    <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                        <span className="ms-small-text">Next 3 days:</span>
                        <GoodTimeQuality quality={surfQualityShort} size="s" />
                    </div>
                )}

            {/* No forecats for the spot */}
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
