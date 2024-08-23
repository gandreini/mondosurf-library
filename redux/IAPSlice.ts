import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { createSlice } from '@reduxjs/toolkit'
import { MONTHLY_SUBSCRIPTION_TITLE, STRIPE_MONTHLY_SUBSCRIPTION_PRICE, STRIPE_YEARLY_SUBSCRIPTION_PRICE, YEARLY_SUBSCRIPTION_TITLE } from 'mondosurf-library/constants/constants';

export interface IIAP {
    // yearlyIAPSubscription: IAPProduct | undefined;
    // monthlyIAPSubscription: IAPProduct | undefined;
    proYearlyTitle: string;
    proYearlyPrice: string;
    proMonthlyTitle: string;
    proMonthlyPrice: string;
    IAPerror?: Error;
}

const initialState: IIAP = {
    proYearlyTitle: YEARLY_SUBSCRIPTION_TITLE,
    proYearlyPrice: STRIPE_YEARLY_SUBSCRIPTION_PRICE,
    proMonthlyTitle: MONTHLY_SUBSCRIPTION_TITLE,
    proMonthlyPrice: STRIPE_MONTHLY_SUBSCRIPTION_PRICE,
    // yearlyIAPSubscription: undefined,
    // monthlyIAPSubscription: undefined,
};

export const IAPSlice = createSlice({
    name: "IAP",
    initialState,
    reducers: {
        updateProYearlyTitle: (state, action) => {
            return {
                ...state,
                proYearlyTitle: action.payload
            }
        },
        updateProYearlyPrice: (state, action) => {
            return {
                ...state,
                proYearlyPrice: action.payload
            }
        },
        updateProMonthlyTitle: (state, action) => {
            return {
                ...state,
                proMonthlyTitle: action.payload
            }
        },
        updateProMonthlyPrice: (state, action) => {
            return {
                ...state,
                proMonthlyPrice: action.payload
            }
        },
        updateIAPYearlySubscription: (state, action) => {
            return {
                ...state,
                yearlyIAPSubscription: action.payload
            }
        },
        updateIAPMonthlySubscription: (state, action) => {
            return {
                ...state,
                monthlyIAPSubscription: action.payload
            }
        }
    }
})

export const { updateProYearlyTitle, updateProYearlyPrice, updateProMonthlyTitle, updateProMonthlyPrice, updateIAPYearlySubscription, updateIAPMonthlySubscription } = IAPSlice.actions;
export default IAPSlice.reducer;