import React, { useState } from 'react';
import "./ReportIssue.css";
import { useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import warningIcon from '../../assets/icons/triangle-warning.svg';
import Popup from '../../components/Popup/Popup';
import { createReportIssue } from '../../services/ReportIssuePage/ReportIssuePage.service';
import { formatDateToISO,getFormattedDate } from '../../utils/dateUtils';



function ReportIssue() {
    const navigate = useNavigate();
    const location = useLocation();
    // Contain the required details from the Venue Selection Page
    const previousPageDetails = location.state || {}; 

    const selectedVenue = {
      USER_ID: previousPageDetails.USER_ID,
      BUILDING_ID: previousPageDetails.BUILDING_ID,
      BUILDING_NAME: previousPageDetails.BUILDING_NAME,
      VENUE_ID: previousPageDetails.VENUE_ID,
      VENUE_NAME: previousPageDetails.VENUE_NAME
    }

    // Format the date i.e 24 August 2024
    const formattedDate = getFormattedDate();

    // Format the date in YYYY-MM-DD format
    const formattedDateISO = formatDateToISO(new Date());
  

  //dummy data
  // const venues = [
  //   { name: 'Mathematical Science Labs', code: 'MSL004', ID:1},
  //   { name: 'Science Building', code: 'SCB001', ID: 11 },
  //   // Add other venues as needed
  // ];
  // States

  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  // const [userData, setUserData] = useState(null); // State for user data



  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!issueTitle || !issueDescription) {
      setPopupType('error');
      setShowPopup(true);
      return;
    }
    handleReportIssueClick();
  };

  const handleConfirm = () => {
    const reportData = {
      VENUE_ID: selectedVenue.VENUE_ID,
      TITLE: issueTitle,
      REPORTED_BY: selectedVenue.USER_ID,
      REPORT_DATE: formattedDateISO,
      DESCRIPTION: issueDescription,
      ISSUE_STATUS:"UNRESOLVED",
    };

    console.log('Submitting data:', reportData);
    console.log(`Date: ${formattedDate}`);
    console.log(`Building: ${selectedVenue.name}`);
    console.log(`Room: ${selectedVenue.code}`);
    console.log(`Issue Title: ${issueTitle}`);
    console.log(`Issue Description: ${issueDescription}`);

    createReportIssue(reportData)
    .then(() => {
      setPopupType('success');
      setShowPopup(true);
    })
    .catch(() => {
      setPopupType('request-error');
      setShowPopup(true);
    });
  };

  const handleHeaderBackIconClick = () => {
    const backPageDetails = {
      SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
      USER_ID: previousPageDetails.USER_ID,
      DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE,
      CAMPUS_NAME: previousPageDetails.CAMPUS_NAME,
      BUILDING_ID: previousPageDetails.BUILDING_ID,
      BUILDING_NAME: previousPageDetails.BUILDING_NAME
    }
    navigate("/room-selection", { state: backPageDetails });
  }

  const handleReportIssueClick = () => {
    setPopupType('confirmation');
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      console.log("successful");
    }
    navigate(previousPageDetails.SOURCE_PAGE); // Navigate to the home page 

  };

  // Validate description length
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setIssueDescription(value);
    }
  };

  return (
    <main className='report-issue-layout'>

      <article className='report-issue-heading'>

        <img onClick={handleHeaderBackIconClick} src={headingIcon} alt='back-arrow' className='report-icons' />
        <h1>Report an Issue</h1>

      </article>
      <section className='report-issue-container'>
        {/* //checking that a value for building and room has been sent in */}
        <form onSubmit={handleFormSubmit}>
          <p>Date: {formattedDate}</p>
          <p>Venue:</p>
          <article>
            <p>{selectedVenue.BUILDING_NAME}</p>
            <p>{selectedVenue.VENUE_NAME}</p>
          </article>
          <label className='issue-title-container'>
            Issue Title:
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Enter issue title here..."
            />
          </label>
          <label className='issue-description-container'>
            Issue Description:
            <textarea
              value={issueDescription}
              onChange={handleDescriptionChange}
              maxLength="250"
              placeholder="Describe the issue here..."
              style={{ resize: 'none' }} // Disable resizing
            />
          </label>
          <button type="submit">
            <img src={warningIcon} alt='warning-icon ' />
            Report Issue</button>
        </form>
      </section>
      <Popup trigger={showPopup} onClose={handleClosePopup}>
        {popupType === 'error' && (
          <article className='report-Issue-Popups'>
            <h2>Invalid Details</h2>
            <p>Please fill in all fields</p>
            <button onClick={handleClosePopup}>Close</button>
          </article>
        )}
        {popupType === 'confirmation' && (
          <article className='report-Issue-Popups'>
            <h2>Confirmation</h2>
            <p>Do you want to report this issue?</p>
            <article>
              <button onClick={handleConfirm}>Yes</button>
              <button onClick={handleClosePopup}>No</button>
            </article>
          </article>
        )}
        {popupType === 'success' && (
          <article className='report-Issue-Popups'>
            <h2>Confirmation</h2>
            <p>Your report has been sent</p>
            <button onClick={handleClosePopup}>Close</button>
          </article>
        )}
        {popupType === 'request-error' && (
          <article className='report-Issue-Popups'>
            <h2>Confirmation</h2>
            <p>Error Sending Request</p>
            <button onClick={handleClosePopup}>Close</button>
          </article>
        )}
      </Popup>
    </main>
  );
}

export default ReportIssue;

