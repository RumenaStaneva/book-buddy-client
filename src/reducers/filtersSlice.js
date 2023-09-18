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
        setCategory: (state, action) => { state.category = action.payload },
        setSearchQuery: (state, action) => { state.query = action.payload },
        setLimit: (state, action) => { state.limit = action.payload }
    }
}
export const filtersSlice = createSlice(options);
export const { setCategory, setSearchQuery, setLimit } = filtersSlice.actions;

export default filtersSlice.reducer;