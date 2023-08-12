import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css'
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const NavBar = () => {
    const [navVisible, setNavVisible] = useState(false);
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate('/');
    }

    const toggleNav = () => {
        setNavVisible(!navVisible);
    };

    return (
        <div className='nav__container'>
            <button className='nav__burger' onClick={toggleNav}>
                <span className='burger__line'></span>
                <span className='burger__line'></span>
                <span className='burger__line'></span>
            </button>
            <nav className={`nav nav__main ${navVisible ? 'nav--open' : ''}`} aria-label='Main'>
                <ul className='nav__list' role='menubar'>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to="/">Home</NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to="/about">About</NavLink>
                    </li>
                    {user ?
                        <>
                            <li className='nav__item'>
                                <NavLink className='nav__link' to="/time-swap">Time swap</NavLink>
                            </li>
                            <li className='nav__item'>
                                <NavLink className='nav__link' to="/books/library">Library</NavLink>
                            </li>
                        </>
                        : null
                    }
                </ul>
            </nav>

            <nav className='nav nav__login-register' aria-label='Login/Signup'>
                <ul className='nav__list' role='menubar'>
                    {user && (
                        <>
                            <p className='nav__username'>Hi <a href='/users/profile'>{user.username !== '' ? user.username : user.email.split('@')[0]}</a></p>
                            <li className='nav__item'>
                                <NavLink onClick={handleClick} className='nav__link' to='/'>Logout</NavLink>
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