import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from '../reducers/errorSlice';

export const fetchAllBooks = createAsyncThunk("book/fetchAllBooks", async (user, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/library`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        thunkAPI.dispatch(setError({ message: `Error fetching books: ${error.message}` }));
        throw new Error(error.message);
    }
});

export const calculateProgress = (bookPageProgress, bookTotalPages) => {
    const totalPagesNumber = parseInt(bookTotalPages, 10);
    if (totalPagesNumber === 0) {
        return 0;
    }
    return Math.floor((bookPageProgress / totalPagesNumber) * 100);
};


const initialState = {
    wantToReadBooks: [],
    currentlyReadingBooks: [],
    readBooks: [],
    bookPageProgress: 0,
    bookTotalPages: 0,
    errorMessage: '',
    isLoading: false,
};

const options = {
    name: 'books',
    initialState,
    reducers: {
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
    },
    extraReducers: {
        [fetchAllBooks.pending]: (state, action) => {
            state.isLoading = true;
            state.errorMessage = '';
        },
        [fetchAllBooks.fulfilled]: (state, action) => {
            const allBooks = action.payload;
            state.wantToReadBooks = allBooks.wantToReadBooks;
            state.currentlyReadingBooks = allBooks.currentlyReadingBooks;
            state.readBooks = allBooks.readBooks;
            state.isLoading = false;
            state.errorMessage = '';
        },
        [fetchAllBooks.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        }
    },
}
export const booksSlice = createSlice(options);
export const { setErrorMessage } = booksSlice.actions;
export default booksSlice.reducer;