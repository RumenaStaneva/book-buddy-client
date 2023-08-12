import { useState } from 'react';
import '../styles/Library.css'
import LinearProgressWithLabel from './Progress'
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/LibraryBook.css'


function LibraryBook({ book, currentlyReadingBooks, setCurrentlyReadingBooks, onRemoveFromWantToRead }) {
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

    const updateProgress = async (bookId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    bookId: bookId,
                    progress: bookPageProgress,
                }),
            });
            const data = await response.json();
            setBookPageProgress(data.book.progress)
            setInputVisible(false);
            const bookProgressPercent = calculateProgress()
            setBookProgressInPercentage(parseInt(bookProgressPercent));
            if (parseInt(data.book.progress) === parseInt(bookTotalPages)) {

                onRemoveFromWantToRead(data.book);
                moveToReadShelf(data.book._id);
                const updatedCurrentlyReadingBooks = currentlyReadingBooks.filter(b => b._id !== book._id);
                setCurrentlyReadingBooks(updatedCurrentlyReadingBooks);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const moveToReadShelf = async (bookId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-shelf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    bookId: bookId,
                    shelf: 2
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error updating shelf:', error);
        }
    };

    return (
        <>
            <div className='books__container'>
                {

                    <div className='book' key={book._id}>
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
                                <h5 className='book__title'>
                                    {book.title}
                                </h5>
                                <p> By: {' '}
                                    {book.authors}
                                </p>
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
                                        <button type='submit' onClick={() => updateProgress(book._id)}>Update</button>
                                    </>
                                ) : (
                                    <>
                                        <div className='book__progress'>
                                            <LinearProgressWithLabel value={bookProgressInPercentage != null ? bookProgressInPercentage : calculateProgress()} />
                                        </div>
                                        <p>{book.pageCount}</p>
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