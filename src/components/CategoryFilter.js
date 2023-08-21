import React from 'react';
import Dropdown from './Dropdown';

function CategoryFilter({ categories, onSelect }) {
    const handleSelect = (selectedCategory) => {
        if (selectedCategory === "Select an option") {
            onSelect("");
        } else {
            onSelect(selectedCategory);
        }
    };

    const dropdownOptions = ["Select an option", ...categories];

    return (
        <Dropdown options={dropdownOptions} onSelect={handleSelect} />
    );
}

export default CategoryFilter;
