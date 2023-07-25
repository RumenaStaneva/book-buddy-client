import { useState } from "react";
import NavBar from "../components/NavBar";
import { useSignup } from "../hooks/useSignUp";
import '../styles/Login.css'

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [identicalPassords, setIdenticalPasswords] = useState(true);
    const { signup, error, isLoading, setError } = useSignup();

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleRepeatPassword = (e) => {
        setRepeatPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setIdenticalPasswords(false);
            setError(false);
            return;
        }
        await signup(email, password);
        setIdenticalPasswords(true);
        // setEmail('');
        // setPassword('');
        // setRepeatPassword('');
    }

    return (
        <>

            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form
                        //  action="/sign-up" method="POST" 
                        onSubmit={handleSubmit}>
                        <p className='form__message'>Hi there!!!</p>
                        <h1>Sign Up</h1>
                        <div className='form__group'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" value={email} onChange={handleChangeEmail} />
                        </div>
                        <div className="form__group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} onChange={handleChangePassword} />
                        </div>
                        <div className="form__group">
                            <label htmlFor="username">Repeat Password</label>
                            <input type="password" name="repeat-password" value={repeatPassword} onChange={handleRepeatPassword} />
                        </div>

                        {!identicalPassords ?
                            <p className="form__error">Passwords should match</p>
                            : null}
                        {error && <p className="form__error">{error}</p>}

                        <button type='submit' className='btn--cta' disabled={isLoading}>Sign up</button>

                        <p className='form-switch'>Already have an account ? <a href="/login">Login</a></p>
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

export default SignUp;