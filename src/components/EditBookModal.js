import React from "react";
import '../styles/Modal.css'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import BookCategories from "../constants/bookCategories";
import { AiOutlineDelete } from 'react-icons/ai';
import Button from "./Button";
import Modal from './Dialog'
import Error from "./Error";


const EditBookModal = ({ setIsOpen, bookDetails, fetchBook }) => {
    const [updatedShelf, setUpdatedShelf] = useState(bookDetails.shelf);
    const [updatedCategory, setUpdatedCategory] = useState(bookDetails.category);
    const [bookToUpdate, setBookToUpdate] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const shelfOptions = [
        { value: 0, label: 'Want to read' },
        { value: 1, label: 'Currently reading' },
        { value: 2, label: 'Read' }
    ];

    const handleDescriptionChange = (e) => {
        setUpdatedDescription(e.target.value);
    }
    const handlePageCountChange = (e) => {
        setUpdatedPageCount(e.target.value);
    }
    const handleThumbnailChange = (e) => {
        setUpdatedThumbnail(e.target.value);
    }
    const handleShelfSelect = (selectedOption) => {
        const selectedValue = shelfOptions.find(option => option.label === selectedOption)?.value;
        if (selectedValue !== undefined) {
            setUpdatedShelf(selectedValue);
        }
    };
    const handleCategorySelect = (selectedCategory) => {
        setUpdatedCategory(selectedCategory);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            _id,
            bookApiId,
            title,
            authors,
            publisher,
            notes,
            progress,

        } = bookDetails;
        setBookToUpdate({
            _id,
            bookApiId: bookApiId,
            userEmail: user.email,
            title: title,
            authors: authors,
            description: updatedDescription,
            publisher: publisher,
            thumbnail: updatedThumbnail,
            category: updatedCategory,
            pageCount: updatedPageCount,
            notes: notes,
            progress: progress,
            shelf: updatedShelf
        });
    }
    useEffect(() => {
        const updateBook = async (updatedBook) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        book: updatedBook
                    }),
                });

                await response.json();
                setIsOpen(false);
                fetchBook();
            } catch (error) {
                console.error('Error updating book:', error);
            }
        }

        if (bookToUpdate) {
            updateBook(bookToUpdate);
        }
    }, [bookToUpdate, user, setIsOpen, fetchBook]);

    const deleteBook = async (bookId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/delete-book?bookId=${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            const data = await response.json();
            console.log(data);
            setIsOpen(false);
            navigate('/books/library');
        } catch (error) {
            setErrorMessage(error.error);
        }
    }


    return (
        <Modal
            title={bookDetails.title}
            onClose={() => setIsOpen(false)}
            subtitle={`written by: ${bookDetails.authors ? bookDetails.authors.join(', ') : 'No author/s listed'}`}
            setIsOpen={setIsOpen}
            content={
                <>
                    <AiOutlineDelete className="modal__delete-btn" onClick={() => { deleteBook(bookDetails._id) }} />

                    {errorMessage.length > 0 ? (
                        <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                    ) : null}
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
                                onSelect={handleShelfSelect}
                                selectedOption={updatedShelf !== null ? shelfOptions.find(option => option.value === updatedShelf)?.label : null}
                            />
                        </div>
                        <div className="modal__section">
                            <Dropdown options={Object.values(BookCategories)} onSelect={handleCategorySelect} selectedOption={updatedCategory} />
                        </div>
                        <Button type="submit" className="cta-button">
                            Edit Book
                        </Button>
                    </form>

                </>
            }
        />
    );
};



export default EditBookModal;