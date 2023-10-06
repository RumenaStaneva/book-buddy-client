import '../styles/Modal.css'
import { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import BookCategories from "../constants/bookCategories";
import Button from "./Button";
import Modal from './Dialog'
import Error from './Error'

const AddBookModal = ({ setIsOpen, bookDetails, onBookAdded }) => {
    const [shelf, setShelf] = useState(null);
    const [category, setCategory] = useState(null);
    const [bookToAdd, setBookToAdd] = useState(null);
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const { user } = useAuthContext();
    const errorRef = useRef(null);
    const shelfOptions = [
        { value: 0, label: 'Want to read' },
        { value: 1, label: 'Currently reading' },
        { value: 2, label: 'Read' }
    ];
    const dispatchError = useDispatch();

    const handleDescriptionChange = (e) => {
        setUpdatedDescription(e.target.value);
    };
    const handlePageCountChange = (e) => {
        setUpdatedPageCount(e.target.value);
    };
    const handleThumbnailChange = (e) => {
        setUpdatedThumbnail(e.target.value);
    };
    const handleOptionSelect = (selectedOption) => {
        const selectedValue = shelfOptions.find(option => option.label === selectedOption)?.value;
        if (selectedValue !== undefined) {
            setShelf(selectedValue);

        }
    };
    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            dispatchError(setError({ message: 'You have to be logged in to add books!' }));
            setTimeout(() => {
                executeScroll();
            }, 10);
            return;
        }
        const { bookApiId,
            title,
            authors,
            publisher
        } = bookDetails;
        setBookToAdd({
            bookApiId: bookApiId,
            userEmail: user.email,
            title: title,
            authors: authors,
            description: updatedDescription,
            publisher: publisher,
            thumbnail: updatedThumbnail,
            category: category,
            pageCount: updatedPageCount,
            notes: [],
            progress: 0,
            shelf: shelf
        });
    };
    const executeScroll = () => {
        if (errorRef.current) {
            errorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }
    };
    useEffect(() => {
        const addBookToShelf = async () => {
            try {
                if (bookToAdd) {
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/add-to-shelf`, {
                        method: 'POST',
                        body: JSON.stringify(bookToAdd),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        },
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new window.Error(data.error);
                    }

                    dispatchError(clearError());
                    setIsOpen(false);
                    onBookAdded(bookToAdd.title);
                }
            } catch (error) {
                dispatchError(setError({ message: error.message }));
                if (errorRef.current) {
                    errorRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        };

        addBookToShelf();

        setBookToAdd(null);
    }, [bookToAdd, user, onBookAdded, setIsOpen, dispatchError, errorRef]);

    return (
        <Modal
            title={bookDetails.title}
            onClose={() => setIsOpen(false)}
            subtitle={`written by: ${bookDetails.authors ? bookDetails.authors.join(', ') : 'No author/s listed'}`}
            setIsOpen={setIsOpen}
            content={
                <>
                    <Error ref={errorRef} />
                    <form onSubmit={handleSubmit} className="add-book__form">
                        <div className="modal__section">
                            <label htmlFor="thumbnail">Thumbnail</label>
                            <img src={updatedThumbnail !== null ? updatedThumbnail : require('../images/image-not-available.png')} alt={bookDetails.title} width={250} />
                        </div>
                        <div className="modal__section">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" cols="10" rows="5" value={updatedDescription} onChange={handleDescriptionChange}></textarea>
                        </div>
                        <div className="modal__section">
                            <label htmlFor="pageCount">Book Pages</label>
                            <input type="number" name="pageCount" value={updatedPageCount} onChange={handlePageCountChange} />
                        </div>
                        <div className="modal__section">
                            <label htmlFor="bookImage">Book image</label>
                            <input type="text" name="bookImage" value={updatedThumbnail} onChange={handleThumbnailChange} />
                        </div>
                        <div className="modal__section">
                            <Dropdown
                                options={shelfOptions.map(option => option.label)}
                                onSelect={handleOptionSelect}
                                selectedOption={shelf !== null ? shelfOptions.find(option => option.value === shelf).label : null}
                            />
                        </div>
                        <div className="modal__section">
                            <Dropdown options={Object.values(BookCategories)} onSelect={handleCategorySelect} selectedOption={category !== null ? category : null} />
                        </div>
                        <Button type="submit" className="cta-button" onClick={handleSubmit}>
                            Add Book
                        </Button>
                    </form>

                </>
            }
        />
    );
};
export default AddBookModal;