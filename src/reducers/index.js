import { combineReducers } from 'redux';
import { filtersSlice } from './filtersSlice';
import { booksSlice } from './booksSlice';

const rootReducer = combineReducers({
    search: filtersSlice.actions.setSearchQuery,
    category: filtersSlice.actions.setCategory,
    limit: filtersSlice.actions.setLimit,
    books: booksSlice.reducer,

});

export default rootReducer;
