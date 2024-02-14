import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ErrorState = {
  hasError: boolean;
  errorMessage: string;
};

const initialState: ErrorState = {
  hasError: false,
  errorMessage: "",
};

const options = {
  name: "error",
  initialState: initialState,
  reducers: {
    setError: (
      state: ErrorState,
      action: PayloadAction<{ message: string }>
    ) => {
      state.hasError = true;
      state.errorMessage = action.payload.message;
    },
    clearError: (state: ErrorState) => {
      state.hasError = false;
      state.errorMessage = "";
    },
  },
};
export const errorSlice = createSlice(options);
export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
