import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css'
import Button from './Button';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { REACT_APP_DEFAULT_PROFILE_PICTURE } from '../functions';

const NavBar = () => {
    const [navVisible, setNavVisible] = useState(false);
    const { user, dispatch } = useAuthContext();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                dispatch({ type: 'LOGIN', payload: JSON.parse(e.newValue) });
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [dispatch]);

    const handleClick = () => {
        logout();
        navigate('/');
    }

    const toggleNav = () => {
        setNavVisible(!navVisible);
    };

    function useClickOutside(ref, callback) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [ref, callback]);
    }

    useClickOutside(navRef, () => {
        if (navVisible) {
            setNavVisible(false);
        }
    });

    if (navVisible) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.position = 'relative';
    }

    return (
        <div ref={navRef} className='nav__container'>
            <Button className='nav__burger' onClick={toggleNav}>
                <span className='burger__line'></span>
                <span className='burger__line'></span>
                <span className='burger__line'></span>
            </Button>
            <nav className={`nav nav__main ${navVisible ? 'nav--open' : ''}`} aria-label='Main'>
                <ul className='nav__list' role='menubar'>
                    <li className='nav__item' role="menuitem">
                        <NavLink className='nav__link' to="/">Home</NavLink>
                    </li>
                    <li className='nav__item' role="menuitem">
                        <NavLink className='nav__link' to="/about">About</NavLink>
                    </li>
                    {user ?
                        <>
                            <li className='nav__item' role="menuitem">
                                <NavLink className='nav__link' to="/time-swap">Time swap</NavLink>
                            </li>
                            <li className='nav__item' role="menuitem">
                                <NavLink className='nav__link' to="/books/library">Library</NavLink>
                            </li>
                        </>
                        : null
                    }
                </ul>
            </nav>
            {
                !user ?
                    <nav className='nav nav__login-register' aria-label='Login/Signup'>
                        <ul className='nav__list' role='menubar'>

                            <>
                                <li className='nav__item' role="menuitem">
                                    <NavLink className='nav__link' to='/users/login'>Login</NavLink>
                                </li>
                                <li className='nav__item' role="menuitem">
                                    <NavLink className='nav__link' to='/users/sign-up'>Sign up</NavLink>
                                </li>
                            </>
                        </ul>

                    </nav>
                    :
                    <nav className='nav nav__login-register registered' aria-label='Login/Signup'>
                        <ul className='nav__list' role='menubar'>
                            <>
                                {
                                    <a href='/users/profile' className='nav__profile-picture' role="menuitem">
                                        <img width={50} height={50} src={user.profilePicture ? user.profilePicture : REACT_APP_DEFAULT_PROFILE_PICTURE} alt="Profile" />
                                    </a>
                                }
                                <li className='nav__item' role="menuitem">
                                    <NavLink onClick={handleClick} className='nav__link' to='/'>Logout</NavLink>
                                </li>
                            </>
                        </ul>

                    </nav>
            }

        </div>
    );
};

export default NavBar;