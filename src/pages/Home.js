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
        setLoading(true);
        if (title === '' || title === undefined || title === null) {
            dispatchError(setError({ message: 'Please enter a title or author.' }));
            setLoading(false);
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
            const calculatedTotalPages = Math.ceil(response.data.totalItems / PAGE_SIZE);
            console.log('Calculated Total Pages:', calculatedTotalPages);
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
        setLoading(true);
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        setLoading(true);
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const totalPagesToShow = 3; // Number of pages to show around the current page

        let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
        let endPage = startPage + totalPagesToShow - 1;

        // Ensure the end page does not exceed the total number of pages
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - totalPagesToShow + 1);
        }
        startPage = Math.max(1, startPage);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };
    // page numbers 
    const pageNumbers = () => {
        const pages = generatePageNumbers();
        return (
            <div className="pagination__container">
                <Button className="pagination-button" onClick={firstPage} disabled={currentPage === 1}>
                    First
                </Button>
                {currentPage > 1 && (
                    <Button className="pagination-button pagination-button--prev" onClick={prevPage} disabled={currentPage === 1}>
                        &#10096;
                    </Button>
                )}
                {pages.map((pageNumber) => (
                    <Button className={`pagination-text ${currentPage === pageNumber ? 'pagination-button--active' : ''}`}
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        disabled={currentPage === pageNumber}
                    >
                        {pageNumber}
                    </Button>
                ))}
                {currentPage < totalPages && (
                    <Button className="pagination-button pagination-button--next" onClick={nextPage} disabled={currentPage === totalPages}>
                        &#10097;
                    </Button>
                )}
            </div>
        );
    };
    const firstPage = () => {
        setCurrentPage(1);
    };
    console.log(totalPages);
    const goToPage = (pageNumber) => {
        setLoading(true);
        // setCurrentPage(pageNumber);
        setCurrentPage((prevPage) => {
            // Ensure the current page is updated first before setting the new page
            if (prevPage !== pageNumber) {
                // Only set the new page if it's different from the current page
                return pageNumber;
            } else {
                // If it's the same page, return the current page to avoid unnecessary state updates
                return prevPage;
            }
        });
    };

    const searchbarVariants = {
        big: { height: 570 },
        small: { height: 460 },
    }

    const imageVariants = {
        big: { height: 400 },
        small: { height: 250 }
    }

    const isSmallScreen = () => {
        return window.innerWidth < 576;
    };

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
                    <motion.div animate={books.length !== 0 || isSmallScreen() ? "small" : "big"}
                        transition={{
                            duration: 1,
                            ease: [0, 0.71, 0.2, 1.01],
                            type: "spring",
                            stiffness: 700,
                            damping: 30

                        }}
                        layout
                        variants={searchbarVariants} className={`search__container`}
                    >
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
                            alt="Logo"
                            className='homepage-logo'
                        />
                        <Error />
                        {loading ?
                            <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} /> :
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
                        }
                    </motion.div>


                </Box>
                {loading ?
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                    : null
                }

                {books && books.length !== 0 ?
                    <BookList books={books} loading={loading} />

                    : null}

                {totalPages > 1 && books.length !== 0 ? pageNumbers() : null}

            </ >
        </>

    )
}

export default Home;