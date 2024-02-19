import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Book } from "../components/BookList";

type TimerState = {
  currentlyReadingBook: null | Book;
  timerStarted: boolean;
  successMessage: string;
  timerMode: "decrement" | "increment";
};

const initialState: TimerState = {
  currentlyReadingBook: null,
  timerStarted: false,
  successMessage: "",
  timerMode: "decrement",
};

const options = {
  name: "timer",
  initialState: initialState,
  reducers: {
    setCurrentlyReadingBook: (
      state: TimerState,
      action: PayloadAction<Book>
    ) => {
      state.currentlyReadingBook = action.payload;
    },
    setTimerStarted: (state: TimerState, action: PayloadAction<boolean>) => {
      state.timerStarted = action.payload;
    },
    setTimerMode: (
      state: TimerState,
      action: PayloadAction<"decrement" | "increment">
    ) => {
      state.timerMode = action.payload;
    },
    setSuccessMessage: (state: TimerState, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state: TimerState) => {
      state.successMessage = "";
    },
  },
};
export const timerSlice = createSlice(options);
export const {
  setCurrentlyReadingBook,
  setTimerStarted,
  setSuccessMessage,
  clearSuccessMessage,
  setTimerMode,
} = timerSlice.actions;

export default timerSlice.reducer;
