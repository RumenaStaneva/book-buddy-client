import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode: false,
}

const options = {
    name: 'theme',
    initialState: initialState,
    reducers: {
        setDarkTheme: (state, action) => {
            state.darkMode = action.payload;
        },
    }
}

export const themeSlice = createSlice(options);
export const { setDarkTheme } = themeSlice.actions;

export default themeSlice.reducer;