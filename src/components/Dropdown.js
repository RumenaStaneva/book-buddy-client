import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/Dropdown.scss'

const Dropdown = ({ options, onSelect, selectedOption, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownOptionRef = useRef(null);

    const handleOptionSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
        // console.log('dropdownRef.current', dropdownRef.current);
        // dropdownRef.current.focus();

        // Find the index of the currently focused element
        const focusableModalElements = dropdownOptionRef.current.closest('.modal').querySelectorAll('a, button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="number"], select, input[type="file"], div.selected-option');
        const currentIndex = Array.from(focusableModalElements).indexOf(dropdownOptionRef.current);
        // console.log('dropdownOptionRef.current', dropdownOptionRef.current);
        // console.log('currentIndex', currentIndex);
        // Focus on the next element
        const nextIndex = currentIndex + 1;
        const nextElement = focusableModalElements[nextIndex];
        // console.log('nextElement', nextElement);
        if (nextElement) {
            nextElement.focus();
        }

        onSelect(option);

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

    const handleTabKey = useCallback(
        (e) => {
            const focusableModalElements = dropdownRef.current.querySelectorAll('li');
            if (e.key === 'Tab') {
                if (isOpen) {
                    setIsOpen(false);
                    dropdownRef.current.focus();
                }
            } else if (e.key === 'ArrowDown') {
                const firstElement = focusableModalElements[0];
                const lastElement =
                    focusableModalElements[focusableModalElements.length - 1];

                // If down arrow is pressed, focus on the next element
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                } else {
                    const nextIndex = Array.from(focusableModalElements).indexOf(document.activeElement) + 1;
                    focusableModalElements[nextIndex]?.focus();
                    e.preventDefault();
                }
            } else if (e.key === 'ArrowUp') {
                const firstElement = focusableModalElements[0];
                const lastElement =
                    focusableModalElements[focusableModalElements.length - 1];

                // If up arrow is pressed, focus on the previous element
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else {
                    const prevIndex = Array.from(focusableModalElements).indexOf(document.activeElement) - 1;
                    focusableModalElements[prevIndex]?.focus();
                    e.preventDefault();
                }
            }
        },
        [dropdownRef, isOpen]
    );


    const keyListenersMap = new Map([[27, setIsOpen], [40, handleTabKey], [38, handleTabKey], [9, handleTabKey]]);

    useEffect(() => {
        function keyListener(e) {
            const listener = keyListenersMap.get(e.keyCode);
            return listener && listener(e);
        }

        document.addEventListener("keydown", keyListener);

        return () => document.removeEventListener("keydown", keyListener);
    });

    return (
        <div id={id} className={`dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <div ref={dropdownOptionRef} className="selected-option" onClick={handleToggleDropdown} tabIndex={0} onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    handleToggleDropdown();
                    handleTabKey(e);
                }
            }}>
                {selectedOption !== null ? selectedOption : 'Select an option'}
            </div>
            {isOpen && (
                <ul className="dropdown-options" role="listbox" aria-multiselectable={false}>
                    {options.map((option) => (
                        <li tabIndex={0} className='dropdown-option' key={option} onClick={() => handleOptionSelect(option)} role="option" onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                handleOptionSelect(option);
                                // setIsOpen(false);
                            }
                        }}
                            aria-selected={selectedOption === option} >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default Dropdown;
