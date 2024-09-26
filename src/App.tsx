import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./web-structure/Layout";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import EventPage from "./pages/EventPage";
import AddEventPage from "./pages/AddEventPage";
import AllAttendeePage from "./pages/AllAttendeePage";
import AllSponsorPage from "./pages/AllSponsorPage";
import ViewEventPage from "./pages/ViewEventPage";
import LoginPage from "./pages/LoginPage";
import axios from 'axios';

axios.defaults.withCredentials = false; 
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login page without Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes wrapped in Layout */}
        <Route
          element={<Layout />}
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/events/add-event" element={<AddEventPage />} />
          <Route path="/events/view-event" element={<ViewEventPage />} />
          <Route path="/all-attendees" element={<AllAttendeePage />} />
          <Route path="/all-sponsors" element={<AllSponsorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
