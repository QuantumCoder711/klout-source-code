import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Layout from "./web-structure/Layout";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import EventPage from "./pages/EventPage";
import AddEventPage from "./pages/AddEventPage";
import AllAttendeePage from "./pages/AllAttendeePage";
import AllSponsorPage from "./pages/AllSponsorPage";
import ViewEventPage from "./pages/ViewEventPage";
import EditEventPage from "./pages/EditEventPage"
import LoginPage from "./pages/LoginPage";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AllEventAttendeePage from "./pages/AllEventAttendeePage";
import AddEventAttendeePage from './pages/AddEventAttendeePage';
import AllReports from "./pages/AllReports";
import WhatsAppReport from "./features/reports/component/WhatsAppReport";
import MailReport from "./features/reports/component/MailReport";
import AllCharts from "./pages/AllCharts";
import SendReminder from "./features/attendee/component/SendReminder";
import ViewAgendasPage from "./pages/ViewAgendasPage";
import AddAgendaPage from "./pages/AddAgendaPage";
import EditAgendaPage from "./pages/EditAgendaPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Loader from "./component/Loader";
import PendingUserRequest from "./features/attendee/component/PendingUserRequest";

axios.defaults.withCredentials = false;
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login page without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* All other routes wrapped in Layout */}
        <Route
          element={<Layout />}
        >
          <Route path="/" element={<DashboardPage />} />
          {/* <Route path="/" element={<Loader />} /> */}
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/events/add-event" element={<AddEventPage />} />
          <Route path="/events/view-event" element={<ViewEventPage />} />
          <Route path="/events/view-agendas" element={<ViewAgendasPage />} />
          <Route path="/events/add-agenda" element={<AddAgendaPage />} />
          <Route path="/events/edit-agenda" element={<EditAgendaPage />} />
          <Route path="/events/edit-event" element={<EditEventPage />} />
          <Route path="/events/all-attendee" element={<AllEventAttendeePage />} />
          <Route path="/events/pending-user-request" element={<PendingUserRequest />} />
          <Route path="/events/add-attendee" element={<AddEventAttendeePage />} />
          <Route path="/events/send-reminder" element={<SendReminder />} />
          <Route path="/all-attendees" element={<AllAttendeePage />} />
          <Route path="/all-sponsors" element={<AllSponsorPage />} />
          <Route path="/all-reports" element={<AllReports />} />
          <Route path="/all-charts" element={<AllCharts />} />
          <Route path="/all-reports/whatsapp-report" element={<WhatsAppReport />} /> {/* Dynamic Route for WhatsApp Reports */}
          <Route path="/all-reports/mail-report" element={<MailReport />} /> {/* Dynamic Route for WhatsApp Reports */}
        </Route>
      </Routes>

      <ToastContainer
        position="top-right" // Adjust position as needed
        autoClose={5000} // Duration for which toast is visible
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Newest toast on top
        closeOnClick // Close toast on click
        rtl={false} // Right to left
        pauseOnFocusLoss // Pause on focus loss
        draggable // Draggable
        pauseOnHover // Pause on hover
      />
    </Router>
  );
};

export default App;
