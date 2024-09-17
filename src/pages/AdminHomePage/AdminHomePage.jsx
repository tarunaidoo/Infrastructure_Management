import React from 'react';
import { useNavigate } from 'react-router-dom';

import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
// import AdminIcon from '../../assets/icons/admin-home-icon.svg'
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './AdminHomePage.css';
import AdminIcon from '../../assets/icons/admin-home-icon.svg';
function AdminHomePage(){
    const userID = localStorage.getItem('userEmail'); // get userID
    const navigate = useNavigate();

    const eventsCardClick = () =>{
        navigate('/admin-view-booking'); //move from this page to Events page
    };

    const issuesCardClick = () =>{
        navigate('/admin-issues-reported'); //move from this page to Issues page
    };

    const handleAddVenueClick = () => {
        navigate('/admin-add-venue');
    };

    const handleEditVenueClick = () =>{
        const venueSelectionDetails = {
            SOURCE_PAGE: "/admin-home",
            USER_ID: userID,
            DESTINATION_PAGE: "/edit-venue"
        }
        navigate("/campus-selection", { state: venueSelectionDetails });
    };

    return(
        <>
            <NavigationHeader title = "Home" className="admin-header" />
            <img src={AdminIcon} alt='admin icon' className='adminIcon'/> 
            <div className="admin-home-container">
            <AdminIssuesCard onClick={issuesCardClick} className="admin-home-cards"/>
            <AdminEventsCard onClick={eventsCardClick} className="admin-home-cards"/>
            </div>
            <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick}/>
        </>
        
        
    );
}

export default AdminHomePage;
