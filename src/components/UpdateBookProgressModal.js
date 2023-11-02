import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Spinner from 'react-spinner-material';
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
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();
    const dispatch = useDispatch();

    const updateBook = async (bookRead) => {
        const updatedBook = { ...currentlyReadingBook };
        // setIsLoading(true);
        try {
            if (bookRead) {
                updatedBook.progress = updatedBook.pageCount;
            } else {
                updatedBook.progress = parseInt(updatedPageProgress);
            }
            console.log('updateBook', updatedBook);

            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/update-book`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(
                    updatedBook
                ),
            });
            const data = await response.json();
            if (!response.ok) {
                dispatchError(setError({ message: data.error }));
                setIsLoading(false);
                throw new window.Error(data.error);
            }

            setIsOpen(false);
            dispatch(setCurrentlyReadingBook(updatedBook));
            setUpdatedPageProgress(updatedBook.progress);
            dispatch(fetchAllBooks(user));
            if (data.book.progress >= data.book.pageCount) {
                dispatch(setSuccessMessage(`Hurray, you successfully read ${data.book.title}`));
                localStorage.setItem('activeIndex', 0);
            }
            document.body.style.overflow = 'visible';
            setIsLoading(false);
        } catch (error) {
            dispatchError(setError({ message: error.message }));
            console.error('Error updating book:', error);
            setIsLoading(false);
        }
    }

    const handleUpdateProgressClick = () => {
        setUpdatedPageProgress('');
    }

    return (
        <Modal title={'Update book progress'}
            onClose={() => { setIsOpen(false); document.body.style.overflow = 'visible'; }}
            subtitle={currentlyReadingBook.title}
            setIsOpen={setIsOpen}
            small={true}
            disableCloseButton={true}
            content={
                <div>
                    {isLoading &&
                        (<div className='spinner__container'>
                            <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                        </div>)}
                    <div className={`update-book__content ${isLoading ? 'd-none' : null}`}>
                        <label htmlFor="book-page-progress">Add your last read page:</label>
                        <input name='book-page-progress' type="number" value={updatedPageProgress} onClick={handleUpdateProgressClick} onChange={(e) => setUpdatedPageProgress(e.target.value)} />
                        <Error />
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