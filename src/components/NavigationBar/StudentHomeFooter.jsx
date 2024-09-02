import React from 'react';
import home from './assets/house-2.svg';
import square from './assets/square-plus.svg';
import horn from './assets/bullhorn.svg';
import user from './assets/user-filled.svg';

function Footer() {
  return (
    <footer className="MenuBar">
      {/* Each image is wrapped in a button element */}
      <button className="image-button">
        <img src={home} alt="Home" className="main" />
      </button>
      <button className="image-button">
        <img src={square} alt="Square" />
      </button>
      <button className="image-button">
        <img src={horn} alt="Horn" />
      </button>
      <button className="image-button">
        <img src={user} alt="User" />
      </button>
    </footer>
  );
}

export default Footer;
