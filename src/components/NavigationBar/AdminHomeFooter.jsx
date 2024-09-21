import React from 'react';
import Home from '../../assets/icons/house-2.svg';
import Square from '../../assets/icons/square-plus.svg';
import User from '../../assets/icons/user-filled.svg';
import Pencil from '../../assets/icons/pen-writing-filled.svg';
import './AdminHomeFooter.css';

function Footer({onHomeClick, onAddVenueClick, onEditVenueClick, onProfileClick}) {
  return (
    <footer className="admin-menuBar" data-testid="Footer-1">
      {/* Each image is wrapped in a button element */}
      <button className="admin-image-button" data-testid="home-btn" onClick={onHomeClick}>
        <img src={Home} alt="Home" className="main" data-testid="home-img" />
      </button>
      <button className="admin-image-button" data-testid="square-btn" onClick={onAddVenueClick}>
        <img src={Square} alt="Square" data-testid="square-img" />
      </button>
      <button className="admin-image-button" data-testid="edit-btn" onClick={onEditVenueClick}>
        <img src={Pencil} alt="Pencil" data-testid="edit-img"/>
      </button>
      <button className="admin-image-button" data-testid="user-btn" onClick={onProfileClick}>
        <img src={User} alt="User" data-testid="user-img"/>
      </button>
    </footer>
  );
}

export default Footer;