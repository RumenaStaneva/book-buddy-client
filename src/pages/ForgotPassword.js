import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const dispatchError = useDispatch();

    const handleResetRequest = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                dispatchError(clearError());
            } else {
                setMessage('');
                dispatchError(setError({ message: 'Error: Unable to request password reset.' }));
            }
        } catch (err) {
            setMessage('');
            dispatchError(setError({ message: 'Error: Unable to request password reset.' }));
            console.log(err);
        }
    };


    return (
        <>
            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form action="/users/forgot-password" onSubmit={handleResetRequest} method='POST'>
                        <h1>Forgot Password</h1>
                        <p className="form__message">Please provide your email and we will send you link for resetting your password</p>
                        <div className='form__group'>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className='btn--cta'>Reset Password</button>
                        {message && <div className="success-message__container">
                            <p> {message} </p>
                        </div>}
                        <Error />
                        <p className='form-switch'><Link to="/users/login">Back to Login</Link></p>
                    </form>

                </div>
                <div className='wrapper'>
                    <div className='image__container'>
                        <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' width={570} height={487} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default ForgotPassword;
