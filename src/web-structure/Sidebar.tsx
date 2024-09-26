import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing chevron icons

const Sidebar: React.FC = () => {
  const [showEvents, setShowEvents] = useState(false);

  const toggleEventsMenu = () => {
    setShowEvents(!showEvents);
  };

  return (
    <div className="h-screen w-56 flex-shrink-0 bg-klt_primary-900 text-white">
      <div
        className="px-4 py-5 text-2xl font-bold border-b border-white-500"
        style={{ marginBottom: "30px" }}
      >
        KLOUT CLUB
      </div>
      <ul className="my-5 space-y-2">
        <li>
          <Link to="/" className="py-3 px-5 block rounded font-semibold">
            Dashboard
          </Link>
        </li>
        <li>
          <button
            onClick={toggleEventsMenu}
            className="py-3 px-5 rounded w-full text-left flex items-center justify-between"
          >
            <span className="font-semibold">Events</span>
            {showEvents ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showEvents && (
            <ul className="mx-4 bg-klt_primary-100 rounded">
              <li>
                <Link
                  to="/events"
                  className="hover:bg-klt_primary-400 pl-4 py-2 block rounded"
                >
                  All Events
                </Link>
              </li>
              <li>
                <Link
                  to="/events/add-event"
                  className="hover:bg-klt_primary-400 pl-4 py-2 block rounded"
                >
                  Add Event
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/all-attendees"
            className="py-3 px-5 block rounded font-semibold"
          >
            All Attendees
          </Link>
        </li>
        <li>
          <Link
            to="/all-sponsors"
            className="py-3 px-5 block rounded font-semibold"
          >
            All Sponsors
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="py-3 px-5 block rounded font-semibold"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="py-3 px-5 block rounded font-semibold"
          >
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
