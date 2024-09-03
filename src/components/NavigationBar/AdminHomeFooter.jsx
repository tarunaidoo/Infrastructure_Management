import React from 'react';
import Home from '../../assets/icons/house-2.svg';
import Square from '../../assets/icons/square-plus.svg';
import User from '../../assets/icons/user-filled.svg';
import './AdminHomeFooter.css';

function Footer() {
  return (
    <footer className="MenuBar" data-testid="Footer-1">
      {/* Each image is wrapped in a button element */}
      <button className="image-button" data-testid="home-btn">
        <img src={Home} alt="Home" className="main" data-testid="home-img" />
      </button>
      <button className="image-button" data-testid="square-btn">
        <img src={Square} alt="Square" data-testid="square-img" />
      </button>
      <button className="image-button" data-testid="user-btn">
        <img src={User} alt="User" data-testid="user-img"/>
      </button>
    </footer>
  );
}

export default Footer;