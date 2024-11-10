import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { MdAdd } from "react-icons/md";
import { Link } from 'react-router-dom';
import { heading } from '../../../features/heading/headingSlice';
import { eventUUID, fetchEvents } from '../eventSlice';
import Swal from "sweetalert2";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventRow from '../../../component/EventRow';


const Event: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const itemsPerPage: number = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    type eventType = {
        title: string,
        image: string,
        event_start_date: string,
        uuid: string,
        event_venue_name: string,
        total_checkedin: number,
        total_attendee: number,
        total_checkedin_speaker: number,
        total_checkedin_sponsor: number,
        total_pending_delegate: number,
        start_time: string,
        start_minute_time: string,
        start_time_type: string,
        id: number
    }

    // Get events data from the store
    const { events } = useSelector((state: RootState) => state.events);

    const today: Date = new Date();
    const pastEvents = events.filter((event: eventType) => {
        const eventDate: Date = new Date(event.event_start_date);
        return eventDate < today;
    });

    const upcomingEvents = events.filter((event: eventType) => {
        const eventDate: Date = new Date(event.event_start_date);
        return eventDate > today;
    });

    const handleTabChange = (tab: 'upcoming' | 'past') => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset page to 1 when switching tabs
    };


    const deleteEvent = (e: any, id: number) => {
        e.preventDefault();

        // const thisClicked = e.currentTarget;

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/events/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(function (res) {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        dispatch(fetchEvents(token));
                    })
                    .catch(function () {
                        Swal.fire({
                            icon: "error",
                            title: "An Error Occured!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
            }
        });
    };

    const handleHeading = () => {
        dispatch(heading('Add Event'))
    }

    const eventType = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    // Pagination logic
    const totalPages = Math.ceil(eventType.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents: eventType[] = eventType.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationNumbers = () => {
        const paginationNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.push(i);
        }

        return (
            <div className="flex items-center space-x-1">
                {startPage > 1 && <span className="text-klt_primary-500">1</span>}
                {startPage > 2 && <span className="text-klt_primary-500">...</span>}
                {paginationNumbers.map((number) => (
                    <button
                        key={number}
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}
                {endPage < totalPages - 1 && <span className="text-gray-600">...</span>}
                {endPage < totalPages && <span className="text-gray-600">{totalPages}</span>}
            </div>
        );
    };

    return (
        <>

            <div className="p-6">

                {/* Heading */}
                <div className="flex justify-between items-center">
                    <HeadingH2 title="All Events" />
                    <Link to='/events/add-event' onClick={handleHeading} className="btn btn-secondary text-white btn-sm"><MdAdd /> Create New Event</Link>
                </div>


                {/* Tab Buttons */}
                <div className="flex gap-4 mt-4 mb-6">
                    <button
                        onClick={() => handleTabChange('upcoming')}
                        className={`px-4 py-2 rounded ${activeTab === 'upcoming' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        Upcoming Events
                    </button>
                    <button
                        onClick={() => handleTabChange('past')}
                        className={`px-4 py-2 rounded ${activeTab === 'past' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                        Past Events
                    </button>
                </div>



                {/* Event Table */}
                < div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    {/* <thead className=''>
                        <tr className="bg-gray-200 text-gray-700" style={{ fontSize: '17px' }}>
                        </tr>
                    </thead> */}
                    {/* <div className='flex w-full justify-between bg-gray-200 text-gray-700 px-5 py-6'>
                        <div className="">Image</div>
                        <div className="">Title</div>
                        <div className="">Event Details</div>
                        <div className="">Attendees Details</div>
                        <div className="">Actions</div>
                    </div> */}
                    {
                        currentEvents.map((event) => (
                            <EventRow
                                uuid={event.uuid}
                                image={`${imageBaseUrl}/${event.image}`}
                                title={event.title}
                                event_start_date={event.event_start_date}
                                event_venue_name={event.event_venue_name}
                                start_minute_time={event.start_minute_time}
                                start_time={event.start_time}
                                start_time_type={event.start_time_type}
                                total_attendee={event.total_attendee}
                                total_pending_delegate={event.total_pending_delegate}
                                total_checkedin={event.total_checkedin}
                                total_checkedin_speaker={event.total_checkedin_speaker}
                                total_checkedin_sponsor={event.total_checkedin_sponsor}
                            />
                        ))
                    }

                    {/* {
                        currentEvents.map((event) => (
                            <div key={event.id} className='w-full py-5 text-sm border-2 border-yellow-400'>
                                <div className='flex border-2 rounded-xl p-5 justify-between items-center gap-10'>
                                    <div className='flex items-center gap-5'>
                                        <img src={`${imageBaseUrl}/${event.image}`} alt={event.title} className='w-96 h-60 object-cover object-center rounded-md' />
                                        <h5 className='text-lg font-semibold'>{event.title}</h5>
                                    </div>
                                    <div className='h-full flex flex-col gap-y-2'>
                                        <div className='flex items-center gap-2 font-bold min-w-fit'>Date: <p className='font-medium text-zinc-400'>{event.event_start_date}</p></div>
                                        <div className='flex items-center gap-2 font-bold min-w-fit'>Time: <p className='font-medium text-zinc-400'>{event.start_time}</p></div>
                                        <div className='flex items-center gap-2 font-bold min-w-fit'>Venue: <p className='font-medium text-zinc-400'>{event.event_venue_name}</p></div>
                                    </div>

                                    <div className='h-full flex flex-col gap-y-2'>
                                        <div className='flex items-center gap-2 font-bold'>Total Registrations: <p className='font-medium text-zinc-400'>{event.total_attendee}</p></div>
                                        <div className='flex items-center gap-2 font-bold'>Total Attendees: <p className='font-medium text-zinc-400'>{event.total_checkedin}</p></div>
                                        <div className='flex items-center gap-2 font-bold'>Checked In Speakers: <p className='font-medium text-zinc-400'>{event.total_checkedin_speaker}</p></div>
                                        <div className='flex items-center gap-2 font-bold'>Checked In Sponsors: <p className='font-medium text-zinc-400'>{event.total_checkedin_sponsor}</p></div>
                                        <div className='flex items-center gap-2 font-bold'>Pending Delegates: <p className='font-medium text-zinc-400'>{event.total_pending_delegate}</p></div>
                                    </div>

                                    <div className='h-full text-sky-500 font-medium flex flex-col gap-y-2'>
                                        <div className='text-purple-500'>View Event</div>
                                        <div className='text-sky-500'>Edit Event</div>
                                        <div className='text-blue-500'>All Attendees</div>
                                        <div className='text-green-500'>All Sponsors</div>
                                        <div className='text-yellow-500'>View Agendas</div>
                                        <div className='text-red-500'>Delete Event</div>
                                    </div>
                                </div>

                            </div>
                        ))
                    } */}
                    {/* <div className='w-full flex'>
                        <h4 className='font-bold'>Image</h4>
                        <h4 className='font-bold'>Title</h4>
                        <h4 className='font-bold'>Event Details</h4>
                        <h4 className='font-bold'>Attendees Details</h4>
                        <h4 className='font-bold'>Actions</h4>
                    </div>
                    {currentEvents.map((event) => (
                        <div className='w-full border-4 border-red-600 p-10'>

                        </div>
                    ))

                    } */}
                    {/* <table className="min-w-full text-left text-sm">
                        <thead className=''>
                            <tr className="bg-gray-200 text-gray-700" style={{ fontSize: '17px' }}>
                                <th className="py-4 px-6">Image</th>
                                <th className="py-4 px-6">Title</th>
                                <th className="py-4 px-6">Event Details</th>
                                <th className="py-4 px-6">Attendees Details</th>
                                <th className="py-4 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                currentEvents.length > 0 ? (
                                    currentEvents.map((event: eventType) => (
                                        <tr key={event.uuid} className="border-b text-gray-700 text-md font-normal" style={{
                                            fontSize: '15px'
                                        }}>
                                            <td className="py-3 px-6">
                                                <img
                                                    src={`${imageBaseUrl}/${event.image}`}
                                                    alt={event.title}
                                                    className="w-96 h-60 rounded-lg object-cover"
                                                />
                                            </td>
                                            <td className="py-3 px-6 font-semibold">{event.title}</td>
                                            <td className="py-3 px-6">
                                                <span className="font-semibold text-black">Date</span> - {event.event_start_date} <br />
                                                <span className="font-semibold text-black">Time</span> - {event.start_time + ':' + event.start_minute_time + ' ' + event.start_time_type} <br />
                                                <span className="font-semibold text-black">Venue</span> - {event.event_venue_name}
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="font-semibold text-black">Total Registration</span> - {event.total_attendee} <br />
                                                <span className="font-semibold text-black">Total Attendees </span> - {event.total_checkedin}<br />
                                                <span className="font-semibold text-black">Checked In Speakers </span> - {event.total_checkedin_speaker} <br />
                                                <span className="font-semibold text-black">Checked In Sponsors </span> - {event.total_checkedin_sponsor} <br />
                                                <span className="font-semibold text-black">Pending Delegates </span> - {event.total_pending_delegate}
                                            </td>
                                            <td className="py-3 px-6 space-y-2">
                                                <Link to='/events/view-event/' className="text-pink-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                                                    dispatch(eventUUID(event.uuid)); dispatch(heading('Events')); dispatch(heading('Edit Event')); setTimeout(() => {
                                                    }, 500);
                                                }}>View Event</Link> <br />
                                                <button className="text-sky-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                                                    dispatch(eventUUID(event.uuid)); dispatch(heading('Edit Event')); setTimeout(() => {
                                                        navigate('/events/edit-event')
                                                    }, 500);
                                                }} >Edit Event</button> <br />
                                                <Link to='/events/all-attendee' className="text-blue-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={() => {
                                                    dispatch(eventUUID(event.uuid)); dispatch(heading('All Attendee')); setTimeout(() => {
                                                    }, 500);
                                                }}>All Attendees</Link> <br />
                                                <button className="text-green-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1">View Sponsors</button> <br />
                                                <Link to={"/events/view-agendas"} className="text-yellow-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1">View Agendas</Link> <br />
                                                <button className="text-red-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={(e) => deleteEvent(e, event.id)}>Delete Event</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-500 py-4">
                                            No events found.
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table> */}
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-4">
                    <div className="flex items-center space-x-1">
                        <button
                            className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <TiChevronLeft />
                        </button>
                        {renderPaginationNumbers()}
                        <button
                            className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <TiChevronRight />
                        </button>
                    </div>
                </div>

            </div >
        </>
    );
};

export default Event;
