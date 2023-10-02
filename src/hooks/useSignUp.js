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

    const signUpWithGoogleAuth = async (data) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/signup-with-google`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const json = await response.json();
                console.log(json.error);
                setErrorMessage(json.error);
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
            setErrorMessage(error.message);
        }
    }

    return { signup, signUpWithGoogleAuth, isLoading, errorMessage, setErrorMessage, setIsLoading }
};