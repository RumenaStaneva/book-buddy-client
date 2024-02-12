import React from "react";
import PropTypes from "prop-types";

type TitleProp = {
  title: string;
};

function Header({ title }: TitleProp) {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
