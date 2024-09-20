import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import Profile from './pages/ProfilePage/ProfilePage';
import BookingPage from './pages/BookingPage/BookingPage';
import AdminHomePage from './pages/AdminHomePage/AdminHomePage';
import IssuesReportedPage from './pages/IssuesReportedPage/IssuesReportedPage';
import AddAddVenuePage from './pages/AdminAddVenuePage/AdminAddVenuePage';
import UserBookingPage from './pages/UserBookingsPage/UserBookingsPage';
import ReportIssue from './pages/ReportIssuePage/ReportIssue';

import BuildingSelectionPage from './pages/BuildingSelectionPage/BuildingSelectionPage';
import RoomSelectionPage from './pages/RoomSelectionPage/RoomSelectionPage';
import CampusSelectionPage from './pages/CampusSelectionPage/CampusSelectionPage';
import StudentHomePage from './pages/StudentHomePage/StudentHomePage';

import AdminEditVenuePage from './pages/AdminEditVenuePage/AdminEditVenuePage';
import EventDetailsPage from './pages/EventDetailsPage/EventDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin-home" element={<AdminHomePage/>} />
        <Route path="/admin-issues-reported" element={<IssuesReportedPage/>} />
        <Route path="/admin-add-venue" element={<AddAddVenuePage/>} />
        <Route path="/admin-view-booking" element={<UserBookingPage/>} />
        <Route path="/report-issue" element = {<ReportIssue/>}/>
        <Route path="/admin-issues-reported" element={<IssuesReportedPage/>}/>
        <Route path="/campus-selection" element={<CampusSelectionPage/>}/>
        <Route path="/building-selection" element={<BuildingSelectionPage/>}/>
        <Route path="/room-selection" element={<RoomSelectionPage/>}/>
        <Route path ="/edit-venue" element = {<AdminEditVenuePage/>}/>
        <Route path="/student-home" element = {<StudentHomePage/>}/>
        <Route path="/event-details/:eventName" element={<EventDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

