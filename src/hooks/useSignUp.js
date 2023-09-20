import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { Navigate } from "react-router-dom";


export const useSignup = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const LOCAL_HOST = process.env.REACT_APP_LOCAL_HOST;

    const signup = async (email, password) => {
        setIsLoading(true);
        setErrorMessage('');

        const response = await fetch(`${LOCAL_HOST}/users/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const json = await response.json();

        setIsLoading(false); // Move setIsLoading(false) here to ensure it's always reset

        if (!response.ok) {
            setIsLoading(false);
            console.log(json.error);
            setErrorMessage(json.error);
            throw Error(json.error)
        }

        if (response.ok) {
            setIsLoading(false);
            //save user to local storage -> in userController when we sign up user we send email and token in json
            localStorage.setItem('user', JSON.stringify(json));

            //update auth context
            dispatch({ type: 'CONFIRMATION_PENDING' });
            setIsLoading(false);
            <Navigate to="/verificate-email" />
        }
    };

    return { signup, isLoading, errorMessage, setErrorMessage, setIsLoading }
};