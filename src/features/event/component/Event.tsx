import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { MdAdd } from "react-icons/md";
import { Link } from 'react-router-dom';
import { heading } from '../../../features/heading/headingSlice';

const Event: React.FC = () => {
    const dispatch = useDispatch();
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
        start_time_type: string
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
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full text-left text-sm">
                        <thead>
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
                                                    className="w-16 h-16 rounded-lg object-cover"
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
                                                <button className="text-blue-500 hover:underline">View Attendees</button> <br />
                                                <button className="text-green-500 hover:underline">View Sponsors</button> <br />
                                                <button className="text-yellow-500 hover:underline">View Agendas</button> <br />
                                                <button className="text-red-500 hover:underline">Delete Event</button>
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
                    </table>
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
            </div>
        </>
    );
};

export default Event;
