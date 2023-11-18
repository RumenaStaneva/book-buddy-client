import '../styles/Footer.css';
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content d-flex">
                <div className="logo-container">
                    <img className="logo" src='https://storage.googleapis.com/book-buddy/images/logo.png' alt='logo' />
                </div>
                <div className="social-icons d-flex">
                    <div className="d-flex">
                        <NavLink to="https://github.com/RumenaStaneva" target="_blank" rel="noopener noreferrer" aria-label='Github repo'>
                            <FaGithub className='icon' />
                        </NavLink>
                        <NavLink to="https://www.linkedin.com/in/rumena-staneva" target="_blank" rel="noopener noreferrer" aria-label='Linkedin'>
                            <FaLinkedinIn className='icon' />
                        </NavLink>
                    </div>
                    <NavLink className='privacy-policy-link' to={'/privacy-policy'}>Privacy Policy</NavLink>
                    <p>&copy; 2023 Book Buddy. All rights reserved.</p>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
