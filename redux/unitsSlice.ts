import { createSlice } from '@reduxjs/toolkit'

export interface IUnitsSliceValue {
    lengthUnit: 'mt' | 'ft';
    speedUnit: 'kph' | 'kn';
    temperatureUnit: 'c' | 'f';
}

const initialState: IUnitsSliceValue = {
    lengthUnit: 'mt',
    speedUnit: 'kph',
    temperatureUnit: 'c'
};

export const unitsSlice = createSlice({
    name: "units",
    initialState,
    reducers: {
        toggleLengthUnit: (state, action) => {
            return action.payload;
        }
    }
})

export const { toggleLengthUnit } = unitsSlice.actions;
export default unitsSlice.reducer;