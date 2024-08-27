import React from 'react';
import { useNavigate } from 'react-router-dom';

import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import AdminIcon from '../../assets/icons/admin-home-icon.svg'
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard'
import './AdminHomePage.css';

function AdminHomePage(){

    const navigate = useNavigate();

    const eventsCardClick = () =>{
        navigate('/events-booked'); //move from this page to Events list page
    };

    const issuesCardClick = () =>{
        navigate('/issues-reported');
    };

    return(
        <>
            
            <NavigationHeader title = "Home"/>
            <img src={AdminIcon} alt='admin icon' className='adminIcon'/>
            <AdminIssuesCard onClick={issuesCardClick}/>
            <AdminEventsCard onClick={eventsCardClick}/>
        </>
        
        
    );
}

export default AdminHomePage;