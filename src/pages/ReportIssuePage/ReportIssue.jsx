import React, { useState } from 'react';
import "./ReportIssue.css";
import { useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import warningIcon from '../../assets/icons/triangle-warning.svg';
import Popup from '../../components/Popup/Popup';
import { useQuery, useMutation, useQueryClient } from 'react-query'; // Import React Query hooks
import { createReportIssue } from '../../services/ReportIssuePage/ReportIssuePage.service';
import { formatDateToISO, getFormattedDate } from '../../utils/dateUtils';



function ReportIssue() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient(); // Use the query client
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

  // Fetch issue data from cache if it exists
  const { data: cachedIssueData } = useQuery(
    ['issueData'],
    () => {
      const issueTitle = '';
      const issueDescription = '';
      return { issueTitle, issueDescription };
    },
    {
      initialData: {
        issueTitle: '',
        issueDescription: '',
      }
    }
  );

  const [issueTitle, setIssueTitle] = useState(cachedIssueData.issueTitle);
  const [issueDescription, setIssueDescription] = useState(cachedIssueData.issueDescription);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [isLoading,setIsLoading] = useState(false); // New state for loading
  // const [userData, setUserData] = useState(null); // State for user data

  const updateIssueData = useMutation(
    (newData) => queryClient.setQueryData('issueData', newData)
  );

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

  const handleReportIssueClick = () => {
    setPopupType('confirmation');
    setShowPopup(true);
  };

  const handleConfirm = () => {
    setPopupType('loading'); // Set popup type to loading
    setShowPopup(true);
    setIsLoading(true); // Set loading state to true
    const reportData = {
      VENUE_ID: selectedVenue.VENUE_ID,
      TITLE: issueTitle,
      REPORTED_BY: selectedVenue.USER_ID,
      REPORT_DATE: formattedDateISO,
      DESCRIPTION: issueDescription,
      ISSUE_STATUS: "UNRESOLVED",
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
        setIsLoading(false); // Set loading state to false
        setShowPopup(true);
      })
      .catch(() => {
        setPopupType('request-error');
        setIsLoading(false); // Set loading state to false
        setShowPopup(true);
      });
  };

  const handleVenueSelectionClick = () => {

    // Save issue title and description to query cache before navigating
    updateIssueData.mutate({
      issueTitle,
      issueDescription,
    });

    const backPageDetails = {
      SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
      USER_ID: previousPageDetails.USER_ID,
      DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE,
      CAMPUS_NAME: previousPageDetails.CAMPUS_NAME,
      BUILDING_ID: previousPageDetails.BUILDING_ID,
      BUILDING_NAME: previousPageDetails.BUILDING_NAME
    }
    navigate("/campus-selection", { state: backPageDetails });
  }
  const handleHeaderBackIconClick = () => {
    const backPageDetails = {
      SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
      USER_ID: previousPageDetails.USER_ID,
      DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE,
      CAMPUS_NAME: previousPageDetails.CAMPUS_NAME,
      BUILDING_ID: previousPageDetails.BUILDING_ID,
      BUILDING_NAME: previousPageDetails.BUILDING_NAME
    }
    navigate("/student-home", { state: backPageDetails });
  }



  const handleClosePopup = () => {
    setShowPopup(false);
    if (popupType === 'success') {
      console.log("successful");
      navigate(previousPageDetails.SOURCE_PAGE);   // Navigate to the home page 
    }


  };

  // Validate description length
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setIssueDescription(value);
    }
  };

  return (
    <main className='report-issue-layout' data-testid="report-issue-layout">
      <article className='report-issue-heading-container' data-testid="report-issue-heading">
        <article className='report-issue-heading'>
          <img
            onClick={handleHeaderBackIconClick}
            src={headingIcon}
            alt='back-arrow'
            className='report-icons'
            data-testid="back-arrow-icon"
          />
          <h1 onClick={handleHeaderBackIconClick} data-testid="report-issue-heading-text">Report an Issue</h1>
        </article>
      </article>

      <section className='report-issue-container' data-testid="report-issue-container">
        <form onSubmit={handleFormSubmit} data-testid="report-issue-form">
          <p data-testid="report-issue-date">Date: {formattedDate}</p>
          <p data-testid="report-issue-venue-label">Venue:</p>

          <article onClick={handleVenueSelectionClick} data-testid="report-issue-venue-details">
            <p data-testid="building-name">{selectedVenue.BUILDING_NAME}</p>
            <p data-testid="venue-name">{selectedVenue.VENUE_NAME}</p>
          </article>

          <label className='issue-title-container' data-testid="issue-title-container">
            Issue Title:
            <input
              type="text"
              maxLength="50"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Enter issue title here..."
              data-testid="issue-title-input"
            />
          </label>

          <label className='issue-description-container' data-testid="issue-description-container">
            Issue Description:
            <textarea
              value={issueDescription}
              onChange={handleDescriptionChange}
              maxLength="300"
              placeholder="Describe the issue here..."
              style={{ resize: 'none' }} // Disable resizing
              data-testid="issue-description-input"
            />
          </label>

          <button className='report-issue-button' type="submit" data-testid="report-issue-button">
            <img src={warningIcon} alt='warning-icon ' data-testid="warning-icon" />
            Report Issue
          </button>
        </form>
      </section>

      <Popup trigger={showPopup} onClose={handleClosePopup} data-testid="popup">
        {popupType === 'error' && (
          <article className='report-Issue-Popups' data-testid="error-popup">
            <h2 data-testid="error-popup-heading">Invalid Details</h2>
            <p data-testid="error-popup-message">Please fill in all fields</p>
            <button onClick={handleClosePopup} data-testid="error-popup-close-button">Close</button>
          </article>
        )}
       {popupType === 'loading' && isLoading && ( // Conditional rendering for loading state
          <article className='report-Issue-Popups' data-testid="loading-popup">
            <h2 data-testid="loading-popup-heading">Loading...</h2>
            <p data-testid="loading-popup-message">Please wait while we send your report.</p>
          </article>
        )}
        {popupType === 'confirmation' && (
          <article className='report-Issue-Popups' data-testid="confirmation-popup">
            <h2 data-testid="confirmation-popup-heading">Confirmation</h2>
            <p data-testid="confirmation-popup-message">Do you want to report this issue?</p>
            <article data-testid="confirmation-popup-buttons">
              <button onClick={handleConfirm} data-testid="confirmation-yes-button">Yes</button>
              <button onClick={handleClosePopup} data-testid="confirmation-no-button">No</button>
            </article>
          </article>
        )}
        {popupType === 'success' && (
          <article className='report-Issue-Popups' data-testid="success-popup">
            <h2 data-testid="success-popup-heading">Confirmation</h2>
            <p data-testid="success-popup-message">Your report has been sent</p>
            <button onClick={handleClosePopup} data-testid="success-close-button">Close</button>
          </article>
        )}
        {popupType === 'request-error' && (
          <article className='report-Issue-Popups' data-testid="request-error-popup">
            <h2 data-testid="request-error-popup-heading">Confirmation</h2>
            <p data-testid="request-error-popup-message">Error Sending Request</p>
            <button onClick={handleClosePopup} data-testid="request-error-close-button">Close</button>
          </article>
        )}
      </Popup>
    </main>
  );
}

export default ReportIssue;

