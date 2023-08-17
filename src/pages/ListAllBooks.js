import { useCallback, useEffect, useState } from "react";
import Spinner from 'react-spinner-material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import NavBar from "../components/NavBar";
import { Modal } from "@mui/material";
import Dropdown from "../components/Dropdown";
import categoryColors from "../constants/categoryColors";
// import { AiFillEdit } from "react-icons/ai";
import '../styles/ListAllBooks.css'

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
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/see-all?shelf=${shelfNum}&page=${page}&limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                setIsLoading(false);
                setBooks(data.books);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        },
        [user, shelfNum, page, limit],
    )

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    const handleShelfChange = (selectedOption) => {
        console.log(selectedOption);

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

            const data = await response.json();
            console.log(data);
            handleClose();
            fetchBooks();
        } catch (error) {
            console.error('Error changing shelf:', error);
        }
    }

    return <>
        <NavBar />
        {isLoading ? (
            <div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>
        ) : (
            books.length > 0 ?
                < main className="books__list-all">
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
                                <button className="cta-btn" onClick={() => handleMoveToShelf(currentBook)}>Save</button>
                            </Box>
                        </Modal>
                        : null}
                    <div className="heading-section">
                        <h1 className="section-title">All books on {getShelfName()}</h1>
                    </div>
                    <div className="books__container">
                        {books && books.map(book => {
                            const categoryColor = categoryColors[book.category] || '#FFFFFF';
                            const bookStyle = {
                                background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                            };

                            return (
                                <div key={book._id} className="book" style={bookStyle}>
                                    {/* <AiFillEdit className="edit-book__icon" /> */}
                                    <img
                                        src={
                                            book.thumbnail === undefined
                                                ? require('../images/image-not-available.png')
                                                : `${book.thumbnail}`
                                        } alt={`${book.title}`}
                                        className='book__image'
                                    />
                                    <div className="book__info">
                                        <h2 className="book__title">{book.title}</h2>
                                        <p className="book__authors">{book.authors.map((author, index) => index === book.authors.length - 1 ? author : `${author}, `)}</p>
                                        {/* //todo make it button to show only from this category */}
                                        <div className="book__action-area">
                                            <button className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</button>
                                            <button onClick={() => handleOpen(book)} className="cta-btn">Move</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="pagination">
                        {page > 1 && (
                            <button className="pagination-button" onClick={() => setPage(page - 1)}>Previous</button>
                        )}
                        <span className="pagination-text">Page {page} of {totalPages}</span>
                        {page < totalPages && (
                            <button className="pagination-button" onClick={() => setPage(page + 1)}>Next</button>
                        )}
                    </div>

                </main >
                : <h1>No books on shelf {getShelfName()}</h1>
        )
        }
    </>
}

export default ListAllBooks;