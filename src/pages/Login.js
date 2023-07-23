import { useState } from 'react';
import NavBar from '../components/NavBar'
import '../styles/Login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefaut();
        setEmail('');
        setPassword('');
    }

    return (
        <>
            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form action="/login" onSubmit={handleSubmit}>
                        <p className='form__message'>Welcome back!!!</p>
                        <h1>Sign in</h1>
                        <div className='form__group'>
                            <label htmlFor="email">Email</label>
                            <input type="text" name="email" value={email} onChange={handleChangeEmail} />
                        </div>
                        <div className="form__group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} onChange={handleChangePassword} />
                        </div>
                        <p className='form__forgot-pass'>
                            <a href="/forgotten-password">Forgot password?</a>
                        </p>

                        <button type='submit' className='btn--cta'>Sign in</button>

                        <p className='form-switch'>I don’t have an account ? <a href="/sign-up">Sign up</a></p>
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