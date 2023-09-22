import { combineReducers } from 'redux';
import { filtersSlice } from './filtersSlice';

const rootReducer = combineReducers({
    search: filtersSlice.actions.setSearchQuery,
    category: filtersSlice.actions.setCategory,
    limit: filtersSlice.actions.setLimit

});

export default rootReducer;
