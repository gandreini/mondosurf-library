import ICountry from "mondosurf-library/modelStrict/iCountry";
import IRegionPreview from "mondosurf-library/modelStrict/iRegionPreview";
import ISurfSpotPreview from "mondosurf-library/modelStrict/iSurfSpotPreview";

export interface IAppConfig {
    home_countries: ICountry[];
    footer_countries: ICountry[];
    footer_regions: IRegionPreview[];
    footer_spots: ISurfSpotPreview[];
    banner_spots: ISurfSpotPreview[];
    status: "init" | "loading" | "loaded" | "error";
    platform: "web" | "ios" | "android";
    geolocationAuthorized: boolean;
    latest_version: string;
    latest_version_progressive: number;
    automatic_trial: boolean;
    tutorial_video_url_google_cal: string;
    tutorial_video_url_apple_cal: string;
    mixpanel_tracking_token?: string;
    ga_measurement_id?: string;
}