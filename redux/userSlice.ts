import { createSlice } from '@reduxjs/toolkit'
import ISurfSpotPreview from 'mondosurf-library/model/iSurfSpotPreview';

export interface IUserSliceValue {
    logged: 'yes' | 'no' | 'checking';
    userId: number;
    userName: string;
    userEmail: string;
    userPictureUrl: string | null;
    accessToken: string;
    capacitorRefreshToken: string;
    accountVerified: boolean;
    approvedTerms: boolean;
    registrationDate: number;
    favoriteSpots: ISurfSpotPreview[] | null; // Better to have null as default, to understand when the data is loaded (even if empty)
    timezoneId: string;
    timezoneUTC: number | null;
    timezoneDST: number | null;
    level: number;
    surfingFrom: number;
    surfboards: number[];
    accountType: 'free' | 'trial' | 'pro' | 'admin' | 'disabled';
    proService: 'none' | 'stripe' | 'apple';
    stripeUserId: string;
    productId: string;
    stripeSubscriptionId: string;
    subscriptionExpiration: number;
    subscriptionDuration: 'notset' | 'yearly' | 'monthly';
    trialActivation: number;
    trialDuration: number;
    preferences: {
        userBulletinFrequency: "daily" | "weekly" | "never";
        userBulletinWeekDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
        userPrefsHeight: "meters" | "feet";
        userPrefsSpeed: "kph" | "mph" | "kn";
        userPrefsTemperature: "c" | "f";
    },
    authorizedTracking: boolean;
}

const initialState: IUserSliceValue = {
    logged: 'checking',
    userId: -1,
    userName: '',
    userEmail: '',
    userPictureUrl: null,
    accessToken: '',
    capacitorRefreshToken: '',
    accountVerified: false,
    approvedTerms: true,
    registrationDate: -1,
    favoriteSpots: null,
    timezoneId: '',
    timezoneUTC: null,
    timezoneDST: null,
    level: -1,
    surfingFrom: -1,
    surfboards: [],
    accountType: 'free',
    proService: 'none',
    stripeUserId: '',
    productId: '',
    stripeSubscriptionId: '',
    subscriptionExpiration: -1,
    subscriptionDuration: 'notset',
    trialActivation: -1,
    trialDuration: 30,
    preferences: {
        userBulletinFrequency: "daily",
        userBulletinWeekDay: "monday",
        userPrefsHeight: "meters",
        userPrefsSpeed: "kph",
        userPrefsTemperature: "c"
    },
    authorizedTracking: true
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            return { ...state, logged: action.payload };
        },
        setUserId: (state, action) => {
            return { ...state, userId: action.payload };
        },
        setUserName: (state, action) => {
            return { ...state, userName: action.payload };
        },
        setUserEmail: (state, action) => {
            return { ...state, userEmail: action.payload };
        },
        setUserPictureUrl: (state, action) => {
            return { ...state, userPictureUrl: action.payload };
        },
        setAccessToken: (state, action) => {
            return { ...state, accessToken: action.payload };
        },
        setCapacitorRefreshToken: (state, action) => {
            return { ...state, capacitorRefreshToken: action.payload };
        },
        setAccountVerified: (state, action) => {
            if (action.payload === true) {
                return { ...state, accountVerified: true };
            } else {
                return { ...state, accountVerified: false };
            }

        },
        setApprovedTerms: (state, action) => {
            return { ...state, approvedTerms: action.payload };
        },
        setRegistrationDate: (state, action) => {
            return { ...state, registrationDate: action.payload };
        },
        setFavoriteSpots: (state, action) => {
            if (action.payload && action.payload != null && Array.isArray(action.payload) && action.payload.length > 0) {
                return { ...state, favoriteSpots: action.payload };
            } else {
                return { ...state, favoriteSpots: [] };
            }
        },
        setTimezoneId: (state, action) => {
            return { ...state, timezoneId: action.payload };
        },
        setTimezoneUTC: (state, action) => {
            return { ...state, timezoneUTC: action.payload };
        },
        setTimezoneDST: (state, action) => {
            return { ...state, timezoneDST: action.payload };
        },
        setLevel: (state, action) => {
            return { ...state, level: action.payload };
        },
        setSurfingFrom: (state, action) => {
            return { ...state, surfingFrom: action.payload };
        },
        setSurfboards: (state, action) => {
            if (action.payload && action.payload != null && Array.isArray(action.payload) && action.payload.length > 0) {
                return { ...state, surfboards: action.payload };
            } else {
                return { ...state, surfboards: [] };
            }
        },
        setAccountType: (state, action) => {
            return { ...state, accountType: action.payload };
        },
        setProService: (state, action) => {
            return { ...state, proService: action.payload };
        },
        setStripeUserId: (state, action) => {
            return { ...state, stripeUserId: action.payload };
        },
        setProductId: (state, action) => {
            return { ...state, productId: action.payload };
        },
        setStripeSubscriptionId: (state, action) => {
            return { ...state, stripeSubscriptionId: action.payload };
        },
        setSubscriptionExpiration: (state, action) => {
            return { ...state, subscriptionExpiration: action.payload };
        },
        setSubscriptionDuration: (state, action) => {
            return { ...state, subscriptionDuration: action.payload };
        },
        setTrialActivation: (state, action) => {
            return { ...state, trialActivation: action.payload };
        },
        setTrialDuration: (state, action) => {
            return { ...state, trialDuration: action.payload };
        },
        setPreferences: (state, action) => {
            // Merges new preferences with existing ones (does not replace the entire object)
            return { ...state, preferences: { ...state.preferences, ...action.payload } };
        },
        setAuthorizedTrackingFalse: (state) => {
            state.authorizedTracking = false;
        },
        logOut: (state) => {
            return {
                ...state,
                logged: 'no',
                userId: -1,
                userName: '',
                userEmail: '',
                accessToken: '',
                capacitorRefreshToken: '',
                accountVerified: false,
                approvedTerms: true,
                registrationDate: -1,
                favoriteSpots: null,
                timezoneId: '',
                timezoneUTC: null,
                timezoneDST: null,
                level: -1,
                surfingFrom: -1,
                surfboards: [],
                accountType: 'free',
                stripeUserId: '',
                productId: '',
                stripeSubscriptionId: '',
                subscriptionExpiration: -1,
                subscriptionDuration: 'notset',
                trialActivation: -1
                // authorizedTracking: true, // We don't reset the tracking status when user logs out, we keep not tracking
            }
        }
    }
})

export const { setLogin,
    setUserId,
    setUserName,
    setUserEmail,
    setUserPictureUrl,
    setAccessToken,
    setCapacitorRefreshToken,
    setAccountVerified,
    setApprovedTerms,
    setRegistrationDate,
    setFavoriteSpots,
    setTimezoneId,
    setTimezoneUTC,
    setTimezoneDST,
    setLevel,
    setSurfingFrom,
    setSurfboards,
    setAccountType,
    setProService,
    setStripeUserId,
    setProductId,
    setStripeSubscriptionId,
    setSubscriptionExpiration,
    setTrialActivation,
    setTrialDuration,
    setPreferences,
    setSubscriptionDuration,
    setAuthorizedTrackingFalse,
    logOut } = userSlice.actions;
export default userSlice.reducer;