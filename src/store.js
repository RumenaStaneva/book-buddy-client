import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './reducers/searchReducer';
import categoryChangeReducer from './reducers/categoryChangeReducer';

const store = configureStore({
    reducer: {
        search: searchReducer,
        category: categoryChangeReducer
    },
});
export default store;
