import React from 'react';
import './EventDetailsCard.css';

function Card({ event, date, time, venue, room }) {
    return (
      <section className="Event-Card">
        <p><b>{event}</b></p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Venue: {venue}</p>
        <p>Room: {room}</p>
      </section>
    );
  }
  
  export default Card;
  