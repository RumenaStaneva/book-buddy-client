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

    const handleOptionSelect = (selectedOption) => {
        const selectedValue = shelfOptions.find(option => option.label === selectedOption)?.value;
        if (selectedValue !== undefined) {
            setShelf(selectedValue);

        }
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
                    const formData = new FormData();
                    formData.append('bookApiId', bookDetails.bookApiId);
                    formData.append('userEmail', user.email);
                    formData.append('title', bookDetails.title);
                    formData.append('authors', bookDetails.authors);
                    formData.append('description', updatedDescription);
                    formData.append('publisher', bookDetails.publisher);
                    formData.append('category', category);
                    formData.append('pageCount', updatedPageCount);
                    formData.append('progress', 0);
                    formData.append('shelf', shelf);

                    // Append the image file if it exists
                    if (updatedThumbnail) {
                        formData.append('thumbnail', updatedThumbnail);
                    }
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/add-to-shelf`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            // 'Content-Type': 'application/json',
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

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions to resize the image (250x250)
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

                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

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
                            <textarea name="description" id="description" cols="10" rows="5" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)}></textarea>
                        </div>
                        <div className="modal__section">
                            <label htmlFor="pageCount">Book Pages</label>
                            <input type="number" name="pageCount" value={updatedPageCount} onChange={(e) => setUpdatedPageCount(e.target.value)} />
                        </div>
                        <div className="modal__section">
                            <label htmlFor="bookImage">Book image</label>
                            <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
                        </div>
                        <div className="modal__section">
                            <Dropdown
                                options={shelfOptions.map(option => option.label)}
                                onSelect={handleOptionSelect}
                                selectedOption={shelf !== null ? shelfOptions.find(option => option.value === shelf).label : null}
                            />
                        </div>
                        <div className="modal__section">
                            <Dropdown options={Object.values(BookCategories)} onSelect={(selectedCategory) => setCategory(selectedCategory)} selectedOption={category !== null ? category : null} />
                        </div>
                        <Button type="submit" className="cta-button">
                            Add Book
                        </Button>
                    </form>

                </>
            }
        />
    );
};
export default AddBookModal;