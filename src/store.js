import { configureStore } from '@reduxjs/toolkit';

import { filtersSlice } from './reducers/filtersSlice';

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
    },
});
export default store;
