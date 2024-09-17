import React from 'react';
import home from '../../assets/icons/house-2.svg';
import square from '../../assets/icons/square-plus.svg';
import horn from '../../assets/icons/bullhorn.svg';
import user from '../../assets/icons/user-filled.svg';
import './HomePageFooter.css';

function StudentFooter({ onBookVenueClick, onReportIssueClick }) {
  return (
    <footer className="MenuBar">
      {/* Each image is wrapped in a button element */}
      <button className="image-button">
        <img src={home} alt="Home" className="main" />
      </button>
      <button onClick={onBookVenueClick} className="image-button">
        <img src={square} alt="Square" />
      </button>
      <button onClick={onReportIssueClick} className="image-button">
        <img src={horn} alt="Horn" />
      </button>
      <button className="image-button">
        <img src={user} alt="User" />
      </button>
    </footer>
  );
}

export default StudentFooter;
