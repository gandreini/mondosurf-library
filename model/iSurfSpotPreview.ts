export default interface ISurfSpotPreview {
    id?: number;
    name?: string;
    slug?: string;
    direction?: string;
    bottom?: string;
    swell_direction_min?: number;
    swell_direction_max?: number;
    wind_direction_min?: number;
    wind_direction_max?: number;
    size?: number[];
    tide?: string[];
    forecast_is_good?: number;
    flag?: string;
    country?: string;
    region?: string;
    showBreadcrumbs?: boolean;
    loading?: boolean;
    inFavourites?: boolean;
    context?: 'homeNearSpots' | 'subscriptionConfirmed' | 'region' | 'spotNearSpots' | 'search';
}