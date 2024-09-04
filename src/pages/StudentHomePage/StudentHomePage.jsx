import React from 'react';
import Header from './StudentHomeHeader.jsx'
import Card from './StudentHomeCard.jsx'
import Footer from './StudentHomeFooter.jsx';
import './StudentHomePage.css'
function App() {
  return(
    <>
      <Header/>
      <section className='content'>
      <Card 
          event="React Conference" 
          date="2024-09-01" 
          time="10:00 AM" 
          venue="Main Hall" 
          room="Room 101" 
      />
      <Card 
          event="React Conference" 
          date="2024-09-01" 
          time="10:00 AM" 
          venue="Main Hall" 
          room="Room 101" 
      />
      </section>
      <Footer/>
    </>
  );
}

export default App
