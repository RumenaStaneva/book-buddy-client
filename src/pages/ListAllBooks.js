import { Fragment, useCallback, useEffect, useState } from "react";
import Spinner from 'react-spinner-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NavBar from "../components/NavBar";
import { Modal } from "@mui/material";
import Dropdown from "../components/Dropdown";
import categoryColors from "../constants/categoryColors";
import BookCategories from "../constants/bookCategories";
// import { AiFillEdit } from "react-icons/ai";
import Button from "../components/Button";
import '../styles/ListAllBooks.css'

import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery } from '../actions/searchActions';
import { setCategory } from "../actions/categoryChangeActions";

import store from "../store";

function ListAllBooks() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shelfNum = parseInt(searchParams.get('shelf'));
    const [books, setBooks] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [currentBook, setCurrentBook] = useState();
    const [open, setOpen] = useState(false);
    const [newShelf, setNewShelf] = useState();
    const shelfOptions = ['Want to read', 'Currently reading', 'Read'];
    const [searchTerm, setSearchTerm] = useState('');

    const query = useSelector((state) => state.search.query);
    const category = useSelector((state) => state.category.category);
    const dispatch = useDispatch();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpen = (book) => {
        setCurrentBook(book)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const { user } = useAuthContext();

    const getShelfName = () => {
        if (shelfNum === 0) return 'Want to read';
        if (shelfNum === 1) return 'Currently reading';
        if (shelfNum === 2) return 'Read';
        return 'Unknown Shelf';
    };

    const fetchBooks = useCallback(
        async () => {
            setIsLoading(true);
            try {
                let url = `${process.env.REACT_APP_LOCAL_HOST}/books/see-all?shelf=${shelfNum}&page=${page}&limit=${limit}`;
                console.log(category, query);
                console.log('stores state: ', store.getState());

                if (category !== '') {
                    url += `&category=${category}`;
                }

                if (query !== '') {
                    url += `&search=${query}`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setIsLoading(false);
                setBooks(data.books);
                setTotalPages(data.totalPages);
                return response;
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
                return null;
            }
        },
        [user, shelfNum, page, limit, category, query],
    )
    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    const handleShelfChange = (selectedOption) => {
        if (selectedOption === 'Want to read') {
            setNewShelf(0);
        } else if (selectedOption === 'Currently reading') {
            setNewShelf(1);
        } else if (selectedOption === 'Read') {
            setNewShelf(2);
        }
    }
    const handleMoveToShelf = async (currentBook) => {
        currentBook.shelf = newShelf;
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    book: currentBook
                }),
            });

            await response.json();
            handleClose();
            fetchBooks();
        } catch (error) {
            console.error('Error changing shelf:', error);
        }
    }
    const handleCategoryChange = async (selectedCategory) => {
        dispatch(setCategory(selectedCategory));
        console.log('stores state: ', store.getState());
    };
    const handleRemoveCategoryFilter = () => {
        dispatch(setCategory(''));
        console.log('stores state: ', store.getState());
        fetchBooks();
    };

    const removeAllFilters = () => {
        dispatch(setCategory(''));
        setSearchTerm('');
        dispatch(setSearchQuery(''));
        // console.log('stores state: ', store.getState());

        fetchBooks();
    }

    const handleSearchQuery = async () => {
        dispatch(setSearchQuery(searchTerm));
        console.log('stores state: ', store.getState());
        try {
            await fetchBooks();
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleLimitChange = async (selectedLimit) => {
        setLimit(selectedLimit);
        fetchBooks();
    }


    return <>
        <NavBar />
        < main className="books__list-all">
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                books.length > 0 ?
                    <>
                        {currentBook ?
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                className="change-shelf-modal"
                            >
                                <Box className='change-shelf-modal__body'>
                                    <h3 id="modal-modal-title">Change shelf</h3>
                                    <Typography className="modal-body__book-title" variant="h6" component="h2">
                                        Book: {currentBook.title}
                                    </Typography>
                                    <Typography className="modal-body__book-shelf" id="modal-modal-description">
                                        Currently on: {getShelfName()} shelf
                                    </Typography>
                                    <Dropdown options={Object.values(shelfOptions)} onSelect={handleShelfChange} />
                                    <Button className="cta-btn" onClick={() => handleMoveToShelf(currentBook)}>Save</Button>
                                </Box>
                            </Modal>
                            : null}
                        <div className="heading-section">
                            <h1 className="section-title">All books on {getShelfName()}</h1>
                        </div>
                        <div className="filters__container">
                            <Dropdown options={Object.values(BookCategories)} onSelect={handleCategoryChange} selectedOption={category.length > 0 ? category : 'Select a category'} />
                            {category && (
                                <Button className="clear-filter-button" onClick={handleRemoveCategoryFilter}>
                                    Clear Filter
                                </Button>
                            )}
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button onClick={handleSearchQuery}>Search</Button>
                        </div>
                        <div className="limits__container">
                            <label htmlFor="limit">Set book's limit</label>
                            <Dropdown name="limit" options={[5, 10, 15]} onSelect={handleLimitChange} selectedOption={limit} />
                        </div>

                        <div className="books__container books-colorful__container">
                            {books.map(book => {
                                const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                const bookStyle = {
                                    background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                };

                                return (
                                    <div key={book._id} className="book-colorful" style={bookStyle}>
                                        {/* <AiFillEdit className="edit-book__icon" /> */}
                                        <img
                                            src={
                                                book.thumbnail === undefined
                                                    ? require('../images/image-not-available.png')
                                                    : `${book.thumbnail}`
                                            } alt={`${book.title}`}
                                            className='book-colorful__image'
                                        />
                                        <div className="book-colorful__info">
                                            <h2 className="book__title">{book.title}</h2>
                                            <p className="book__authors">{book.authors.map((author, index) => index === book.authors.length - 1 ? author : `${author}, `)}</p>
                                            <div className="book__action-area">
                                                <Button className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</Button>
                                                <Button onClick={() => handleOpen(book)} className="cta-btn">Move</Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pagination">
                            {page > 1 && (
                                <Button className="pagination-button" onClick={() => setPage(page - 1)}>Previous</Button>
                            )}
                            <span className="pagination-text">Page {page} of {totalPages === 0 ? '1' : totalPages}</span>
                            {page < totalPages && (
                                <Button className="pagination-button" onClick={() => setPage(page + 1)}>Next</Button>
                            )}
                        </div>
                    </>
                    :
                    <Fragment>
                        <h1>No books on shelf {getShelfName()} {category === '' ? null : `in ${category} category`}</h1>

                        <Button onClick={removeAllFilters}>Remove all added filters</Button>


                    </Fragment>
            )}
        </main >
    </>
}

export default ListAllBooks;