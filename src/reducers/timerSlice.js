import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentlyReadingBook: null,
    timerStarted: false,
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
    }
}
export const timerSlice = createSlice(options);
export const { setCurrentlyReadingBook, setTimerStarted } = timerSlice.actions;

export default timerSlice.reducer;