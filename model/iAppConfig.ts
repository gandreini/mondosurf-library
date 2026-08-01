import ICountry from "mondosurf-library/model/iCountry";
import IRegionPreview from "mondosurf-library/model/iRegionPreview";
import ISurfSpotPreview from "mondosurf-library/model/iSurfSpotPreview";

export interface IAppConfig {
    home_spots: ISurfSpotPreview[];
    home_countries: ICountry[];
    home_regions: IRegionPreview[];
    footer_countries: ICountry[];
    footer_regions: IRegionPreview[];
    footer_spots: ISurfSpotPreview[];
    status: "init" | "loading" | "loaded" | "error";
    platform: "web" | "ios" | "android";
    geolocationAuthorized: boolean;
    latest_version: string;
    latest_version_progressive: number;
    tutorial_video_url_google_cal: string;
    tutorial_video_url_apple_cal: string;
    mixpanel_tracking_token?: string;
    ga_measurement_id?: string;
}