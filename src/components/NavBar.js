import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css'

const NavBar = () => {
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
                    <li className='nav__item'>
                        <NavLink className='nav__link' to='/login'>Login</NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink className='nav__link' to='/sign-up'>Sign up</NavLink>
                    </li>
                </ul>

            </nav>
        </div>
    );
};

export default NavBar;