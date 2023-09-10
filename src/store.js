import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './reducers/searchReducer';
import categoryChangeReducer from './reducers/categoryChangeReducer';

const store = configureStore({
    reducer: {
        search: searchReducer,
        categoryChange: categoryChangeReducer
    },
});
console.log('store initial state: ', store.getState());
export default store;
