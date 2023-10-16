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
                    setIsOpen(false)
                }
            }} />
            <div className={`modal ${small ? 'modal-sm' : ''}`}>
                <div className="modalHeader">
                    <h3 className="heading">{title}</h3>
                    <p>{subtitle}</p>
                </div>
                {!disableCloseButton ?
                    <Button className="closeBtn" onClick={() => {
                        setIsOpen(false);
                        dispatchError(clearError());
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
