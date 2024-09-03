import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import StudentBookingCard from '../../components/AdminUserCards/StudentUserCard';
import LecturerBookingCard from '../../components/AdminUserCards/LecturerUserCard';
import './EventsBookedPage.css'
function EventsBookedPage(){
    const navigate = useNavigate();

    // const [isPopupOpen, setIsPopupOpen] = useState(false);

    // const openPopup = () =>{
    //     setIsPopupOpen(true);
    // };
    // const closePopup = () =>{
    //     setIsPopupOpen(false);
    // };
    const studentBookings = () =>{
        navigate('/admin-view-stud-booking'); //move from this page to Issues page
    };
    const lecturerBookings = () =>{
        navigate('/admin-view-lec-booking');
    };
    return(
    <>
        <NavigationHeader title = 'Events Booked'/>
        <StudentBookingCard onClick={studentBookings} className="cards"/>
        <LecturerBookingCard onClick={lecturerBookings} className="cards"/>
        
    </>);
    
}

export default EventsBookedPage;
