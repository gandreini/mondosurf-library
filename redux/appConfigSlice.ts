import { createSlice } from '@reduxjs/toolkit'
import ICountry from 'mondosurf-library/model/iCountry';
import IRegionPreview from 'mondosurf-library/model/iRegionPreview';
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';

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
    trial_duration: number;
    tutorial_video_url_google_cal: string;
    tutorial_video_url_apple_cal: string;
    device_id: string;
}

const initialState: IAppConfig = {
    home_countries: [],
    footer_countries: [],
    footer_regions: [],
    footer_spots: [],
    banner_spots: [],
    status: 'init',
    platform: "web",
    geolocationAuthorized: false,
    latest_version: "",
    latest_version_progressive: 0,
    trial_duration: 30,
    tutorial_video_url_google_cal: "",
    tutorial_video_url_apple_cal: "",
    device_id: ""
};

export const appConfigSlice = createSlice({
    name: "appConfig",
    initialState,
    reducers: {
        updateAppConfig: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateAppPlatform: (state, action) => {
            return { ...state, platform: action.payload };
        },
        geolocationIsAuthorized: (state) => {
            return { ...state, geolocationAuthorized: true };
        },
        updateStatus: (state, action) => {
            return { ...state, status: action.payload.status };
        },
        updateDeviceId: (state, action) => {
            return { ...state, device_id: action.payload };
        },

    }
})

export const { updateAppConfig, updateStatus, updateAppPlatform, geolocationIsAuthorized, updateDeviceId } = appConfigSlice.actions;
export default appConfigSlice.reducer;