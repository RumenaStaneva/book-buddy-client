import React from "react";
import '../styles/Modal.css'
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import BookCategories from "../constants/bookCategories";
import { IoIosClose } from 'react-icons/io'


const Modal = ({ setIsOpen, bookDetails }) => {
    const [shelf, setShelf] = useState(0);
    const [category, setCategory] = useState(0);
    const [bookToAdd, setBookToAdd] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const { user } = useAuthContext();
    const shelfOptions = ['Want to read', 'Currently reading', 'Read'];

    const handleDescriptionChange = (e) => {
        setUpdatedDescription(e.target.value);
    }
    const handleThumbnailChange = (e) => {
        setUpdatedThumbnail(e.target.value);
    }
    const handlePageCountChange = (e) => {
        setUpdatedPageCount(e.target.value);
    }
    const handleOptionSelect = (selectedOption) => {
        if (selectedOption === 'Want to read') {
            setShelf(0);
        } else if (selectedOption === 'Currently reading') {
            setShelf(1);
        } else if (selectedOption === 'Read') {
            setShelf(2);
        }
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { bookApiId, title,
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
    }

    // useEffect(() => {
    //     console.log(bookToAdd)
    // }, [bookToAdd])

    useEffect(() => {
        try {
            if (bookToAdd) {
                fetch('http://localhost:5000/add-to-shelf', {
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
        setBookToAdd(null); // Reset the book to add after the request is made
    }, [bookToAdd, user]);



    return (
        <>
            <div className="darkBG" onClick={() => setIsOpen(false)} />
            <div className="centered">
                <div className="modal">
                    <div className="modalHeader">
                        <h5 className="heading">Dialog</h5>
                    </div>
                    <button className="closeBtn" onClick={() => setIsOpen(false)}>
                        <IoIosClose />
                    </button>
                    <div className="modalContent">
                        {errorMessage.length > 0 ?
                            <div className='error-message__container'>
                                <p>{errorMessage}</p>
                            </div>
                            : null}
                        <form onSubmit={handleSubmit} className="add-book__form">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" cols="10" rows="5" value={updatedDescription} onChange={handleDescriptionChange}></textarea>
                            <label htmlFor="thumbnail">Thumbnail</label>
                            <input type="text" name="thumbnail" value={updatedThumbnail} onChange={handleThumbnailChange} />
                            <label htmlFor="pageCount">Book Pages</label>
                            <input type="text" name="pageCount" value={updatedPageCount} onChange={handlePageCountChange} />
                            <Dropdown options={shelfOptions} onSelect={handleOptionSelect} />
                            <Dropdown options={Object.values(BookCategories)} onSelect={handleCategorySelect} />
                            <button type="submit" onClick={handleSubmit}>Add</button>
                        </form>
                        <div className="modalActions">
                            <div className="actionsContainer">
                                <button type="submit" className="deleteBtn" onClick={() => setIsOpen(false)}>
                                    Add Book
                                </button>
                                <button
                                    className="cancelBtn"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Modal;