import { useCallback, useEffect, useState } from "react";
import Spinner from 'react-spinner-material';
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NavBar from "../components/NavBar";
import Dropdown from "../components/Dropdown";
import categoryColors from "../constants/categoryColors";
import BookCategories from "../constants/bookCategories";
import Button from "../components/Button";
import '../styles/ListAllBooks.css'
import Error from "../components/Error";
import { useSelector, useDispatch } from 'react-redux';
import { setCategory, setSearchQuery, setLimit } from '../reducers/filtersSlice';
import { clearError, setError } from "../reducers/errorSlice";
import { BsSearch } from "react-icons/bs";
import { BsFilterCircle, BsFillFilterCircleFill } from "react-icons/bs";
import LibraryBook from "../components/LibraryBook";
import { motion } from "framer-motion"
import { AiOutlineCloseCircle } from "react-icons/ai";




function ListAllBooks() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shelfNum = parseInt(searchParams.get('shelf'));
    const { user } = useAuthContext();
    const [books, setBooks] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const query = useSelector((state) => state.filters.query);
    const category = useSelector((state) => state.filters.category);
    const limit = useSelector((state) => state.filters.limit);
    const [filterVisible, setFilterVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Books in library';
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
                    dispatch(setError({ message: 'Network connection failed' }))
                    throw new Error('Network connection failed');
                }

                const data = await response.json();
                setIsLoading(false);
                setBooks(data.books);
                setTotalPages(data.totalPages);
                dispatch(clearError());
                return response;
            } catch (error) {
                dispatch(setError({ message: `Error fetching user data: ${error}` }))
                console.error('Error fetching user data: ', error);
                setIsLoading(false);
                return null;
            }
        },
        [user, shelfNum, page, limit, category, query, dispatch],
    )
    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    const handleCategoryChange = async (selectedCategory) => {
        dispatch(setCategory(selectedCategory));
    };
    const handleRemoveCategoryFilter = () => {
        dispatch(setCategory(''));
        fetchBooks();
    };
    const handleRemoveQueryFilter = () => {
        dispatch(setSearchQuery(''));
    }

    const removeAllFilters = () => {
        dispatch(setCategory(''));
        setSearchTerm('');
        dispatch(setSearchQuery(''));
        fetchBooks();
    }

    const handleSearchQuery = async () => {
        dispatch(setSearchQuery(searchTerm));
        try {
            await fetchBooks();
        } catch (error) {
            dispatch(setError({ message: `Error fetching books: ${error}` }));
            console.error('Error fetching books:', error);
        }
    };

    const handleLimitChange = async (selectedLimit) => {
        dispatch(setLimit(selectedLimit));
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
                        <div className="heading-section">
                            <h1 className="section-title">All books on {getShelfName()}</h1>
                        </div>
                        <div className="filter-btn__container"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered ? (
                                <BsFillFilterCircleFill
                                    onClick={() => setFilterVisible(!filterVisible)}
                                    className="filter-btn"
                                />
                            ) : (
                                <BsFilterCircle
                                    onClick={() => setFilterVisible(!filterVisible)}
                                    className="filter-btn"
                                />
                            )}
                        </div>
                        {filterVisible &&
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className={`filters__container`}>
                                <div className="search-term__container">
                                    {searchTerm.length > 0 && (
                                        <Button className="clear-filter-button" onClick={handleRemoveQueryFilter}>
                                            <AiOutlineCloseCircle />
                                        </Button>
                                    )}
                                    <form onSubmit={handleSearchQuery}>
                                        <input
                                            type="text"
                                            placeholder="Search books..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <Button type="submit" onClick={handleSearchQuery} className="search-query-btn">
                                            <BsSearch />
                                        </Button>
                                    </form>
                                </div>
                                <div className="d-flex category-limit__container">
                                    <div className="category-filter__container">
                                        {category && (
                                            <Button className="clear-filter-button" onClick={handleRemoveCategoryFilter}>
                                                <AiOutlineCloseCircle />
                                            </Button>
                                        )}
                                        <Dropdown options={Object.values(BookCategories)} onSelect={handleCategoryChange} selectedOption={category.length > 0 ? category : 'Category'} />
                                    </div>

                                    <div className="limits__container">
                                        <label htmlFor="limit" className="d-none">Set book's limit</label>
                                        <Dropdown name="limit" options={[5, 10, 15]} onSelect={handleLimitChange} selectedOption={limit} />
                                    </div>
                                </div>
                            </motion.div>
                        }

                        <div className="books__container books-colorful__container">
                            <Error />
                            {books.map(book => {
                                const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                const bookStyle = {
                                    background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                };

                                return (
                                    <LibraryBook book={book} categoryColor={categoryColor} bookStyle={bookStyle} shelf={book.shelf} fetchBooks={fetchBooks} />
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
                    <div className="no-content">
                        <h1>No books on shelf {getShelfName()} {category === '' ? null : `in ${category} category`}</h1>

                        <Button onClick={removeAllFilters} className="cta-btn">Remove all added filters</Button>


                    </div>
            )}
        </main >
    </>
}

export default ListAllBooks;