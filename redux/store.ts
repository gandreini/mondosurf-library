import { combineReducers, configureStore } from '@reduxjs/toolkit'

import appConfigSlice from './appConfigSlice';
import appStatusSlice from './appStatusSlice';
import debugSlice from './debugSlice';
import IAPProductsSlice from './IAPProductsSlice';
import mapFiltersSlice from './mapFiltersSlice';
import modalSlice from './modalSlice';
import unitsSlice from './unitsSlice';
import userSlice from './userSlice';

const rootReducer = combineReducers({
    mapFilters: mapFiltersSlice,
    units: unitsSlice,
    modalSlice: modalSlice,
    appConfig: appConfigSlice,
    appStatus: appStatusSlice,
    user: userSlice,
    debug: debugSlice,
    IAPProducts: IAPProductsSlice
});

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>