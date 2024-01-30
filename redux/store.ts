import { combineReducers, configureStore } from '@reduxjs/toolkit'

import appConfigSlice from 'mondosurf-library/redux/appConfigSlice';
import appStatusSlice from 'mondosurf-library/redux/appStatusSlice';
import debugSlice from 'mondosurf-library/redux/debugSlice';
import IAPProductsSlice from 'mondosurf-library/redux/IAPProductsSlice';
import mapFiltersSlice from 'mondosurf-library/redux/mapFiltersSlice';
import modalSlice from 'mondosurf-library/redux/modalSlice';
import unitsSlice from 'mondosurf-library/redux/unitsSlice';
import userSlice from 'mondosurf-library/redux/userSlice';

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