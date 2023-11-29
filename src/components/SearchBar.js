import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import pages from '../data';
import '../styles/SearchBar.scss'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showError, setShowError] = useState(false);

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setShowError(true);
            setSearchResults([]);
        } else {
            setShowError(false);
            const filteredResults = pages.filter((page) => {
                const titleMatch = page.title && page.title.toLowerCase().includes(term.toLowerCase());
                return titleMatch;
            });

            setSearchResults(filteredResults);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
                className="search-bar__input"
            />

            {searchResults.length > 0 ? (
                <ul className="search-bar__results-list">
                    {searchResults.map((page) => (
                        <li key={page.id} className="search-bar__result-item">
                            <NavLink to={`${page.link}`} className="search-bar__result-title">
                                {page.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            ) : (
                searchTerm.trim() !== '' && <p>No results found.</p>
            )}

            {showError ?
                <p className="search-bar__error-message">Plese enter valid input</p>
                : null}
        </div>
    );
};

export default SearchBar;
