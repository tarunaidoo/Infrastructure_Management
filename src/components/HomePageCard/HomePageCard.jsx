import React from 'react';
//import './HomePageCard.test'
function Card({ event, date, time, venue, room }) {
  return (
    <section className="Card" data-testid="Card-1">
      <p><b>{event}</b></p>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Venue: {venue}</p>
      <p>Room: {room}</p>
    </section>
  );
}

export default Card;
