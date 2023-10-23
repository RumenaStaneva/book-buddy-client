import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const LOCAL_HOST = process.env.REACT_APP_LOCAL_HOST;
    const dispatchError = useDispatch();

    const login = async (emailOrUsername, password) => {
        setIsLoading(true);
        dispatchError(clearError());

        const response = await fetch(`${LOCAL_HOST}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });
        const json = await response.json();
        if (!response.ok) {
            setIsLoading(false);
            dispatchError(setError({ message: json.error }));

        }

        if (response.ok) {
            setIsLoading(false);
            //save user to local storage -> in userController when we sign up user we send email and token in json
            localStorage.setItem('user', JSON.stringify(json));

            //update auth context
            dispatch({ type: 'LOGIN', payload: json });

            setIsLoading(false);
        }
    };

    const loginWithGoogleAuth = async (data) => {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/login-with-google`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        if (!response.ok) {
            setIsLoading(false);
            dispatchError(setError({ message: json.error }));
        }

        if (response.ok) {
            setIsLoading(false);
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    }

    return { login, loginWithGoogleAuth, isLoading }
};