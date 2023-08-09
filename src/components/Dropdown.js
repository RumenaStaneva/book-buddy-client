import React, { useState, useEffect, useRef } from 'react';
import '../styles/Dropdown.css'

const Dropdown = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onSelect) {
            onSelect(option);
        }
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
        <div className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <div className="selected-option" onClick={handleToggleDropdown}>{selectedOption || 'Select an option'}</div>
            {isOpen ?
                <ul className="dropdown-options">
                    {options.map((option) => (
                        <li className='dropdown-option' key={option} onClick={() => handleOptionSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
                : null}
        </div>
    );
};

export default Dropdown;
