import '../styles/Modal.css';
import React, { createContext, useEffect, createRef } from "react";
import { IoIosClose } from 'react-icons/io';
import { useDispatch, useSelector } from "react-redux";
import { clearError } from '../reducers/errorSlice';
import { createPortal } from "react-dom";
import Button from "./Button";

const modalContext = createContext();


export default function Modal({ title, content, setIsOpen, subtitle, small, disableCloseButton, previousElement }) {
    const dispatchError = useDispatch();
    const modalRef = createRef();
    const { hasError } = useSelector((state) => state.error);


    // console.log('modalRef.current', modalRef.current);
    useEffect(() => {
        const focusableModalElements = modalRef.current.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="number"], select, input[type="file"], div.selected-option, .error-message__container.close-btn'
        );
        //this is confusing  my upload so dont use it
        if (focusableModalElements.length > 0 && !hasError) {

            focusableModalElements[0].focus();
        }

        if (focusableModalElements.length > 0 && hasError) {

            focusableModalElements[focusableModalElements.length - 2].focus();
        }

        const handleTabKey = (e) => {
            const firstElement = focusableModalElements[0];
            const lastElement = focusableModalElements[focusableModalElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // If shift key is pressed, focus on the previous element
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    // If shift key is not pressed, focus on the next element
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        const keyListenersMap = new Map([[27, () => {
            setIsOpen(false);
            dispatchError(clearError());
            document.body.style.overflow = 'visible';
            previousElement.focus();
        }], [9, handleTabKey]]);

        const keyListener = (e) => {
            const listener = keyListenersMap.get(e.keyCode);
            listener && listener(e);
        };

        document.addEventListener("keydown", keyListener);

        return () => {
            document.removeEventListener("keydown", keyListener);
        };
    }, [setIsOpen, dispatchError, modalRef, hasError, previousElement]);

    return createPortal(
        <>
            <div className={`darkBG ${small ? 'modal-sm' : ''}`} onClick={() => {
                if (!disableCloseButton) {
                    setIsOpen(false);
                    previousElement.focus();
                    document.body.style.overflow = 'visible';
                }
            }} />
            <div className={`modal ${small ? 'modal-sm' : ''}`} role="dialog" aria-modal="true" ref={modalRef}
            // onFocus={handleTabKey}
            >
                {!disableCloseButton ?
                    <Button aria-label='Close' className="closeBtn" onClick={() => {
                        setIsOpen(false);
                        previousElement.focus();
                        dispatchError(clearError());
                        document.body.style.overflow = 'visible';
                    }}>
                        <IoIosClose />
                    </Button>
                    : null}
                <div className="modalHeader">
                    <h2 className="modal-heading">{title}</h2>
                    <p>{subtitle}</p>
                </div>
                <div className="modal-content__container">
                    <div className="modalContent">
                        <modalContext.Provider value={{ setIsOpen }}>
                            {content}
                        </modalContext.Provider>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};


