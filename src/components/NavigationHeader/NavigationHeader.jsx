import React from 'react';
import './NavigationHeader.css'; // External CSS file
import chevronIcon from '../../assets/icons/chevron-left.svg'

const Header = ({ title, onClick }) => {
  return (
    <main className="navheader" data-testid="NavigationHeader-1">
      <img onClick={onClick} src={chevronIcon} alt="Back" className="chevron-icon" />
      <h1 onClick={onClick} className="header-title">{title}</h1>
    </main>
  );
};

export default Header;
