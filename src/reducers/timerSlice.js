import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentlyReadingBook: null,
    timerStarted: false,
    successMessage: '',
    timerMode: "decrement",
};

const options = {
    name: 'timer',
    initialState: initialState,
    reducers: {
        setCurrentlyReadingBook: (state, action) => {
            state.currentlyReadingBook = action.payload;
        },
        setTimerStarted: (state, action) => {
            state.timerStarted = action.payload;
        },
        setTimerMode: (state, action) => {
            state.timerMode = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = '';
        },

    }
}
export const timerSlice = createSlice(options);
export const { setCurrentlyReadingBook, setTimerStarted, setSuccessMessage, clearSuccessMessage, setTimerMode } = timerSlice.actions;

export default timerSlice.reducer;