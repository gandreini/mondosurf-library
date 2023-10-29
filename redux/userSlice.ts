import { createSlice } from '@reduxjs/toolkit'
import ISurfSpotPreview from '../modelStrict/iSurfSpotPreview';

export interface IUserSliceValue {
    logged: 'yes' | 'no' | 'checking';
    userId: number;
    userName: string;
    userEmail: string;
    accessToken: string;
    capacitorRefreshToken: string;
    accountVerified: boolean;
    approvedTerms: boolean;
    authorizedTracking: boolean;
    registrationDate: number;
    favoriteSpotsIds: number[] | null; // Better to have null as default, to understand when the data is loaded (even if empty)
    favoriteSpots: ISurfSpotPreview[] | null; // Better to have null as default, to understand when the data is loaded (even if empty)
    timezoneId: string;
    timezoneUTC: number | null;
    timezoneDST: number | null;
    level: number;
    surfingFrom: number;
    surfboards: number[];
    accountType: 'free' | 'trial' | 'pro' | 'admin' | 'disabled';
    stripeUserId: string;
    productId: string;
    stripeSubscriptionId: string;
    subscriptionExpiration: number;
    subscriptionDuration: 'notset' | 'yearly' | 'monthly';
    trialActivation: number;
    trialBurned: boolean;
}

const initialState: IUserSliceValue = {
    logged: 'checking',
    userId: -1,
    userName: '',
    userEmail: '',
    accessToken: '',
    capacitorRefreshToken: '',
    accountVerified: false,
    approvedTerms: true,
    authorizedTracking: true,
    registrationDate: -1,
    favoriteSpotsIds: null,
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
    trialActivation: -1,
    trialBurned: false
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
        setAuthorizedTracking: (state, action) => {
            return { ...state, authorizedTracking: action.payload };
        },
        setRegistrationDate: (state, action) => {
            return { ...state, registrationDate: action.payload };
        },
        setFavoriteSpotsIds: (state, action) => {
            if (action.payload && action.payload != null && Array.isArray(action.payload) && action.payload.length > 0) {
                return { ...state, favoriteSpotsIds: action.payload };
            } else {
                return { ...state, favoriteSpotsIds: [] };
            }
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
        setTrialBurned: (state, action) => {
            return { ...state, trialBurned: action.payload };
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
                authorizedTracking: true,
                registrationDate: -1,
                favoriteSpotsIds: null,
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
                trialActivation: -1,
                trialBurned: false
            }
        }
    }
})

export const { setLogin,
    setUserId,
    setUserName,
    setUserEmail,
    setAccessToken,
    setCapacitorRefreshToken,
    setAccountVerified,
    setApprovedTerms,
    setAuthorizedTracking,
    setRegistrationDate,
    setFavoriteSpotsIds,
    setFavoriteSpots,
    setTimezoneId,
    setTimezoneUTC,
    setTimezoneDST,
    setLevel,
    setSurfingFrom,
    setSurfboards,
    setAccountType,
    setStripeUserId,
    setProductId,
    setStripeSubscriptionId,
    setSubscriptionExpiration,
    setTrialBurned,
    setTrialActivation,
    setSubscriptionDuration,
    logOut } = userSlice.actions;
export default userSlice.reducer;