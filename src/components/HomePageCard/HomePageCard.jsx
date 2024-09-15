import React from 'react';
import './HomePageCard.css';

function Card({ event, date, time, venue, room, onClick }) {
  return (
    <section className="Card" data-testid="Card-1" onClick={onClick}>
      <p><b>{event}</b></p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Venue: {venue}</p>
      <p>Room: {room}</p>
    </section>
  );
}

export default Card;
