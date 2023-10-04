import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllBooks = createAsyncThunk("book/fetchAllBooks", async (user, thunkAPI) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/library`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        const data = await response.json();
        // console.log('datad', data);
        return data;
    } catch (error) {
        console.log(error);
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
            state.errorMessage = false;
        },
        [fetchAllBooks.fulfilled]: (state, action) => {
            const allBooks = action.payload;
            state.wantToReadBooks = allBooks.wantToReadBooks;
            state.currentlyReadingBooks = allBooks.currentlyReadingBooks;
            state.readBooks = allBooks.readBooks;
            state.isLoading = false;
            state.errorMessage = false;
        },

        // [updateProgress.fulfilled]: (state, action) => {
        //     // Action payload should contain the updated book object
        //     const updatedBook = action.payload;
        //     const { _id } = updatedBook;

        //     // Find and update the book with the corresponding ID in the state
        //     state.wantToReadBooks = state.wantToReadBooks.map((book) =>
        //         book._id === _id ? updatedBook : book
        //     );
        //     state.currentlyReadingBooks = state.currentlyReadingBooks.map((book) =>
        //         book._id === _id ? updatedBook : book
        //     );
        //     state.readBooks = state.readBooks.map((book) =>
        //         book._id === _id ? updatedBook : book
        //     );
        // },


        [fetchAllBooks.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        }
    },
}
export const booksSlice = createSlice(options);

export default booksSlice.reducer;