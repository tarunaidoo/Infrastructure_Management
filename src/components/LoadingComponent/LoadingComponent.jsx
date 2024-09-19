import React from 'react';
import './LoadingComponent.css';
import loadIcon from "../../assets/icons/loader.svg"

function LoadingComponent() {
   return( <main className='home-loading-container'>
    <section className='home-loading-content'>
      <img src={loadIcon} alt='loadIcon'/>
    <p>Connecting...</p>
    </section>
    </main>
   );
}

export default LoadingComponent;