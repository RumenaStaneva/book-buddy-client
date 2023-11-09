import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dropdown.css'

const Dropdown = ({ options, onSelect, selectedOption, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleOptionSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    const handleToggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div id={id} className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <div className="selected-option" onClick={handleToggleDropdown}>
                {selectedOption !== null ? selectedOption : 'Select an option'}
            </div>
            {isOpen && (
                <ul className="dropdown-options">
                    {options.map((option) => (
                        <li className='dropdown-option' key={option} onClick={() => handleOptionSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default Dropdown;
