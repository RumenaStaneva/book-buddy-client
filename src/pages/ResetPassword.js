import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
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
                setMessage('Password reset successful!');
                setError('');
            } else {
                const data = await response.json();
                setError(data.error || 'Password reset failed.');
                setMessage('');
            }
        } catch (error) {
            setError('An error occurred while resetting the password.');
            setMessage('');
        }
    };

    return (
        <>
            <NavBar />
            <main>
                <h2>Reset Password</h2>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}
                <form onSubmit={handlePasswordReset}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" onClick={handlePasswordReset}>Reset Password</button>
                    {message && <Link to="/users/login">Login</Link>}
                </form>
            </main>
        </>
    );
};

export default ResetPassword;
