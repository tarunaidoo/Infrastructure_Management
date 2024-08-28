function Card({ event, date, time, venue, room }) {
    return (
      <section className="Card">
        <p><b>{event}</b></p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Venue: {venue}</p>
        <p>Room: {room}</p>
      </section>
    );
  }
  
  export default Card;
  