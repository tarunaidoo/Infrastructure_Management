import React from 'react';
import './HomePageCard.css';
import notificationIcon from '../../assets/icons/bookmark-filled-gold.svg';

function Card({ event, date, time, venue, room, onClick }) {
  return (
    <section className="card" data-testid="Card-1" onClick={onClick}>
      <p className='card-header'>
        <b>{event}</b>
        <img className='card-bookmark' src={notificationIcon} alt='bookmark-icon'/>
        </p>
      <section className='card-content'>
      <p><b>Date:</b> {date}</p>
      <p><b>Time:</b> {time}</p>
      <p><b>Building:</b> {venue}</p>
      <p><b>Venue:</b> {room}</p>
      </section>
    </section>
  );
}

export default Card;
