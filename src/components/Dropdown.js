import React, { useState } from 'react';
import '../styles/Dropdown.css'

const Dropdown = ({ options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

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

    return (
        <div className="dropdown">
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
