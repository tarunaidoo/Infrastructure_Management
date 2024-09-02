import React, {useState} from 'react';
import "./ReportIssue.css";
//import {useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import warningIcon from '../../assets/icons/triangle-warning.svg';
//import ConfirmationPopUp from '../../components/ConfirmationPopUp/ConfirmationPopUp'; // Import the ConfirmationPopup
//import PopUp from '../../components/PopUp/PopUp'; // Import the new Popup component



function ReportIssue() {

    // const navigate =useNavigate();

    // const location = useLocation();
    // // Get the building and room from state


    //Pulling building name and room name from previous pages
    // const { building, room } = location.state || {}; 

    // States
    const [issueTitle, setIssueTitle] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    //const [showPopup, setShowPopup] = useState(false);
    //const [showConfirmation, setShowConfirmation] = useState(false);
    //const [showError, setShowError] = useState(false);

    //Handle when clicking on report a problem
    // const handleBackClick = () => {
    //     navigate('/');  // Navigate to the specified route
    // };

    
    // //Handle when clicking on building field
    // const handleBuildingClick = () => {
    //     navigate('/building');  // Navigate back to the building screen
    // };

    // //Handle when clicking on room field
    // const handleRoomClick = () => {
    //     navigate('/building');  // Navigate back to the room screen
    // };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //Manual checking that issue title and description has been entered
        if (!issueTitle || !issueDescription) {
            //setShowError(true);
        return;
    }
    
    //setShowConfirmation(true);
  };

    // Validate description length
    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length <= 250) {
            setIssueDescription(value);
        }
    };

    //Printing out to console when user says yes to reporting issue
    const handleConfirm = () => {
        console.log(`Date: ${formattedDate}`);
       // console.log(`Building: ${building}`);
        //console.log(`Room: ${room}`);
        console.log(`Issue Title: ${issueTitle}`);
        console.log(`Issue Description: ${issueDescription}`);
        //setShowConfirmation(false); // Hide the confirmation popup
        //setShowPopup(true); // Show the new popup
      };
    
      // const handleCloseConfirmation = () => {
      //   setShowConfirmation(false); // Hide the confirmation popup without reporting
      // };
    
      // const handleClosePopup = () => {
      //   setShowPopup(false); // Hide the final popup
      //   //navigate('/'); // Navigate to the home page 

      // };

      // const handleCloseError = () => {
      //   setShowError(false); // Hide the error popup
      // };

      
    // Format the date i.e 24 August 2024
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date());


    return (
        <main className='report-issue-layout'>

            <article className='report-issue-heading'>

                <img src={headingIcon} alt='back-arrow' className='report-icons'/>
                <h1>Report an Issue</h1>

                </article>

            <section className='report-issue-container'>
                {/* //checking that a value for building and room has been sent in */}
                <form onSubmit={handleSubmit}>
                    <p>Date: {formattedDate}</p>
                    <p>Venue:</p>
                    <article>
                     <p >MSL</p>
                     <p >MSL004</p>
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
                        <img src={warningIcon} alt='warning-icon '/>
                        Report Issue</button>
                        </form>
      </section>
      {/* {showConfirmation && (
        <ConfirmationPopUp
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirm}
          message="Do you want to report this problem?"
        />
      )} */}
      {/* {showPopup && (
        <PopUp onClose={handleClosePopup} 
        message="Your report has been sent!"/>
      )}
        {showError && (
        <PopUp
          onClose={handleCloseError}
          message="Please fill in all fields."
        />
      )} */}
        </main>
    );
}

export default ReportIssue;