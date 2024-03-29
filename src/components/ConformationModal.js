import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Modal.scss'
import { useDispatch } from "react-redux";
import { setError } from '../reducers/errorSlice';
import Button from "./Button";
import Modal from './Dialog'
import Error from "./Error";

const ConformationModal = ({ bookId, setIsOpen, previousElement }) => {
    const dispatchError = useDispatch();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const deleteBook = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/delete-book?bookId=${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });

            await response.json();
            setIsOpen(false);
            document.body.style.overflow = 'visible';
            navigate('/books/library');
        } catch (error) {
            dispatchError(setError({ message: error.error }));
        }
    }

    return (
        <Modal title={'Are you sure you want to delete this book?'}
            onClose={() => setIsOpen(false)}
            subtitle={`Are you sure?`}
            setIsOpen={setIsOpen}
            small={true}
            previousElement={previousElement}
            content={
                <div>
                    <Error />
                    <div className="d-flex">
                        <Button onClick={() => { setIsOpen(false); document.body.style.overflow = 'visible'; }} className='cta-btn btn-sm cancel-btn'>Cancel</Button>
                        <Button onClick={deleteBook} className='cta-btn btn-sm cta-btn__alt'>Yes</Button>
                    </div>
                </div>
            }
        />

    )
}

export default ConformationModal;