import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { dispatch } = useAuthContext();
    const LOCAL_HOST = process.env.REACT_APP_LOCAL_HOST;

    const login = async (emailOrUsername, password) => {
        setIsLoading(true);
        setErrorMessage('');

        const response = await fetch(`${LOCAL_HOST}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });
        const json = await response.json();
        if (!response.ok) {
            setIsLoading(false);
            setErrorMessage(json.error);
        }

        if (response.ok) {
            setIsLoading(false);
            //save user to lacal storage -> in userController when we sign up user we send email and token in json
            localStorage.setItem('user', JSON.stringify(json));

            //update auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        }
    };

    return { login, isLoading, errorMessage, setErrorMessage }
};