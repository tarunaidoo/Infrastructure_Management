import React from 'react';
import hat from './assets/graduation-cap.svg'

function Header(){
    return(
        <header className="header">
            <section className="headerBlock">
            <img src={hat}></img>
            <h1>Home</h1>
            </section>
        </header>
    );
}
export default Header;