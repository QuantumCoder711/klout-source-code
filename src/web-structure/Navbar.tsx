import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { fetchEvents, fetchExistingEvent } from "../features/event/eventSlice";
import { fetchAllAttendees } from "../features/attendee/attendeeSlice";
import { fetchSponsor } from "../features/sponsor/sponsorSlice";
import { logout, fetchUser } from '../features/auth/authSlice';
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { heading } from "../features/heading/headingSlice";
import socket from "../socket";
import { useGlobalContext } from "../GlobalContext";
import dummyImage from "/dummyImage.jpg";
import Coin from "/src/assets/coin.png";

type eventType = {
  title: string,
  image: string,
  event_start_date: string,
  uuid: string,
  event_venue_name: string,
  id: number,
  start_time?: string,
  start_minute_time?: string,
  start_time_type?: string,
  end_time?: string,
  end_minute_time?: string,
  end_time_type?: string,
}

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const {wallet_balance} = useSelector((state:RootState)=>state.auth);
  const { setCount } = useGlobalContext();

  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

  const { token } = useSelector((state: RootState) => state.auth);
  const { pageHeading } = useSelector((state: RootState) => state.pageHeading);
  const { currentEventUUID } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);

  const { events } = useSelector((state: RootState) => state.events);

  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);

  // const pastEvents = events.filter((event: eventType) => {
  //   const eventDate: Date = new Date(event.event_start_date);
  //   eventDate.setHours(0, 0, 0, 0);
  //   return eventDate < today;
  // }).slice(0, 4);

  const upcomingEvents = events.filter((event: eventType) => {
    const eventDate: Date = new Date(event.event_start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).slice(0, 4);


  useEffect(() => {
    if (token) {
      dispatch(fetchEvents(token));
      dispatch(fetchAllAttendees(token));
      dispatch(fetchSponsor(token));
      dispatch(fetchUser(token));
      if (currentEventUUID) {
        dispatch(fetchExistingEvent({ eventuuid: currentEventUUID, token }));
      }
    }
  }, [dispatch, currentEventUUID, token]);


  useEffect(() => {
    if (!events) {
      return;
    }

    const joinRoom = () => {
      // console.log("Joining room with:", { userId, eventUuid, tabId });
      upcomingEvents.forEach((event) => {
        const userId = event.user_id;
        const eventUuid = event.uuid;
        socket.emit('joinEvent', { userId, eventUuid });
        console.log(`${event.user_id} connected, ${event.uuid}`);
      })
    };

    if (socket.connected) {
      console.log("Already connected to the server", socket.id);
      joinRoom();
    }

    socket.on("connect", () => {
      console.log("Connected to the server", socket.id);
      joinRoom();
    });

    socket.on("checkInCountUpdated", (data) => {
      const event = events.filter(event => event.uuid === data.eventUuid);
      console.log("The Event is: ", event);
      console.log("Received data:", data);
      setCount(data.updatedCheckInCount);
    });
    // socket.on("checkInCountUpdated", (data) => {
    //   const event = events.filter(event => event.uuid === data.eventUuid);
    //   console.log("The Event is: ", event);
    //   console.log("Received data:", data);
    //   setCount(data.updatedCheckInCount);
    // });

    return () => {
      socket.off("connect");
      socket.off("joinEvent");
    };
  }, [events]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (state: boolean) => {
    setIsOpen(state);
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleLogout = async () => {
    await dispatch(logout());
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
        <div className="flex gap-5 items-center">
          <span className="bg-white text-klt_primary-900 px-3 py-1 rounded-full font-semibold">
            <img src={Coin} alt="Coin" className="size-6 inline-block mr-1 "/>Credits: {wallet_balance !== undefined ? wallet_balance : 0}
          </span>
          <div
            className="relative"
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              {/* User Avatar */}
              <img
                src={
                  user?.image === null ? dummyImage : `${imageBaseUrl}/${user?.image}`}
                alt="User Avatar"
                className="w-10 h-10 object-contain border-2 border-white rounded-full"
              />
              {/* User Name */}
              <span className="font-bold">{user?.first_name}</span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 right-0 mt-0 pt-2 w-48  text-black rounded-md shadow-lg">
                <ul className="bg-white">
                  <Link
                    to="/profile"
                    onClick={handlePageTitle}
                  >
                    <li className="px-4 py-2 font-semibold hover:bg-green-100 cursor-pointer">
                      Profile
                    </li>
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={handlePageTitle}
                  >
                    <li className="px-4 py-2 font-semibold hover:bg-green-100 cursor-pointer">
                      Change Password
                    </li>
                  </Link>
                  <li className="px-4 py-2 font-semibold hover:bg-green-100 cursor-pointer" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
