import { createSlice } from '@reduxjs/toolkit'

export interface IDebugSlice {
    log: ISingleDebug[];
}

interface ISingleDebug {
    logItem: string;
}

const initialState: IDebugSlice = {
    log: []
};

export const debugSlice = createSlice({
    name: "debugSlice",
    initialState,
    reducers: {
        addDebugLogItem: (state, action) => {
            state.log.push(action.payload)
            return state;
        },
        cleanDebug: () => {
            return initialState;
        }
    }
})

export const { addDebugLogItem, cleanDebug } = debugSlice.actions;
export default debugSlice.reducer;