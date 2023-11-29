import { useState } from 'react';
import '../styles/Library.scss'
import Button from './Button';
import LinearProgressWithLabel from './Progress'
import { useAuthContext } from "../hooks/useAuthContext";
import { GiBookmarklet } from "react-icons/gi";
import categoryColors from "../constants/categoryColors";
import { AiOutlineArrowRight } from "react-icons/ai";
import '../styles/LibraryBook.scss'
import { useDispatch } from "react-redux";
import { fetchAllBooks, calculateProgress } from '../reducers/booksSlice';
import { clearError, setError } from '../reducers/errorSlice';

function LibraryBookSlider({ book, handleSuccessMessage }) {
    const [inputVisible, setInputVisible] = useState(false);
    const [bookProgressInPercentage, setBookProgressInPercentage] = useState(null);
    const [bookPageProgress, setBookPageProgress] = useState(book.progress);
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const dispatchError = useDispatch();
    const bookTotalPages = book.pageCount;

    const updateProgress = async (currentBook, bookRead) => {
        try {
            const mutableBook = { ...currentBook };
            if (bookRead) {
                mutableBook.progress = mutableBook.pageCount;
            } else {
                mutableBook.progress = parseInt(bookPageProgress);
            }
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(
                    mutableBook
                ),
            });
            const data = await response.json();
            if (response.ok) {
                setBookPageProgress(data.book.progress);
                setInputVisible(false);
                const bookProgressPercent = calculateProgress(bookPageProgress, bookTotalPages);
                setBookProgressInPercentage(parseInt(bookProgressPercent));
                if (data.book.progress >= parseInt(bookTotalPages)) {
                    handleSuccessMessage(`Hurray, you successfully read ${data.book.title}`);
                    dispatchRedux(fetchAllBooks(user))
                }
                dispatchError(clearError());
            } else {
                dispatchError(setError({ message: data.message }))
            }
        } catch (error) {
            dispatchError(setError({ message: `Error fetching book's data ${error.message}` }))
            console.error('Error fetching book`s data:', error);
        }
    }

    const categoryColor = categoryColors[book.category] || '#FFFFFF';

    const handleUpdateProgressClick = () => {
        setBookPageProgress('');
    }

    return (
        <>
            <div className='books__container currently-reading__container'>
                {
                    <div className='book'>
                        <div className='blur-background' style={{ backgroundImage: `url(${book.thumbnail})` }}></div>
                        <div
                            className='book__button'
                            onClick={event => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                        >
                            <img
                                src={
                                    book.thumbnail === undefined
                                        ? 'https://storage.googleapis.com/book-buddy/images/image-not-available.png'
                                        : `${book.thumbnail}`
                                } alt={`${book.title}`}
                                className='book__image'
                            />
                            <div className='book__details'>
                                {/* <Error /> */}
                                <h3 className='book__title book-font__outline'>
                                    {book.title}
                                </h3>

                                {book.authors.length > 0 ?

                                    <p className='book__authors'> By: {' '}
                                        {book.authors?.join(', ')}
                                    </p> : null}
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
                                {inputVisible ? (
                                    <>
                                        <div className='book__progress'>
                                            <label htmlFor="updatedProgress">Read pages: </label>
                                            <input
                                                type="number"
                                                name="updatedProgress"
                                                id="updatedProgress"
                                                value={bookPageProgress != null ? bookPageProgress : book.progress}
                                                onChange={(e) => setBookPageProgress(e.target.value)}
                                                onClick={handleUpdateProgressClick}
                                            />
                                        </div>
                                        <div className="d-flex">
                                            <Button className='cta-btn btn-sm cta-btn__alt' onClick={() => updateProgress(book, true)}>I've read this book</Button>
                                            <Button className='cta-btn btn-sm' type='submit' onClick={() => updateProgress(book)}>Update</Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <a
                                            className='book__see-more'
                                            onClick={event => {
                                                event.stopPropagation();
                                            }}
                                            href={`/books/book-details/${book._id}`}>See more details <AiOutlineArrowRight /></a>
                                        <div className='book__progress'>
                                            <LinearProgressWithLabel value={bookProgressInPercentage != null ? bookProgressInPercentage : calculateProgress(bookPageProgress, bookTotalPages)} />
                                        </div>
                                        <Button className='cta-btn' onClick={() => setInputVisible(true)}>Update progress</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                }
            </div >
        </>
    )

}

export default LibraryBookSlider;