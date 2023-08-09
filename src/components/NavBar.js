import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css'
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const NavBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleClick = () => {
        logout();
    }
    return (
        <div className='nav__container'>
            <nav className='nav' aria-label='Main'>
                <ul className='nav__list' role='menubar'>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to="/">Home</NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to="/about">About</NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to="/time-swap">Time swap</NavLink>
                    </li>
                </ul>
            </nav >

            <nav className='nav nav__login-register' aria-label='Login/Signup'>
                <ul className='nav__list' role='menubar'>
                    {user && (
                        <>
                            <p className='nav__username'>Hi <a href='/users/profile'>{user.email.split('@')[0]}</a></p>
                            <li className='nav__item'>
                                <button onClick={handleClick} className='nav__link' to='/'>Logout</button>
                            </li>
                        </>
                    )}
                    {!user ?
                        <>
                            <li className='nav__item'>
                                <NavLink className='nav__link' to='/users/login'>Login</NavLink>
                            </li>
                            <li className='nav__item'>
                                <NavLink className='nav__link' to='/users/sign-up'>Sign up</NavLink>
                            </li>
                        </>
                        : null}
                </ul>

            </nav>
        </div>
    );
};

export default NavBar;