import '../styles/Footer.css';
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content d-flex">
                <div className="logo-container">
                    <img className="logo" src='https://storage.googleapis.com/book-buddy/images/logo.png' />
                </div>
                <div className="social-icons d-flex">
                    <NavLink to="https://github.com/RumenaStaneva" target="_blank" rel="noopener noreferrer">
                        <FaGithub className='icon' />
                    </NavLink>
                    <NavLink to="https://www.linkedin.com/in/rumena-staneva" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className='icon' />
                    </NavLink>
                    <p>&copy; 2023 Book Buddy. All rights reserved.</p>
                </div>
            </div>
        </div>

    );
};

export default Footer;
