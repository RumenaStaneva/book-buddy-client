import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import BookList from '../components/BookList';
import axios from "axios";
import '../styles/Home.css'
import Button from '../components/Button';
import Box from '@mui/material/Box';
import Spinner from 'react-spinner-material';
import Navigation from '../components/NavBar';
import Error from '../components/Error';
import { useDispatch, useSelector } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import { motion } from "framer-motion"
import ShakeableTextField from '../components/AnimatedTextField'

function Home() {

    const [title, setTitle] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [lastSearchedTitle, setLastSearchedTitle] = useState('');
    const PAGE_SIZE = 10;
    const dispatchError = useDispatch();
    const { errorMessage } = useSelector((state) => state.error);
    useEffect(() => {
        document.title = 'Home';
    }, []);

    const handleChange = (e) => {
        const title = e.target.value;
        setTitle(title);
        dispatchError(clearError());
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (title === '' || title === undefined || title === null) {
            dispatchError(setError({ message: 'Please enter a title or author.' }));
        } else {
            setLastSearchedTitle(title);
            setCurrentPage(1);
            setTotalPages(0);
            fetchData(1, title);
            setTitle('');
        }
    }

    const fetchData = useCallback(async (page, title) => {
        setLoading(true);
        try {
            const url = `${process.env.REACT_APP_LOCAL_HOST}/api/search-book-title`;
            const response = await axios.post(
                url,
                { title: title, startIndex: (page - 1) * PAGE_SIZE, maxResults: PAGE_SIZE },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setBooks(response.data.items);
            setTotalPages(Math.ceil(response.data.totalItems / PAGE_SIZE));
        } catch (error) {
            dispatchError(setError({ message: `Error fetching books: ${error})` }));
            console.error('Error fetching books: ', error);
        } finally {
            setLoading(false);
        }
    }, [dispatchError]);

    useEffect(() => {
        if (lastSearchedTitle) {
            fetchData(currentPage, lastSearchedTitle);
        }
    }, [currentPage, lastSearchedTitle, fetchData]);

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

    const searchbarVariants = {
        big: { height: 700 },
        small: { height: 400 }
    }

    const imageVariants = {
        big: { height: 400 },
        small: { height: 250 }
    }

    return (
        <>
            <Navigation />
            <Header title="Find your next favourite book" />
            <>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    action="/api/search-book-title"
                    method='POST'
                    onSubmit={handleSubmit}
                    className='form__container'

                >
                    <motion.div animate={books.length !== 0 ? "small" : "big"}
                        transition={{
                            duration: 1,
                            ease: [0, 0.71, 0.2, 1.01],
                            type: "spring",
                            stiffness: 700,
                            damping: 30

                        }}
                        layout
                        variants={searchbarVariants} className={`search__container`}>
                        <motion.img
                            animate={books.length !== 0 ? "small" : "big"}
                            transition={{
                                duration: 1,
                                ease: [0, 0.71, 0.2, 1.01],
                                type: "spring",
                                stiffness: 700,
                                damping: 30

                            }}
                            layout
                            variants={imageVariants}
                            src={require('../images/logo-big.png')}
                            alt="Logo" />
                        <Error />
                        <div className='d-flex'>
                            <ShakeableTextField
                                id="outlined-basic"
                                label="Title/author"
                                variant="outlined"
                                value={title}
                                onChange={handleChange}
                                error={errorMessage}
                                className='search__input'
                            />
                            <Button className='cta-btn' type='submit'>Search</Button>

                        </div>
                    </motion.div>


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
                        <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
                        <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                    : null}

            </ >
        </>

    )
}

export default Home;