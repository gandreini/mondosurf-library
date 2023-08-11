import { createSlice } from '@reduxjs/toolkit'

export interface IMapFiltersValue {
    direction: IMapFiltersDirection;
    bottom: IMapFiltersBottom;
    experience: IMapFiltersExperience;
    surfboard: IMapFiltersSurfboard;
    months: IMapFiltersMonth;
}

export interface IMapFiltersDirection {
    A: boolean;
    R: boolean;
    L: boolean;
}

export interface IMapFiltersBottom {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
    7: boolean;
    8: boolean;
}

export interface IMapFiltersExperience {
    1: boolean;
    2: boolean;
    3: boolean;
}

export interface IMapFiltersSurfboard {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
}

export interface IMapFiltersMonth {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
    5: boolean;
    6: boolean;
    7: boolean;
    8: boolean;
    9: boolean;
    10: boolean;
    11: boolean;
    12: boolean;
}

export const initialState: IMapFiltersValue = {
    'direction': {
        'A': true,
        'R': true,
        'L': true
    },
    'bottom': {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true,
        '7': true,
        '8': true
    },
    'experience': {
        '1': true,
        '2': true,
        '3': true
    },
    'surfboard': {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true
    },
    'months': {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true,
        '7': true,
        '8': true,
        '9': true,
        '10': true,
        '11': true,
        '12': true
    }
};

export const mapFiltersSlice = createSlice({
    name: "mapFilters",
    initialState,
    reducers: {
        updateMapFilters: (state, action) => {
            return action.payload;
        },
        resetFilter: (state) => {
            return initialState;
        }
    }
})

export const { updateMapFilters, resetFilter } = mapFiltersSlice.actions;
export default mapFiltersSlice.reducer;