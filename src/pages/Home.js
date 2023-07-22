import React, { useState, useEffect, useCallback } from 'react';
import BookList from '../components/BookList';
import axios from "axios";
import '../styles/Home.css'
import SubmitButton from '../components/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Spinner from 'react-spinner-material';
import Navigation from '../components/NavBar';

function Home() {

    const [title, setTitle] = useState('');
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [lastSearchedTitle, setLastSearchedTitle] = useState(''); // New state variable for the last searched title

    const PAGE_SIZE = 10;

    const handleChange = (e) => {
        const title = e.target.value;
        setTitle(title);
        setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        if (title === '' || title === undefined || title === null) {
            setError('Please enter a title or author.');
        } else {
            setLastSearchedTitle(title); // Save the last searched title
            setCurrentPage(1);
            setTotalPages(0);
            fetchData(1); // Fetch data for the first page when submitting the search
            setTitle('');
        }
    }

    // Use useCallback to memoize the fetchData function
    const fetchData = useCallback(async (page) => {
        setLoading(true);

        try {
            const url = 'http://localhost:5000/search-book-title';
            const response = await axios.post(
                url,
                { title: lastSearchedTitle, startIndex: (page - 1) * PAGE_SIZE, maxResults: PAGE_SIZE },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setBooks(response.data.items);
            setTotalPages(Math.ceil(response.data.totalItems / PAGE_SIZE));
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    }, [lastSearchedTitle]); // Include lastSearchedTitle as a dependency

    useEffect(() => {
        if (lastSearchedTitle) {
            fetchData(currentPage);
        }
    }, [currentPage, lastSearchedTitle, fetchData]); // Fetch books when currentPage or lastSearchedTitle or fetchData changes

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };


    return (
        <>
            <Navigation />
            <>

                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    action="/search-book-title"
                    method='POST'
                    onSubmit={handleSubmit}
                    className='form__container'

                >
                    <div className={`search__container ${books.length !== 0 ?
                        'search__container--small'

                        : null}`}>
                        <TextField id="outlined-basic"
                            label="Title/author"
                            variant="outlined"
                            value={title}
                            onChange={handleChange}
                            error={Boolean(error)}
                            helperText={error}
                            className='search__input' />
                        <SubmitButton variant="contained" attributes={{ type: 'submit' }}>Search</SubmitButton>
                    </div>


                </Box>
                {loading ?
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                    : null
                }

                {books.length !== 0 ?
                    <BookList books={books} />

                    : null}


                {books.length !== 0 ?
                    <div className="pagination__container">
                        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>

                    : null}

            </ >
        </>

    )
}

export default Home;