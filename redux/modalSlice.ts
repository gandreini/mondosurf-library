import { createSlice } from '@reduxjs/toolkit'

export interface IModalSlice {
    modalIsDisplayed: boolean;
}

const initialState: IModalSlice = {
    modalIsDisplayed: false
};

export const modalSlice = createSlice({
    name: "modalSlice",
    initialState,
    reducers: {
        setModalDisplayed: (state) => {
            return { ...state, modalIsDisplayed: true };
        },
        setModalHidden: (state) => {
            return { ...state, modalIsDisplayed: false };
        }
    }
})

export const { setModalDisplayed, setModalHidden } = modalSlice.actions;
export default modalSlice.reducer;