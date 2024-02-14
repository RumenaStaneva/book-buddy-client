import React, { useEffect } from "react";
import Button from "./Button";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../reducers/errorSlice";
import { RootState } from "../store";

const Error = () => {
  const dispatch = useDispatch();
  const { errorMessage, hasError } = useSelector(
    (state: RootState) => state.error
  );
  useEffect(() => {
    // Dispatch clearError action when the component mounts or when error state changes
    dispatch(clearError());

    // Clean up the error when the component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]); // Dependency array ensures the effect runs when dispatch or error state changes

  return hasError ? (
    <div className="error-message__container">
      <p>{errorMessage}</p>

      <Button className="close-btn" onClick={() => dispatch(clearError())}>
        <IoIosClose strokeWidth={6} />
      </Button>
    </div>
  ) : null;
};

export default Error;
