import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useDispatch } from "react-redux";
import { setError } from '../reducers/errorSlice';
import { REACT_APP_LOCAL_HOST } from "../functions";

export const useSignup = () => {
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const LOCAL_HOST = REACT_APP_LOCAL_HOST;
    const dispatchError = useDispatch();

    const signup = async (email, password, username) => {
        setIsLoading(true);
        // dispatchError(clearError());

        const response = await fetch(`${LOCAL_HOST}/users/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        });
        const json = await response.json();

        setIsLoading(false);

        if (!response.ok) {
            setIsLoading(false);
            dispatchError(setError({ message: json.error }));
            throw Error(json.error)
        }

        if (response.ok) {
            setIsLoading(false);
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'CONFIRMATION_PENDING' });
            setIsLoading(false);
        }
    };

    const signUpWithGoogleAuth = async (data) => {
        try {
            const response = await fetch(`${REACT_APP_LOCAL_HOST}/users/signup-with-google`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const json = await response.json();
                dispatchError(setError({ message: json.error }));
                return;
            }
            const json = await response.json();
            if (response.ok) {
                setIsLoading(false);
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
                setIsLoading(false);
            }

        } catch (error) {
            dispatchError(setError({ message: error.message }));
        }
    }

    return { signup, signUpWithGoogleAuth, isLoading, setIsLoading }
};