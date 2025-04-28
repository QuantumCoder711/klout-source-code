import React from 'react';
import ScoreCard from '../../../component/ScoreCard';
import HeadingH2 from '../../../component/HeadingH2';
import EventCard from '../../../component/EventCard';
import Button from '../../../component/Button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Link } from 'react-router-dom';
import { MdAdd } from "react-icons/md";
import { heading } from '../../heading/headingSlice';
import Loader from '../../../component/Loader';
import { Helmet } from 'react-helmet-async';

const Dashboard: React.FC = () => {
  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

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
    total_checkedin: number,
  }

  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const { allAttendees } = useSelector((state: RootState) => state.attendee);
  const { totalSponsors } = useSelector((state: RootState) => state.sponsor);

  // filter past events from all events
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents = events.filter((event: eventType) => {
    const eventDate: Date = new Date(event.event_start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  }).sort((a: eventType, b: eventType) => {
    // Sort by decreasing date (descending order) for past events
    return new Date(b.event_start_date).getTime() - new Date(a.event_start_date).getTime();
  }).slice(0, 4);

  const upcomingEvents = events.filter((event: eventType) => {
    const eventDate: Date = new Date(event.event_start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).sort((a: eventType, b: eventType) => {
    // Sort by increasing date (ascending order)
    return new Date(a.event_start_date).getTime() - new Date(b.event_start_date).getTime();
  }).slice(0, 4);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Errror:  {error}</p>

  const handleHeading = () => {
    dispatch(heading('Add Event'))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* Heading */}
      <div className="flex justify-end items-end">
        <Helmet>
          <title>Klout Club Dashboard - Manage & Track Your Business Events</title>
          <meta name="title" content="Klout Club Dashboard - Manage & Track Your Business Events" />
          <meta name="description" content="Access your Klout Club event organizer dashboard to create, manage, and Analyze you events in India. Track attendee insights, Enable QR check-ins, AI Facial Photos and AI Session reports." />
        </Helmet>
        <Link to='/events/add-event' onClick={handleHeading} className="btn btn-secondary text-white btn-sm"><MdAdd /> Create New Event</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <ScoreCard
          title="Total Events"
          content={events.length}
          cardColor='#347928'
        />
        <ScoreCard
          title="Total Attendees"
          content={allAttendees.length}
          cardColor='#6439FF'
        />
        <ScoreCard
          title="Total Sponsors"
          content={totalSponsors}
          cardColor='#ED3EF7'
        />
        <ScoreCard
          title="Upcoming Events"
          content={upcomingEvents.length}
          cardColor='#FF9100'
        />
      </div>


      {/* UPCOMING EVENTS */}

      <div className="mt-4 mb-6 flex justify-between items-center">
        <HeadingH2
          title='Upcoming Events'
        />
        <Link to='/events' onClick={() => dispatch(heading('All Events'))}><Button
          buttonTitle='View All'
        /></Link>

      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> */}
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-8">
        {
          upcomingEvents.length > 0 ?
            upcomingEvents.map((upcomingEvent: eventType) => {
              return <EventCard
                key={upcomingEvent.id}
                title={upcomingEvent.title}
                eventId={upcomingEvent.id}
                imageUrl={`${imageBaseUrl}/${upcomingEvent.image}`}
                start_minute_time={upcomingEvent.start_minute_time}
                start_time={upcomingEvent.start_time}
                start_time_type={upcomingEvent.start_time_type}
                end_minute_time={upcomingEvent.end_minute_time}
                end_time={upcomingEvent.end_time}
                end_time_type={upcomingEvent.end_time_type}
                imageAlt={upcomingEvent.title}
                total_checkedin={upcomingEvent.total_checkedin}
                date={upcomingEvent.event_start_date}
                venue={upcomingEvent.event_venue_name}
                eventuuid={upcomingEvent.uuid}
              />
            }) : <h3 className="text-2xl text-red-500 font-semibold pt-2 pb-3 px-4 bg-slate-300 rounded-md">No Upcoming Event</h3>
        }
      </div>

      {/* PAST EVENTS */}

      <div className="mt-10 mb-6 flex justify-between items-center">
        <HeadingH2
          title='Past Events'
        />
        <Link to='/events' onClick={() => dispatch(heading('All Events'))}><Button
          buttonTitle='View All'
        /></Link>

      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> */}
      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-8">
        {
          pastEvents.length > 0 ?
            pastEvents.map((pastEvent: eventType) => {
              return <EventCard
                key={pastEvent.uuid}
                eventId={pastEvent.id}
                title={pastEvent.title}
                imageUrl={`${imageBaseUrl}/${pastEvent.image}`}
                imageAlt={pastEvent.title}
                date={pastEvent.event_start_date}
                venue={pastEvent.event_venue_name}
                eventuuid={pastEvent.uuid}
              />
            }) : <h3 className="text-2xl text-red-500 font-semibold pt-2 pb-3 px-4 bg-slate-300 rounded-md">No Past Event</h3>
        }
      </div>
    </>
  );
};

export default Dashboard;
