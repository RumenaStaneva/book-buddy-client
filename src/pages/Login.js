import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar'
import Button from '../components/Button';
import { useLogin } from '../hooks/useLogin';
import '../styles/AuthenticationForms.css'
import Error from '../components/Error';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { login, errorMessage, isLoading, setErrorMessage } = useLogin();


    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setIsLoggedIn(false); // Set isLoggedIn to false to prevent redirection
        }
    }

    return (
        <>
            <NavBar />
            {isLoggedIn ? (
                <Navigate to="/" />
            ) : (
                <main className='login-signup-page'>
                    <div className="mask"></div>

                    <div className='wrapper login-form__container'>
                        <form action="/users/login" onSubmit={handleSubmit} method='POST'>
                            <p className='form__message'>Welcome back!!!</p>
                            <h1>Login</h1>
                            <div className='form__group'>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" value={email} onChange={handleChangeEmail} />
                            </div>
                            <div className="form__group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" value={password} onChange={handleChangePassword} />
                            </div>
                            <p className='form__forgot-pass'>
                                <a href="/forgotten-password">Forgot password?</a>
                            </p>

                            {errorMessage.length > 0 ? (
                                <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                            ) : null}

                            <Button type='submit' className='btn--cta' disabled={isLoading}>Sign in</Button>
                            <p className='form-switch'>I don’t have an account ? <Link href="/users/sign-up">Sign up</Link></p>
                        </form>
                    </div>
                    <div className='wrapper'>
                        <div className='image__container'>
                            <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' width={570} height={487} />
                        </div>
                    </div>
                </main>
            )}
        </>
    )
}

export default Login;