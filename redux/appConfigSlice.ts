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
    automatic_trial: boolean;
    tutorial_video_url_google_cal: string;
    tutorial_video_url_apple_cal: string;
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
    automatic_trial: false,
    tutorial_video_url_google_cal: "",
    tutorial_video_url_apple_cal: ""
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
        }
    }
})

export const { updateAppConfig, updateStatus, updateAppPlatform, geolocationIsAuthorized } = appConfigSlice.actions;
export default appConfigSlice.reducer;