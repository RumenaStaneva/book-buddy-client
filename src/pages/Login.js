import { useState } from 'react';
import NavBar from '../components/NavBar'
import { useLogin } from '../hooks/useLogin';
import '../styles/Login.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();


    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(email, password);
        setEmail('');
        setPassword('');
    }

    return (
        <>
            <NavBar />
            <main className='login-signup-page'>
                <div className="mask"></div>

                <div className='wrapper login-form__container'>
                    <form action="/login" onSubmit={handleSubmit} method='POST'>
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

                        {error && <p className="form__error">{error}</p>}

                        <button type='submit' className='btn--cta' disabled={isLoading}>Sign in</button>
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