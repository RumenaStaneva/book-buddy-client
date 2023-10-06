import { configureStore } from '@reduxjs/toolkit';
import { filtersSlice } from './reducers/filtersSlice';
import { booksSlice } from './reducers/booksSlice';
import { errorSlice } from './reducers/errorSlice';

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
        books: booksSlice.reducer,
        error: errorSlice.reducer,
    },
});
export default store;
