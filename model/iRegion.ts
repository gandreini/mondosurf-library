import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';

export default interface IRegion {
    id: number;
    name: string;
    flag?: string;
    slug: string;
    country_id: number;
    country_name: string;
    country_slug: string;
    number_of_spots: number;
    best_months?: number[];
    wetsuit?: number[];
    air_temperature?: number[];
    water_temperature?: number[];
    swell_direction?: number[];
    swell_height?: number[];
    wind_direction?: number[];
    wind_speed?: number[];
    spots_direction?: number[];
    spots_bottom?: number[];
    surf_spots?: ISurfSpotPreview[];
}