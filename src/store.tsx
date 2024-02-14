import { configureStore } from "@reduxjs/toolkit";
import { filtersSlice } from "./reducers/filtersSlice";
import { booksSlice } from "./reducers/booksSlice";
import { errorSlice } from "./reducers/errorSlice";
import { readingTimeForTodaySlice } from "./reducers/readingTimeForTodaySlice";
import { timerSlice } from "./reducers/timerSlice";

const store = configureStore({
  reducer: {
    filters: filtersSlice.reducer,
    books: booksSlice.reducer,
    error: errorSlice.reducer,
    readingTimeForToday: readingTimeForTodaySlice.reducer,
    timer: timerSlice.reducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
