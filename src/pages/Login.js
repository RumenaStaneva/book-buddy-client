import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar'
import Button from '../components/Button';
import { useLogin } from '../hooks/useLogin';
import '../styles/AuthenticationForms.css'
import Error from '../components/Error';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogleAuth, errorMessage, isLoading, setErrorMessage } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(emailOrUsername, password);
        } catch (error) {
            setErrorMessage(error)
        }
    }

    const loginWithGoogle = async (res) => {
        try {
            await loginWithGoogleAuth(res);
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    return (
        <>
            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form action="/users/login" onSubmit={handleSubmit} method='POST'>
                        <p className='form__message'>Welcome back!!!</p>
                        <h1>Login</h1>
                        <div className='form__group'>
                            <label htmlFor="emailOrUsername">Email / Username</label>
                            <input type="emailOrUsername" name="emailOrUsername" value={emailOrUsername} onChange={(e => setEmailOrUsername(e.target.value))} />
                        </div>
                        <div className="form__group">
                            <p className='form__forgot-pass'>
                                <a href="/users/forgot-password">Forgot password?</a>
                            </p>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {errorMessage.length > 0 ? (
                            <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                        ) : null}

                        <Button type='submit' className='btn--cta' disabled={isLoading}>Sign in</Button>
                        <p className='form-switch'>I don’t have an account ? <Link href="/users/sign-up">Sign up</Link></p>
                        <GoogleLogin

                            buttonText="Login with Google"
                            onSuccess={(response) => {
                                loginWithGoogle(response);
                            }} onError={error => setErrorMessage(error)}
                            cookiePolicy={'single_host_origin'} />
                    </form>
                </div>
                <div className='wrapper'>
                    <div className='image__container'>
                        <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' width={570} height={487} />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login;