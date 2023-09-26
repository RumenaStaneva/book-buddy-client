import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Modal.css'
import Button from "./Button";
import Modal from './Dialog'
import Error from "./Error";

const ConformationModal = ({ bookId, setIsOpen }) => {

    const [errorMessage, setErrorMessage] = useState('');

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
            navigate('/books/library');
        } catch (error) {
            setErrorMessage(error.error);
        }
    }

    return (
        <Modal title={'Are you sure you want to delete this book?'}
            onClose={() => setIsOpen(false)}
            subtitle={`you sure?`}
            setIsOpen={setIsOpen}
            small={true}
            content={
                <div>
                    {errorMessage.length > 0 ? (
                        <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                    ) : null}
                    <div className="d-flex">
                        <Button onClick={() => setIsOpen(false)} className='cta-btn btn-sm cancel-btn'>Cancel</Button>
                        <Button onClick={deleteBook} className='cta-btn btn-sm cta-btn__alt'>Yes</Button>
                    </div>
                </div>
            }
        />

    )
}

export default ConformationModal;