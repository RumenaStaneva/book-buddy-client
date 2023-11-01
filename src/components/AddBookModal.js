import '../styles/Modal.css'
import { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import BookCategories from "../constants/bookCategories";
import Button from "./Button";
import Modal from './Dialog'
import Error from './Error'
import Spinner from 'react-spinner-material';
import { NavLink } from 'react-router-dom';

const AddBookModal = ({ setIsOpen, bookDetails, onBookAdded }) => {
    const [shelf, setShelf] = useState(null);
    const [category, setCategory] = useState(null);
    const [bookToAdd, setBookToAdd] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updatedDescription, setUpdatedDescription] = useState(bookDetails.description);
    const [updatedThumbnail, setUpdatedThumbnail] = useState(bookDetails.thumbnail);
    const [updatedPageCount, setUpdatedPageCount] = useState(bookDetails.pageCount);
    const [loginVisivble, setLoginVisible] = useState(false);
    const { user } = useAuthContext();
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
    console.log(bookDetails.description);
    console.log(updatedDescription);
    const handleSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!user) {
            dispatchError(setError({ message: 'You have to be logged in to add books!' }));
            setLoginVisible(true);
            setIsLoading(false);
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

                    if (updatedThumbnail) {
                        formData.append('thumbnail', updatedThumbnail);
                    }
                    const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/add-to-shelf`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        },
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        dispatchError(setError({ message: data.error }));
                        setIsLoading(false);
                        throw new window.Error(data.error);
                    }
                    dispatchError(clearError());
                    setIsOpen(false);
                    document.body.style.overflow = 'visible';

                    onBookAdded(bookToAdd.title);
                    setIsLoading(false);

                }
            } catch (error) {
                // console.log(error);
                dispatchError(setError({ message: error.message }));
                setIsLoading(false);
            }
        };

        addBookToShelf();

        setBookToAdd(null);
    }, [bookToAdd, user, onBookAdded, setIsOpen, dispatchError]);

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
                    <form onSubmit={handleSubmit} className="add-book__form">
                        {isLoading &&
                            (<div className='spinner__container'>
                                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                            </div>)}
                        <>
                            <div className={`add-book-form__container ${isLoading && 'd-none'}`}>
                                <div className="modal__section-image-container">
                                    <div className="modal__section">
                                        <label htmlFor="thumbnail">Thumbnail</label>
                                        <img src={updatedThumbnail !== null ? updatedThumbnail : require('../images/image-not-available.png')} alt={bookDetails.title} width={300} />
                                    </div>
                                </div>
                                <div className="modal__section-content-container">
                                    <div className="modal__section modal__section-left-align">
                                        <label htmlFor="description">Description</label>
                                        <textarea name="description" id="description" cols="10" rows="5" value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)}></textarea>
                                    </div>
                                    <div className="modal__section book-pages-section modal__section-left-align">
                                        <label htmlFor="pageCount">Book Pages</label>
                                        <input type="number" name="pageCount" value={updatedPageCount} onChange={(e) => setUpdatedPageCount(e.target.value)} />
                                    </div>
                                    <div className="modal__section upload-image-section">
                                        <span>Change book thumbnail:</span>
                                        <label htmlFor="bookImage" className='cta-btn upload-btn'>Book image</label>
                                        <input id='bookImage' name='bookImage' type="file" accept="image/*" onChange={handleThumbnailUpload} />
                                    </div>
                                    <div className="modal__section modal__section-left-align">
                                        <label htmlFor="dropdown-shelf">Choose Book Status:</label>
                                        <Dropdown
                                            id={'dropdown-shelf'}
                                            options={shelfOptions.map(option => option.label)}
                                            onSelect={handleOptionSelect}
                                            selectedOption={shelf !== null ? shelfOptions.find(option => option.value === shelf).label : null}
                                        />
                                    </div>
                                    <div className="modal__section modal__section-left-align">
                                        <label htmlFor="dropdown-shelf">Choose Book Category:</label>
                                        <Dropdown id={'dropdown-category'} options={Object.values(BookCategories)} onSelect={(selectedCategory) => setCategory(selectedCategory)} selectedOption={category !== null ? category : null} />
                                    </div>
                                </div>
                            </div>
                            <Error />
                            {loginVisivble ?
                                <NavLink to="/users/login">
                                    <Button className="cta-button">Login</Button>
                                </NavLink>
                                :
                                <Button type="submit" className="cta-button">
                                    Add Book
                                </Button>
                            }
                        </>
                    </form>

                </>
            }
        />
    );
};
export default AddBookModal;