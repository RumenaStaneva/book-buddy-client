import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import categoryChangeReducer from './categoryChangeReducer';

const rootReducer = combineReducers({
    search: searchReducer,
    category: categoryChangeReducer

});

export default rootReducer;
