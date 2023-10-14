import { configureStore } from '@reduxjs/toolkit';
import { filtersSlice } from './reducers/filtersSlice';
import { booksSlice } from './reducers/booksSlice';
import { errorSlice } from './reducers/errorSlice';
import { readingTimeForTodaySlice } from './reducers/readingTimeForTodaySlice';

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
        books: booksSlice.reducer,
        error: errorSlice.reducer,
        readingTimeForToday: readingTimeForTodaySlice.reducer

    },
});
export default store;
