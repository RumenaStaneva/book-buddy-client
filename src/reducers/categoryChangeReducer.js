import { SET_CATEGORY } from '../actions/categoryChangeActions';

const initialState = {
    category: '',
};

const categoryChangeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CATEGORY:
            return {
                ...state,
                category: action.payload,
            };
        default:
            return state;
    }
}

export default categoryChangeReducer;
