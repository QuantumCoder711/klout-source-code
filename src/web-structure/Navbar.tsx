import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { fetchEvents, fetchExistingEvent } from "../features/event/eventSlice";
import { fetchAllAttendees } from "../features/attendee/attendeeSlice";
import { fetchSponsor } from "../features/sponsor/sponsorSlice";
import { logout } from '../features/auth/authSlice';
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { heading } from "../features/heading/headingSlice";


const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();

  const { token } = useSelector((state: RootState) => state.auth);
  const { pageHeading } = useSelector((state: RootState) => state.pageHeading);
  const { currentEventUUID } = useSelector((state: RootState) => state.events)

  useEffect(() => {
    dispatch(fetchEvents(token));
    dispatch(fetchAllAttendees(token));
    dispatch(fetchSponsor(token));
    dispatch(fetchExistingEvent({ eventuuid: currentEventUUID, token }));
  }, [dispatch, currentEventUUID]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (state: boolean) => {
    setIsOpen(state);
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    dispatch(logout());
  }

  const handlePageTitle = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(heading(e.currentTarget.innerText))
  }

  return (
    <nav className="bg-klt_primary-900 p-4 text-white" style={{ borderLeft: '1px solid #fff' }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side - Branding or Logo */}
        <div className="text-xl font-bold ml-6">{pageHeading}</div>

        {/* Right side - User profile with dropdown */}
        <div
          className="relative"
          onMouseEnter={() => toggleDropdown(true)}
          onMouseLeave={() => toggleDropdown(false)}
        >
          <div className="flex items-center space-x-2 cursor-pointer">
            {/* User Avatar */}
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            {/* User Name */}
            <span className="font-medium">John Doe</span>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-10 right-0 mt-0 pt-2 w-48  text-black rounded-md shadow-lg">
              <ul className="bg-white">
                <li className="px-4 py-2 font-semibold hover:bg-green-100 cursor-pointer">
                  <Link
                    to="/profile"
                    onClick={handlePageTitle}
                  >
                    Profile
                  </Link>
                </li>
                <li className="px-4 py-2 font-semibold hover:bg-green-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
