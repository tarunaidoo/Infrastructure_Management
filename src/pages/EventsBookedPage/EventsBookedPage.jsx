import React, {useState} from 'react';

import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpEventsBooked/PopUpEventsBooked';
import './EventsBookedPage.css'
function EventsBookedPage(){
    //this page will be rendered when the Events Booked button is pressed form Admin homescreen.
    //All the events booked will be displayed for admins to scroll through
    //I tested the popups for those events as seen in the "Test PopUp Info"
    //this will obviously be from data in the db
    //I had hardcoded it for understanding purposes - DEFINITELY will be changing that

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () =>{
        setIsPopupOpen(true);
    };
    const closePopup = () =>{
        setIsPopupOpen(false);
    };

    return(
    <>
        <NavigationHeader title = 'Events Booked'/>
        <button className='tester' onClick={openPopup}>Test PopUp Info</button>
        {isPopupOpen && (
            <Popup
                title = 'CGV Tutoring'
                studentName = 'John Doe'
                date = '12 August 2024'
                time = '10:15 - 12:00'
                venue = 'Matehmatical Science Labs'
                room = 'MSL005'
                onClose={closePopup}
            />
        )}
    </>);
    
}

export default EventsBookedPage;