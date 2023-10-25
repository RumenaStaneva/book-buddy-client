import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Modal.css'
import { useDispatch, useSelector } from "react-redux";
import { setError } from '../reducers/errorSlice';
import Button from "./Button";
import Modal from './Dialog'
import Error from "./Error";
import { setCurrentlyReadingBook, setSuccessMessage } from '../reducers/timerSlice';
import { fetchAllBooks } from '../reducers/booksSlice';

const UpdateBookProgressModal = ({ setIsOpen }) => {
    const { currentlyReadingBook } = useSelector((state) => state.timer)
    const [updatedPageProgress, setUpdatedPageProgress] = useState(currentlyReadingBook.progress)
    const { user } = useAuthContext();
    const dispatchError = useDispatch();
    const dispatch = useDispatch();

    const updateBook = async (bookRead) => {
        const updatedBook = { ...currentlyReadingBook };
        try {
            if (bookRead) {
                updatedBook.progress = updatedBook.pageCount
            } else {
                updatedBook.progress = parseInt(updatedPageProgress);
            }
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

            const data = await response.json();
            setIsOpen(false);
            dispatch(setCurrentlyReadingBook(updatedBook));
            setUpdatedPageProgress(updatedBook.progress);
            dispatch(fetchAllBooks(user));
            if (data.book.progress >= data.book.pageCount) {
                dispatch(setSuccessMessage(`Hurray, you successfully read ${data.book.title}`));
                localStorage.setItem('activeIndex', 0);
            }
        } catch (error) {
            dispatchError(setError({ message: `Error updating book: ${error}` }));
            console.error('Error updating book:', error);
        }
    }

    const handleUpdateProgressClick = () => {
        setUpdatedPageProgress('');
    }

    return (
        <Modal title={'Update book progress'}
            onClose={() => setIsOpen(false)}
            subtitle={currentlyReadingBook.title}
            setIsOpen={setIsOpen}
            small={true}
            disableCloseButton={true}
            content={
                <div>
                    <Error />
                    <div className="update-book__content">
                        <label htmlFor="book-page-progress">Add your last read page:</label>
                        <input name='book-page-progress' type="number" value={updatedPageProgress} onClick={handleUpdateProgressClick} onChange={(e) => setUpdatedPageProgress(e.target.value)} />
                        <div className="d-flex">
                            <Button className='cta-btn btn-sm cta-btn__alt' onClick={() => updateBook(true)}>I've read this book</Button>
                            <Button onClick={() => updateBook(false)} className='cta-btn btn-sm'>Update</Button>
                        </div>
                    </div>
                </div>
            }
        />

    )
}

export default UpdateBookProgressModal;