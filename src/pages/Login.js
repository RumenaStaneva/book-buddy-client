import { useState } from 'react';
import '../styles/Login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefaut();
        setUsername('');
        setPassword('');
    }

    return (
        <>
            <main>
                <div className='form__container'>
                    <form action="/login" onSubmit={handleSubmit}>
                        <p className='form__message'>Welcome back!!!</p>
                        <h1>Sign in</h1>
                        <div className='form__group'>
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" value={username} onChange={handleChangeUsername} />
                        </div>
                        <div className="form__group">
                            <label htmlFor="username">Password</label>
                            <input type="password" name="password" value={password} onChange={handleChangePassword} />
                        </div>
                        <p className='form__forgot-pass'>
                            <a href="/forgotten-password">Forgotten password?</a>
                        </p>

                        <button type='submit'>Sign in</button>
                    </form>
                </div>
                <div>
                    <div className='image__container'>

                        <img src={require("../images/reading-buddies.png")} tabIndex={-1} alt='' />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login;