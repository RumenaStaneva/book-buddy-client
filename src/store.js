import { configureStore } from '@reduxjs/toolkit';

import { filtersSlice } from './reducers/filtersSlice';
import { booksSlice } from './reducers/booksSlice';

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
        books: booksSlice.reducer,
    },
});
export default store;
