import React, {useState} from 'react';

import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpIssuesReported/PopUpIssuesReported';
import './IssuesReportedPage.css';
function IssuesReportedPage(){
    
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () =>{
        setIsPopupOpen(true);
    };
    const closePopup = () =>{
        setIsPopupOpen(false);
    };

    return(
    <>
        <NavigationHeader title = 'Issues Reported'/>
        <button className='tester' onClick={openPopup}>Test PopUp Info</button>
        {isPopupOpen && (
            <Popup
                title = 'Broken AC'
                user = 'JohMary Sue Doe'
                date = '01 August 2024'
                time = '14:15 - 17:00'
                venue = 'FNB Building'
                room = 'FNB33'
                description = "AC doesn't turn on"
                onClose={closePopup}
            />
        )}
    </>);
    
}

export default IssuesReportedPage;