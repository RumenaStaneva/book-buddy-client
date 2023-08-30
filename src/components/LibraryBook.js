import { useState } from 'react';
import '../styles/Library.css'
import LinearProgressWithLabel from './Progress'
import { useAuthContext } from "../hooks/useAuthContext";
import { GiBookmarklet } from "react-icons/gi";
import categoryColors from "../constants/categoryColors";
import '../styles/LibraryBook.css'

function LibraryBook({ book, fetchBooks }) {
    const [inputVisible, setInputVisible] = useState(false);
    const [bookProgressInPercentage, setBookProgressInPercentage] = useState(null);
    const [bookPageProgress, setBookPageProgress] = useState(book.progress);
    const { user } = useAuthContext();

    const bookTotalPages = book.pageCount;

    const calculateProgress = () => {
        const totalPagesNumber = parseInt(bookTotalPages, 10);
        if (totalPagesNumber === 0) {
            return 0;
        }
        return Math.floor((bookPageProgress / totalPagesNumber) * 100);
    };

    const updateProgress = async (currentBook) => {
        try {
            currentBook.progress = parseInt(bookPageProgress);
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    book: currentBook
                }),
            });
            const data = await response.json();
            setBookPageProgress(data.book.progress);
            setInputVisible(false);
            const bookProgressPercent = calculateProgress();
            setBookProgressInPercentage(parseInt(bookProgressPercent));
            if (data.book.progress === parseInt(bookTotalPages)) {
                //         //TODO Make congarts disappearing message when book is read
                fetchBooks();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const categoryColor = categoryColors[book.category] || '#FFFFFF';

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
                                        ? require('../images/image-not-available.png')
                                        : `${book.thumbnail}`
                                } alt={`${book.title}`}
                                className='book__image'
                            />
                            <div className='book__details'>
                                <h5 className='book__title book-font__outline'>
                                    {book.title}
                                </h5>
                                <p className='book__authors'> By: {' '}
                                    {book.authors.map((author, index) => index === book.authors.length - 1 ? author : `${author}, `)}
                                </p>
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
                                        <label htmlFor="updatedProgress">Read pages: </label>
                                        <input
                                            type="number"
                                            name="updatedProgress"
                                            id="updatedProgress"
                                            value={bookPageProgress != null ? bookPageProgress : book.progress}
                                            onChange={(e) => setBookPageProgress(e.target.value)}
                                        />
                                        <button type='submit' onClick={() => updateProgress(book)}>Update</button>
                                    </>
                                ) : (
                                    <>
                                        <a
                                            onClick={event => {
                                                event.stopPropagation();
                                            }}
                                            href={`/books/book-details/${book._id}`}>See more</a>
                                        <div className='book__progress'>
                                            <LinearProgressWithLabel value={bookProgressInPercentage != null ? bookProgressInPercentage : calculateProgress()} />
                                        </div>
                                        <button onClick={() => setInputVisible(true)}>Update progress</button>
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

export default LibraryBook;