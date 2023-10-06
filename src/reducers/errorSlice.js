import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hasError: false,
    errorMessage: '',
};

const options = {
    name: 'error',
    initialState: initialState,
    reducers: {
        setError: (state, action) => {
            state.hasError = true;
            state.errorMessage = action.payload.message;
        },
        clearError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        },
    }
}
export const errorSlice = createSlice(options);
export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;