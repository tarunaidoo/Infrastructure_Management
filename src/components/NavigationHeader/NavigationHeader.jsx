import React from 'react';
import './NavigationHeader.css'; // External CSS file
import chevronIcon from '../../assets/icons/chevron-left.svg'

const Header = ({ title }) => {
  return (
    <div className="header">
      <img src={chevronIcon} alt="Back" className="chevron-icon" />
      <h1 className="header-title">{title}</h1>
    </div>
  );
};

export default Header;
