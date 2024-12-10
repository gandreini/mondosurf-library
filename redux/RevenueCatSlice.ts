import { createSlice } from '@reduxjs/toolkit'
import { MONTHLY_SUBSCRIPTION_TITLE, STRIPE_MONTHLY_SUBSCRIPTION_PRICE, STRIPE_YEARLY_SUBSCRIPTION_PRICE, YEARLY_SUBSCRIPTION_TITLE } from 'mondosurf-library/constants/constants';

export interface IRevenueCat {
    proYearlyTitle: string;
    proYearlyPrice: string;
    proMonthlyTitle: string;
    proMonthlyPrice: string;
    proYearlyRevenueCatPurchasesPackage: any; // PurchasesPackage | null;
    proMonthlyRevenueCatPurchasesPackage: any; // PurchasesPackage | null;
    IAPerror?: Error;
}

const initialState: IRevenueCat = {
    proYearlyTitle: YEARLY_SUBSCRIPTION_TITLE, // Used
    proYearlyPrice: STRIPE_YEARLY_SUBSCRIPTION_PRICE, // Used
    proMonthlyTitle: MONTHLY_SUBSCRIPTION_TITLE, // Used
    proMonthlyPrice: STRIPE_MONTHLY_SUBSCRIPTION_PRICE, // Used
    proYearlyRevenueCatPurchasesPackage: null, // Used for the purchase process
    proMonthlyRevenueCatPurchasesPackage: null // Used for the purchase process
};

export const RevenueCatSlice = createSlice({
    name: "RevenueCat",
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
        updateProYearlyRevenueCatPurchasePackage: (state, action) => {
            return {
                ...state,
                proYearlyRevenueCatPurchasesPackage: action.payload
            }
        },
        updateProMonthlyRevenueCatPurchasePackage: (state, action) => {
            return {
                ...state,
                proMonthlyRevenueCatPurchasesPackage: action.payload
            }
        }
    }
})

export const { updateProYearlyTitle, updateProYearlyPrice, updateProMonthlyTitle, updateProMonthlyPrice, updateProYearlyRevenueCatPurchasePackage, updateProMonthlyRevenueCatPurchasePackage } = RevenueCatSlice.actions;
export default RevenueCatSlice.reducer;