import '../styles/Modal.css'
import { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import BookCategories from "../constants/bookCategories";
import { AiOutlineDelete } from 'react-icons/ai';
import Button from "./Button";
import Modal from './Dialog'
import Error from "./Error";
import { useDispatch } from "react-redux";
import { setError } from '../reducers/errorSlice';
import ConformationModal from "./ConformationModal";


const EditBookModal = ({ setIsOpen, bookDetails, fetchBook }) => {
    const [updatedShelf, setUpdatedShelf] = useState(bookDetails.shelf);
    const [updatedCategory, setUpdatedCategory] = useState(bookDetails.category);
    const [bookToUpdate, setBookToUpdate] = useState(null);
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const dispatchError = useDispatch();
    const { user } = useAuthContext();
    const errorRef = useRef(null);
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
        if (updatedPageCount < 0) {
            dispatchError(setError({ message: 'Pages must be positive integer' }));
            setTimeout(() => {
                executeScroll();
            }, 10);
            return;
        }
        const {
            _id,
            bookApiId,
            title,
            authors,
            publisher,
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
            // thumbnail: updatedThumbnail,
            category: updatedCategory,
            pageCount: updatedPageCount,
            // notes: notes,
            progress: updatedShelf === 1 ? 0 : progress,
            shelf: updatedShelf
        });
    }
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
        const updateBook = async (updatedBook) => {

            try {
                const formData = new FormData();
                formData.append('_id', updatedBook._id);
                formData.append('bookApiId', updatedBook.bookApiId);
                formData.append('userEmail', updatedBook.userEmail);
                formData.append('title', updatedBook.title);
                formData.append('authors', updatedBook.authors);
                formData.append('description', updatedBook.description);
                formData.append('publisher', updatedBook.publisher);
                formData.append('category', updatedBook.category);
                formData.append('pageCount', updatedBook.pageCount);
                formData.append('progress', updatedBook.progress);
                formData.append('shelf', updatedBook.shelf);

                if (updatedThumbnail) {
                    formData.append('thumbnail', updatedThumbnail);
                }

                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: formData
                });

                await response.json();
                setIsOpen(false);
                document.body.style.overflow = 'visible';
                fetchBook();
            } catch (error) {
                dispatchError(setError({ message: `Error updating book: ${error}` }));
                console.error('Error updating book:', error);
            }
        }

        const scrollOnError = () => {
            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                });
            }
        };

        if (bookToUpdate) {
            updateBook(bookToUpdate)
                .then(scrollOnError)
                .catch((error) => {
                    console.error('Error updating book:', error);
                });
        }
    }, [bookToUpdate, user, setIsOpen, fetchBook, dispatchError, updatedThumbnail]);

    const handleDeleteBook = () => {
        setDeleteModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions to resize the image (e.g., 250x250)
                    const maxWidth = 250;
                    const maxHeight = 250;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw the resized image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas content to base64 data URL
                    const dataUrl = canvas.toDataURL('image/jpeg'); // Change format if necessary

                    setUpdatedThumbnail(dataUrl);

                    // Create a Blob from data URL and append it to FormData
                    const blobBin = atob(dataUrl.split(',')[1]);
                    const array = [];
                    for (let i = 0; i < blobBin.length; i++) {
                        array.push(blobBin.charCodeAt(i));
                    }
                    const resizedImageBlob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' }); // Change type if necessary

                    const formData = new FormData();
                    formData.append('thumbnail', resizedImageBlob);

                    // Now, you can use formData in your fetch request
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modals__container">
            <Modal
                title={bookDetails.title}
                onClose={() => { setIsOpen(false); document.body.style.overflow = 'visible'; }}
                subtitle={`written by: ${bookDetails.authors ? bookDetails.authors.join(', ') : 'No author/s listed'}`}
                setIsOpen={setIsOpen}
                content={
                    <>
                        <AiOutlineDelete className="modal__delete-btn"
                            onClick={handleDeleteBook} />

                        <Error />
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
                                <input type="file" accept="image/*" onChange={handleThumbnailUpload} />

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
            {deleteModalIsOpen && <ConformationModal
                onClose={() => { setDeleteModalIsOpen(false); document.body.style.overflow = 'visible'; }}
                setIsOpen={setDeleteModalIsOpen}
                bookId={bookDetails._id}
            />}

        </div>

    );
};



export default EditBookModal;