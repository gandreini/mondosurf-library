'use client';

import GoodTimeQuality from 'mondosurf-library/components/GoodTimeQuality';
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
        <>
            {fetchedQuality.status === 'loaded' &&
                hasProPermissions() &&
                surfQualityLong !== null &&
                surfQualityLong !== -1 && (
                    <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                        <span className="ms-small-text">Forecast next 7 days:</span>{' '}
                        <GoodTimeQuality quality={surfQualityLong} size="s" />
                    </div>
                )}
            {fetchedQuality.status === 'loaded' &&
                !hasProPermissions() &&
                surfQualityShort !== null &&
                surfQualityShort !== -1 && (
                    <div className="ms-surf-spot-preview__row ms-surf-spot-preview-quality-row">
                        <span className="ms-small-text">Forecast next 3 days:</span>{' '}
                        <GoodTimeQuality quality={surfQualityShort} size="s" />
                    </div>
                )}
        </>
    );
};
export default SurfSpotPreviewQualityRow;
