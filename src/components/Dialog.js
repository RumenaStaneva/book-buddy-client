import '../styles/Modal.css';
import Button from "./Button";
import { IoIosClose } from 'react-icons/io';
import { useDispatch } from "react-redux";
import { clearError } from '../reducers/errorSlice';

const Modal = ({ title, content, setIsOpen, subtitle, small, disableCloseButton }) => {
    const dispatchError = useDispatch();

    return (
        <>
            <div className={`darkBG ${small ? 'modal-sm' : ''}`} onClick={() => {
                if (!disableCloseButton) {
                    setIsOpen(false);
                    document.body.style.overflow = 'visible';
                }
            }} />
            <div className={`modal ${small ? 'modal-sm' : ''}`}>
                <div className="modalHeader">
                    <h2 className="modal-heading">{title}</h2>
                    <p>{subtitle}</p>
                </div>
                {!disableCloseButton ?
                    <Button aria-label='Close' className="closeBtn" onClick={() => {
                        setIsOpen(false);
                        dispatchError(clearError());
                        document.body.style.overflow = 'visible';

                    }}>
                        <IoIosClose />
                    </Button>
                    : null}
                <div className="modal-content__container">
                    <div className="modalContent">{content}</div>
                </div>
            </div>
        </>
    );
};

export default Modal;
