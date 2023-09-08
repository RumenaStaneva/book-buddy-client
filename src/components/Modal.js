import React from "react";
import '../styles/Modal.css'
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import BookCategories from "../constants/bookCategories";
import { IoIosClose } from 'react-icons/io'


const Modal = ({ setIsOpen, bookDetails, onBookAdded }) => {
    const [shelf, setShelf] = useState(null);
    const [category, setCategory] = useState(null);
    const [bookToAdd, setBookToAdd] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const { user } = useAuthContext();
    const shelfOptions = [
        { value: 0, label: 'Want to read' },
        { value: 1, label: 'Currently reading' },
        { value: 2, label: 'Read' }
    ];

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


    useEffect(() => {
        try {
            if (bookToAdd) {

                fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/add-to-shelf`, {
                    method: 'POST',
                    body: JSON.stringify(bookToAdd),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                })
                    .then(function (response) {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.error);
                            });
                        }
                        setErrorMessage('');
                        setIsOpen(false);
                        onBookAdded(bookToAdd.title);
                        return response.json();
                    })
                    .then(function (data) {
                        setErrorMessage('');
                    })
                    .catch(function (error) {
                        setErrorMessage(error.message);
                    });
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setBookToAdd(null);
    }, [bookToAdd, user, onBookAdded, setIsOpen]);

    return (
        <>
            <div className="darkBG" onClick={() => setIsOpen(false)} />
            <div className="centered">
                <div className="modal">
                    <div className="modalHeader">
                        <h3 className="heading">{bookDetails.title}</h3>
                        <p>written by: {bookDetails.authors ? bookDetails.authors.join(', ') : 'No author/s listed'}</p>
                    </div>
                    <button className="closeBtn" onClick={() => setIsOpen(false)}>
                        <IoIosClose />
                    </button>
                    <div className="modal-content__container">
                        <div className="modalContent">
                            {errorMessage.length > 0 ?
                                <div className='error-message__container'>
                                    <p>{errorMessage}</p>
                                </div>
                                : null}
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
                                <button type="submit" className="cta-button" onClick={handleSubmit}>
                                    Add Book
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Modal;