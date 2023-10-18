import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'CONFIRMATION_PENDING':
            return { user: null, isConfirmationPending: true };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            const token = user.token;
            if (token && typeof token === 'string') {
                const tokenParts = token.split('.');

                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const expDate = payload.exp * 1000;
                    const dateNow = Date.now();

                    if (dateNow >= expDate) {
                        dispatch({ type: 'LOGOUT' })
                        return;
                    }

                    dispatch({ type: 'LOGIN', payload: user });
                } else {
                    console.error('Invalid JWT token format');
                }
            } else {
                console.error('Invalid or missing JWT token');
            }
            dispatch({ type: 'LOGIN', payload: user })
        }
    }, [])

    // console.log('AuthContext state: ', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
};