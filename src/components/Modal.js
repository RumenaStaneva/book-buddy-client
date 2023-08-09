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
    const [file, setFile] = useState();
    const { user } = useAuthContext();
    const shelfOptions = ['Want to read', 'Currently reading', 'Read'];
    const LOCAL_HOST = process.env.REACT_APP_LOCAL_HOST;

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
            thumbnail: file !== undefined ? file : updatedThumbnail,
            category: category,
            pageCount: updatedPageCount,
            notes: [],
            progress: 0,
            shelf: shelf
        });
    }


    useEffect(() => {
        try {
            if (bookToAdd) {
                // Create a new FormData object
                // const formData = new FormData();

                // Append fields to the FormData object
                // formData.append('thumbnail', file !== undefined ? file : updatedThumbnail);
                // formData.append('bookToAdd', JSON.stringify(bookToAdd));
                // console.log(formData);

                fetch(`${LOCAL_HOST}/books/add-to-shelf`, {
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
                        <h3 className="heading">{bookDetails.title}</h3>
                        <p>written by: {bookDetails.authors.map((author, index) => index === bookDetails.authors.length - 1 ? author : `${author}, `)}</p>
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
                                {/* <input type="text" name="thumbnail" value={updatedThumbnail !== null ? updatedThumbnail : require('../images/image-not-available.png')} onChange={handleThumbnailChange} /> */}
                                {/* <label htmlFor="uploadImageThumbnail">Change book cover</label>
                                <input
                                    filename={file}
                                    onChange={e => setFile(e.target.files[0])}
                                    type="file"
                                    name="uploadImageThumbnail"
                                    accept="image/*"
                                ></input> */}
                                <div className="modal__section">
                                    <label htmlFor="description">Description</label>
                                    <textarea name="description" id="description" cols="10" rows="5" value={updatedDescription} onChange={handleDescriptionChange}></textarea>
                                </div>
                                <div className="modal__section">
                                    <label htmlFor="pageCount">Book Pages</label>
                                    <input type="number" name="pageCount" value={updatedPageCount} onChange={handlePageCountChange} />
                                </div>
                                <div className="modal__section">
                                    <Dropdown options={shelfOptions} onSelect={handleOptionSelect} />
                                </div>
                                <div className="modal__section">
                                    <Dropdown options={Object.values(BookCategories)} onSelect={handleCategorySelect} />
                                </div>
                                {/* <button type="submit" onClick={handleSubmit}>Add</button> */}
                                <button type="submit" className="cta-button" onClick={handleSubmit}>
                                    Add Book
                                </button>
                                {/* <div className="modalActions">
                                    <div className="actionsContainer">
                                        <button
                                            className="cancelBtn"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Modal;