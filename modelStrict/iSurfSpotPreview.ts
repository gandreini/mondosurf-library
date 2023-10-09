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
    forecast_is_good?: number;
    showBreadcrumbs?: boolean;
    loading?: boolean;
    inFavourites?: boolean;
    context?: 'homeNearSpots' | 'subscriptionConfirmed' | 'region' | 'spotNearSpots' | 'search';
}