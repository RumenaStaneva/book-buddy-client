import { useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import Error from "../components/Error";
import { useSignup } from "../hooks/useSignUp";
import '../styles/AuthenticationForms.css'
import Spinner from 'react-spinner-material';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [identicalPassords, setIdenticalPasswords] = useState(true);
    const [username, setUsername] = useState('');
    const [verificationEmailSent, setVerificationEmailSent] = useState(false);
    const { signup, signUpWithGoogleAuth, isLoading, setIsLoading } = useSignup();
    const dispatchError = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatchError(clearError());
        setIsLoading(true);
        if (password !== repeatPassword) {
            setIdenticalPasswords(false);
            dispatchError(setError({ message: 'Passwords should match' }));
            return;
        }
        try {
            await signup(email, password, username);
            setIdenticalPasswords(true);
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            setUsername('');
            setVerificationEmailSent(true);
        } catch (error) {
            setVerificationEmailSent(false);
            setIdenticalPasswords(true);
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            setUsername('');
        }
    }

    const signupWithGoogle = async (data) => {
        try {
            await signUpWithGoogleAuth(data);
        } catch (error) {
            console.log(error);
            dispatchError(setError({ message: error.message }));
        }
    }

    if (verificationEmailSent) {
        return <Navigate to='/verificate-email' />;
    }

    return (
        <>

            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    {isLoading ? (
                        <div className='spinner__container'>
                            <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                        </div>
                    ) : (
                        <form
                            action="/users/sign-up" method="POST"
                            onSubmit={handleSubmit}>
                            <p className='form__message'>Hi there!!!</p>
                            <h1>Sign Up</h1>
                            <div className='form__group'>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='form__group'>
                                <label htmlFor="username">Username</label>
                                <input type="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form__group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="form__group">
                                <label htmlFor="repeat-password">Repeat Password</label>
                                <input type="password" name="repeat-password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                            </div>

                            {!identicalPassords ?
                                <p className="form__error">Passwords should match</p>
                                : null}
                            <Error />
                            <Button type='submit' className='btn--cta' disabled={isLoading} onClick={handleSubmit}>Sign up</Button>

                            < p className='form-switch'>Already have an account ? <a href="/users/login">Login</a></p>
                            <div className="google-auth-btn__container">
                                <GoogleLogin
                                    buttonText="Sign in with Google"
                                    onSuccess={(response) => {
                                        signupWithGoogle(response);
                                    }} onError={error => dispatchError(setError({ message: error }))} />
                            </div>
                        </form>
                    )}
                </div>
                <div className='wrapper'>
                    <div className='image__container'>
                        <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' width={570} height={487} />
                    </div>
                </div>
            </main >
        </>
    )
}

export default SignUp;