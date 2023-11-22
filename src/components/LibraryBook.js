import { useState, useRef, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Button from "./Button";
import { HiDotsVertical } from "react-icons/hi";
import { GiBookmarklet } from "react-icons/gi";
import Modal from './Dialog';
import Dropdown from "../components/Dropdown";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDispatch } from 'react-redux';
import { setError } from '../reducers/errorSlice';

function LibraryBook({ book, categoryColor, bookStyle, shelf, fetchBooks }) {
    const [editShelfVisible, setEditShelfVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const shelfOptions = ['Want to read', 'Currently reading', 'Read'];
    const [newShelf, setNewShelf] = useState(shelf);
    const { user } = useAuthContext();
    const dispatch = useDispatch();
    const editShelfContainerRef = useRef(null);
    const [previousElement, setPreviousElement] = useState(null);

    const handleEditShelfClick = () => {
        setEditShelfVisible(!editShelfVisible);
    };

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
        const updatedBook = { ...currentBook, shelf: newShelf };
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(
                    updatedBook
                ),
            });

            await response.json();
            setIsOpen(false);
            fetchBooks();
            document.body.style.overflow = 'visible';
        } catch (error) {
            dispatch(setError({ message: `Error changing shelf: ${error}` }));
            console.error('Error changing shelf:', error);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (editShelfContainerRef.current && !editShelfContainerRef.current.contains(event.target)) {
                setEditShelfVisible(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // console.log('previousElement', previousElement);
    return (
        <>
            {isOpen ?
                <Modal
                    title={'Change shelf'}
                    onClose={() => { setIsOpen(false); document.body.style.overflow = 'visible'; }}
                    subtitle={`Book: ${book.title}`}
                    setIsOpen={setIsOpen}
                    className="change-shelf-modal"
                    small={true}
                    previousElement={previousElement}
                    content={
                        <>
                            {/* <p className="modal-body__book-shelf" id="modal-modal-description">
                                Currently on: {shelfOptions[shelf]} shelf
                            </p> */}
                            <Dropdown options={shelfOptions} onSelect={handleShelfChange} selectedOption={shelfOptions[newShelf]} />
                            <Button className="cta-btn" onClick={() => handleMoveToShelf(book)}>Save</Button>
                        </>
                    }
                />
                : null}
            <div key={book._id} className="book-colorful" style={bookStyle}>
                <Button className='edit-shelf__icon' onClick={(e) => {
                    e.preventDefault();
                    handleEditShelfClick()
                }}>
                    <HiDotsVertical />
                </Button>
                {editShelfVisible &&
                    <div className='edit-shelf__container' ref={editShelfContainerRef}>
                        <Button onClick={(e) => { e.preventDefault(); setIsOpen(true); document.body.style.overflow = 'hidden'; setPreviousElement(document.activeElement || document.body); }}>
                            Change shelf
                        </Button>
                    </div>
                }
                <CardActionArea
                    className='book__button'
                    component='a'
                    onClick={event => {
                        event.stopPropagation();
                        setPreviousElement(document.activeElement || document.body);
                    }}
                    href={`/books/book-details/${book._id}`}
                >
                    <CardMedia
                        component="img"
                        src={
                            book.thumbnail === undefined
                                ? 'https://storage.googleapis.com/book-buddy/images/image-not-available.png'
                                : `${book.thumbnail}`
                        } alt={`${book.title}`}
                        className='book-colorful__image'
                    />
                    <CardContent className='book-colorful__info'>
                        <h3 className='book__title book__title-outline'>
                            {book.title}
                        </h3>
                        {book.authors.length > 0 ?
                            <Typography gutterBottom variant="subtitle1" component="div" className='book__authors'>
                                {book.authors.map((author, index) => index === book.authors.length - 1 ? author : `${author}, `)}
                            </Typography>
                            : null}
                        {book.description && book.description.length > 0 && book.description !== 'undefined' ?
                            <Typography variant="body2" color="text.secondary" className='book__description'>
                                {book.description}
                            </Typography> : null}
                        <div className='details__additional-info'>
                            <div className='book__all-pages'>
                                <p className='book-font__outline'>Print Length</p>
                                <div className='d-flex fw-600'>
                                    <GiBookmarklet />
                                    <p>{book.pageCount}</p>
                                </div>
                            </div>
                            <div className="book__action-area">
                                <p className='book-font__outline'>Category</p>
                                <span className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</span>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
            </div >
        </>
    )
}

export default LibraryBook;