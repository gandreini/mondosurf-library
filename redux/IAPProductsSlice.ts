import { IAPProduct } from '@ionic-native/in-app-purchase-2';
import { createSlice } from '@reduxjs/toolkit'

export interface IIAPProducts {
    yearlyIAPSubscription: IAPProduct | undefined;
    monthlyIAPSubscription: IAPProduct | undefined;
    IAPerror?: Error;
}

const initialState: IIAPProducts = {
    yearlyIAPSubscription: undefined,
    monthlyIAPSubscription: undefined,
};

export const IAPProductsSlice = createSlice({
    name: "IAPProducts",
    initialState,
    reducers: {
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

export const { updateIAPYearlySubscription, updateIAPMonthlySubscription } = IAPProductsSlice.actions;
export default IAPProductsSlice.reducer;