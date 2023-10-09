export default interface IGoodTime {
    hours?: string[];
    surf_spot_id?: number;
    surf_spot_name?: string;
    surf_spot_slug?: string;
    start_time: string;
    end_time: string;
    swell_direction: number;
    swell_direction_hours: number[];
    swell_height: number;
    swell_height_hours: number[];
    swell_period: number;
    swell_period_hours: number[];
    wind_direction: number;
    wind_direction_hours: number[];
    wind_speed: number;
    wind_speed_hours: number[];
    timezone: string;
    day_id: number;
    good_average?: number;
    good?: number[];
    good_highest_value?: number;
    hideName?: boolean;
    context?: 'homeFavorites' | 'homeNearSpots' | 'spotPage';
    defaultClickBehavior?: boolean;
    callback?: (spotId: number, spotSlug: string, dayId: number, timezone: string, startTime?: string) => void;
}