import Button from './Button';
import { IoIosClose } from 'react-icons/io'

const Error = ({ message, onClose }) => {
    return (
        <div className="error-message__container">
            <p>{message}</p>

            <Button className="close-btn" onClick={onClose}>
                <IoIosClose />
            </Button>
        </div>
    );
};

export default Error;
