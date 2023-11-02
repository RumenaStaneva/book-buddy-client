import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar'
import Button from '../components/Button';
import { useLogin } from '../hooks/useLogin';
import '../styles/AuthenticationForms.css'
import Error from '../components/Error';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { setError } from '../reducers/errorSlice';
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogleAuth, isLoading } = useLogin();
    const dispatchError = useDispatch();
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const handleCaptchaVerify = (response) => {
        setIsCaptchaVerified(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isCaptchaVerified) {
            try {
                await login(emailOrUsername, password);
            } catch (error) {
                dispatchError(setError({ message: error }));
            }
        } else {
            dispatchError(setError({ message: 'Please verify that you are not a robot.' }));
        }
    }

    const loginWithGoogle = async (res) => {
        try {
            await loginWithGoogleAuth(res);
        } catch (error) {
            dispatchError(setError({ message: error.message }));
        }
    }

    console.log(process.env.REACT_APP_RECAPTCHA_SITE_KEY);

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
                            <input type="emailOrUsername" id='emailOrUsername' name="emailOrUsername" value={emailOrUsername} onChange={(e => setEmailOrUsername(e.target.value))} />
                        </div>
                        <div className="form__group">
                            <p className='form__forgot-pass'>
                                <a href="/users/forgot-password">Forgot password?</a>
                            </p>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Error />
                        <Button type='submit' className='btn--cta' disabled={isLoading}>Sign in</Button>
                        <p className='form-switch'>I don’t have an account ? <Link href="/users/sign-up">Sign up</Link></p>
                        <div className="google-auth-btn__container">
                            <GoogleLogin
                                buttonText="Login with Google"
                                onSuccess={(response) => {
                                    loginWithGoogle(response);
                                }} onError={error => dispatchError(setError({ message: error }))} />
                        </div>
                        <div className="recaptcha__container">

                            <ReCAPTCHA
                                sitekey='6LdKFeQoAAAAALujPMOEwbzB0ncL4hCMUoJEifDR'
                                onChange={handleCaptchaVerify}
                            />
                        </div>
                    </form>
                </div>
                <div className='wrapper'>
                    <div className='image__container'>
                        <img src='https://storage.googleapis.com/book-buddy/images/reading-buddies.png' role="presentation" alt='' />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login;