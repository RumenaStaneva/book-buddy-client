import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const dispatchError = useDispatch();

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            dispatchError(setError({ message: 'Passwords do not match' }));
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/users/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {
                toast.success(`Password reset successful!`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
                setMessage('Password reset successful!');
                dispatchError(clearError());
            } else {
                const data = await response.json();
                dispatchError(setError({ message: data.error || 'Password reset failed.' }));
                setMessage('');
            }
        } catch (error) {
            dispatchError(setError({ message: 'An error occurred while resetting the password.' }))
            setMessage('');
        }
    };

    return (
        <>
            <NavBar />
            <ToastContainer />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form action="/users/reset-password" onSubmit={handlePasswordReset} method='POST'>
                        <h1>Reset Password</h1>
                        <div className='form__group'>
                            <label>New Password:</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form__group'>

                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className='btn--cta' onClick={handlePasswordReset}>Reset Password</button>
                        {message && <div className="success-message__container">
                            <Link to="/users/login">Login</Link>
                        </div>}
                        <Error />
                    </form>

                </div>
                <div className='wrapper'>
                    <div className='image__container'>
                        <img src='https://storage.googleapis.com/book-buddy/images/reading-buddies.png' tabIndex={-1} alt='' width={570} height={487} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default ResetPassword;
