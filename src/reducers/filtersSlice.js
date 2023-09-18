import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category: '',
    query: '',
    limit: 5
};

const options = {
    name: 'filter',
    initialState: initialState,
    reducers: {
        setCategory: (state, action) => {
            return { ...state, category: action.payload };
        },
        setSearchQuery: (state, action) => {
            return { ...state, query: action.payload };
        },
        setLimit: (state, action) => {
            return { ...state, limit: action.payload };
        }
    }
}
export const filtersSlice = createSlice(options);
export const { setCategory, setSearchQuery, setLimit } = filtersSlice.actions;

export default filtersSlice.reducer;