import React from 'react';
import Button from './Button';
import { IoIosClose } from 'react-icons/io'
import { useDispatch, useSelector } from "react-redux";
import { clearError } from '../reducers/errorSlice';

const Error = React.forwardRef((props, ref) => {
    const dispatchError = useDispatch();
    const { errorMessage, hasError } = useSelector((state) => state.error)

    return (
        hasError ?
            <div ref={ref} className="error-message__container">
                <p>{errorMessage}</p>

                <Button className="close-btn" onClick={() => dispatchError(clearError())}>
                    <IoIosClose />
                </Button>
            </div>
            : null
    );
});

export default Error;
