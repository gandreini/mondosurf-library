export default interface ISurfSpotPreview {
    id: number;
    name: string;
    slug: string;
    country: string;
    countrySlug: string;
    region: string;
    regionSlug: string;
    flag?: string;
    direction?: string;
    bottom?: string;
    swell_direction_min?: number;
    swell_direction_max?: number;
    wind_direction_min?: number;
    wind_direction_max?: number;
    size?: number[];
    tide?: string[];
    forecast_is_good?: number; // Deprecated
    forecast_is_good_long?: number;
    forecast_is_good_short?: number;
    showBreadcrumbs?: boolean;
    showMetadata?: boolean;
    showDirection?: boolean;
    showForecast?: boolean;
    loading?: boolean;
    inFavourites?: boolean;
    linkToGoodTimes?: boolean;
    forecast_update?: boolean;
    context?: 'homeNearSpots' | 'subscriptionConfirmed' | 'region' | 'spotNearSpots' | 'search';
    isAddMissingSpot?: boolean;
}