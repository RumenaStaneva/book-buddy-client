import { useState } from "react";
import { useAuthContext } from "./useAuthContext";


export const useSignup = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const LOCAL_HOST = process.env.REACT_APP_LOCAL_HOST;

    const signup = async (email, password, username) => {
        setIsLoading(true);
        setErrorMessage('');

        const response = await fetch(`${LOCAL_HOST}/users/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        });
        const json = await response.json();

        setIsLoading(false);

        if (!response.ok) {
            setIsLoading(false);
            setErrorMessage(json.error);
            throw Error(json.error)
        }

        if (response.ok) {
            setIsLoading(false);
            localStorage.setItem('user', JSON.stringify(json));

            dispatch({ type: 'CONFIRMATION_PENDING' });
            setIsLoading(false);

        }
    };

    return { signup, isLoading, errorMessage, setErrorMessage, setIsLoading }
};