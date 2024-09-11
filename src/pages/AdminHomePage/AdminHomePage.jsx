import React from 'react';
import { useNavigate } from 'react-router-dom';

import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
// import AdminIcon from '../../assets/icons/admin-home-icon.svg'
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './AdminHomePage.css';

function AdminHomePage(){

    const navigate = useNavigate();

    const eventsCardClick = () =>{
        navigate('/admin-events-booked'); //move from this page to Events page
    };

    const issuesCardClick = () =>{
        navigate('/admin-issues-reported'); //move from this page to Issues page
    };

    const handleAddVenueClick = () => {
        navigate('/admin-add-venue');
    };

    return(
        <>
            
            <NavigationHeader title = "Home" className="heading"/>
            {/* <img src={AdminIcon} alt='admin icon' className='adminIcon'/> not appearing over header element */}
            <AdminIssuesCard onClick={issuesCardClick} className="cards"/>
            <AdminEventsCard onClick={eventsCardClick} className="cards"/>
            <Footer onAddVenueClick={handleAddVenueClick}/>
        </>
        
        
    );
}

export default AdminHomePage;
