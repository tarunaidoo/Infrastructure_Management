import React from 'react';
import hat from '../../assets/icons/graduation-cap.svg';
import './HomePageHeader.css';

function StudentHeader(){
    return(
        <header className="header">
            <section className="headerBlock">
            <img src={hat} alt="Page Icon"></img>
            <h1>Home</h1>
            </section>
        </header>
    );
}
export default StudentHeader;