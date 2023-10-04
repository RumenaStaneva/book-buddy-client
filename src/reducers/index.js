import { combineReducers } from 'redux';
import { filtersSlice } from './filtersSlice';
import { booksSlice } from './booksSlice';
import errorSlice from './errorSlice';

const rootReducer = combineReducers({
    search: filtersSlice.actions.setSearchQuery,
    category: filtersSlice.actions.setCategory,
    limit: filtersSlice.actions.setLimit,
    books: booksSlice.reducer,
    setError: errorSlice.actions.setError,
    clearError: errorSlice.actions.clearError

});

export default rootReducer;
