import '../styles/Modal.css';
import Button from "./Button";
import { IoIosClose } from 'react-icons/io'

const Modal = ({ title, content, setIsOpen, subtitle }) => {
    return (
        <>
            <div className="darkBG" onClick={() => setIsOpen(false)} />
            {/* <div className="centered"> */}
            <div className="modal">
                <div className="modalHeader">
                    <h3 className="heading">{title}</h3>
                    <p>{subtitle}</p>
                </div>
                <Button className="closeBtn" onClick={() => setIsOpen(false)}>
                    <IoIosClose />
                </Button>
                <div className="modal-content__container">
                    <div className="modalContent">{content}</div>
                </div>
            </div>
            {/* </div> */}
        </>
    );
};

export default Modal;
