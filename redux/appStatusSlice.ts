import { createSlice } from '@reduxjs/toolkit'

export interface IAppStatus {
    online: boolean;
}

const initialState: IAppStatus = {
    online: true
};

export const appStatusSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {
        appIsOnline: (state) => {
            return { ...state, online: true };
        },
        appIsOffline: (state) => {
            return { ...state, online: false };
        },
    }
})

export const { appIsOnline, appIsOffline } = appStatusSlice.actions;
export default appStatusSlice.reducer;