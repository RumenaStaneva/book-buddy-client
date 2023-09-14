// import { SET_SEARCH_QUERY } from '../actions/searchActions';

const initialState = {
    query: '',
};

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'filter/setSearchQuery':
            return {
                query: action.payload,
            };
        default:
            return state;
    }
};

export default searchReducer;
