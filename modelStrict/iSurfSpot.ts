import IGoodTime from '@/mondosurf-library/modelStrict/iGoodTime';
import ISurfSpotPreview from '@/mondosurf-library/modelStrict/iSurfSpotPreview';
import IVideoPreview from '@/mondosurf-library/modelStrict/iVideoPreview';

export interface ISurfSpot {
    id: number;
    name: string;
    slug: string;
    region: string;
    region_name: string;
    region_id: string;
    region_slug: string;
    country: string;
    country_name: string;
    country_id: string;
    country_slug: string;
    last_update: number;
    lat: number;
    lng: number;
    lat_parking?: number;
    lng_parking?: number;
    description?: string;
    timezone: string;
    calendar_url: string;
    direction?: string;
    bottom?: string;
    swell_direction?: string;
    wind_direction?: string;
    size?: number[];
    tide?: string[];
    tide_movement?: string[];
    quality?: string;
    experience?: string[];
    board?: string[];
    frequency?: string;
    wave_length?: string;
    wave_steepness?: string;
    videos?: IVideoPreview[];
    webcams?: ISurfSpotWebcam[];
    meteo_stations?: ISurfSpotMeteoStation[];
    crowd?: string;
    beginners?: boolean;
    not_beginners?: boolean;
    adaptive_surfing?: boolean;
    surf_schools?: boolean;
    airport?: string;
    near_spots?: ISurfSpotPreview[];
    forecast_is_good?: number;
    hide_secondary_swell?: boolean;
    spot_forecast?: ISurfSpotForecast;
    daily_forecast?: ISurfSpotDailyForecast;
    forecast_conditions_swell_best_direction?: number;
    forecast_conditions_swell_direction_min: number;
    forecast_conditions_swell_direction_max: number;
    forecast_conditions_swell_height_min: number;
    forecast_conditions_swell_height_max?: number;
    forecast_conditions_swell_period_min: number;
    forecast_conditions_wind_direction_min: number;
    forecast_conditions_wind_direction_max: number;
    forecast_conditions_wind_speed_max?: number;
    forecast_conditions_on_shore_wind_speed_max?: number;
}

export interface ISurfSpotWebcam {
    name: string;
    url: string;
    thumb?: string;
}

export interface ISurfSpotMeteoStation {
    name: string;
    url: string;
    thumb?: string;
}

export interface ISurfSpotForecast {
    tide_weekly: ISurfSpotForecastTideWeekly;
    good_times: IGoodTime[];
    days: ISurfSpotForecastDay[];
    min_max_weekly: ISurfSpotForecastMinMax;
    compressed_days: ISurfSpotCompressedDays;
    last_forecast_update: number;
}

export interface ISurfSpotForecastTideWeekly {
    max_min: number[];
    time: string[];
    height: number[];
    type: 'high' | 'low'[];
}

export interface ISurfSpotDayForecastBasics {
    hours: string[];
    is_good: number[];
    is_light: boolean[];
    swell_direction: number[];
    swell_period: number[];
    swell_height: number[];
    secondary_swell_direction: number[];
    secondary_swell_period: number[];
    secondary_swell_height: number[];
    wind_direction: number[];
    wind_speed: number[];
}

export interface ISurfSpotForecastDay extends ISurfSpotDayForecastBasics {
    time: string;
    civil_dawn: string;
    sunrise: string;
    sunset: string;
    civil_dusk: string;
    tide: ISurfSpotForecastDayTide;
    good: number;
    hourly_data: ISurfForecastRow[];
}

export interface ISurfSpotCompressedDays extends ISurfSpotDayForecastBasics {
    days: ICompressedData[];
}

export interface ICompressedData {
    time: string;
    civil_dawn: string;
    sunrise: string;
    sunset: string;
    civil_dusk: string;
    good: number;
    compressed_data: ISurfForecastRow[];
}

export interface ISurfForecastRow {
    time: string;
    is_good: number;
    is_light: boolean;
    swell_direction: number;
    swell_period: number;
    swell_height: number;
    secondary_swell_direction: number;
    secondary_swell_period: number;
    secondary_swell_height: number;
    wind_direction: number;
    wind_speed: number;
}


export interface ISurfSpotForecastDayTide {
    high_low: ISurfSpotForecastDayTideHighLow[];
    good_tide: string[][] | [-1];
}

export interface ISurfSpotForecastDayTideHighLow {
    type: 'high' | 'low';
    height: number;
    time: string;
}

export interface ISurfSpotForecastMinMax {
    swell_height_min: number;
    swell_height_max: number;
    swell_period_min: number;
    swell_period_max: number;
    secondary_swell_height_min: number;
    secondary_swell_height_max: number;
    secondary_swell_period_min: number;
    secondary_swell_period_max: number;
    wind_speed_min: number;
    wind_speed_max: number;
}

export interface ISurfSpotDailyForecast {
    text: string;
    author: string;
    date: string;
    region: string;
}