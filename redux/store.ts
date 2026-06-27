import { combineReducers, configureStore } from '@reduxjs/toolkit'
import appConfigSlice from 'mondosurf-library/redux/appConfigSlice';
import appStatusSlice from 'mondosurf-library/redux/appStatusSlice';
import debugSlice from 'mondosurf-library/redux/debugSlice';
import mapFiltersSlice from 'mondosurf-library/redux/mapFiltersSlice';
import modalSlice from 'mondosurf-library/redux/modalSlice';
import RevenueCatSlice from 'mondosurf-library/redux/RevenueCatSlice';
import userSlice from 'mondosurf-library/redux/userSlice';

const rootReducer = combineReducers({
    mapFilters: mapFiltersSlice,
    modalSlice: modalSlice,
    appConfig: appConfigSlice,
    appStatus: appStatusSlice,
    user: userSlice,
    debug: debugSlice,
    RevenueCat: RevenueCatSlice
});

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>