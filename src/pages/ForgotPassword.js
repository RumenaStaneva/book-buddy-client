import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
                setError('');
            } else {
                setMessage('');
                setError('Error: Unable to request password reset.');
            }
        } catch (err) {
            setMessage('');
            setError('Error: Unable to request password reset.');
            console.log(err);
        }
    };


    return (
        <>
            <NavBar />
            <main>
                <h2>Forgot Password</h2>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleResetRequest}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
                <Link to="/users/login">Back to Login</Link>
            </main>
        </>
    );
};

export default ForgotPassword;
