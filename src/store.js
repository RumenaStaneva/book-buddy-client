import { configureStore } from '@reduxjs/toolkit';

import { filtersSlice } from './reducers/filtersSlice';
import { themeSlice } from './reducers/themeSlice';

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
        theme: themeSlice.reducer,
    },
});
export default store;
