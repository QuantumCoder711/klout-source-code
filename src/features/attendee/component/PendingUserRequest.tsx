import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiChevronLeft, TiChevronRight, TiPlus } from "react-icons/ti";
import { FaEdit, FaDownload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Attendee, attendees } from './tempData/tempData'; // Ensure this is the correct path
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { eventUUID, fetchAllPendingUserRequests } from '../../event/eventSlice';

type PendingRequestType = {
    id: number;                              // Unique identifier for the event
    uuid: string;                            // A universally unique identifier
    user_id: number;                         // ID of the user associated with the event
    slug: string;                            // URL-friendly identifier (slug) for the event
    title: string;                           // The title of the event
    description: string;                     // A detailed description of the event
    event_date: string;                      // Date of the event in YYYY-MM-DD format
    location: string;                        // Location ID, which might refer to a specific location in a database
    start_time: string;                      // Start time (hour) in 24-hour format
    start_time_type: "AM" | "PM";            // Time of the day (AM/PM)
    end_time: string;                        // End time (hour) in 24-hour format
    end_time_type: "AM" | "PM";              // Time of the day (AM/PM)
    image: string;                           // URL or path to the event image
    event_venue_name: string;                // The name of the event venue
    event_venue_address_1: string;           // Address line 1 of the event venue
    event_venue_address_2: string;           // Address line 2 of the event venue
    city: string;                            // City of the event
    state: string;                           // State of the event
    country: string;                         // Country of the event
    pincode: string;                         // Pincode for the event location
    google_map_link: string;                 // Google Maps link for the event venue location
    created_at: string;                      // Timestamp when the event was created (ISO 8601 format)
    updated_at: string;                      // Timestamp when the event was last updated (ISO 8601 format)
    status: number;                          // Event status, where 1 typically means active and 0 means inactive
    pdf_path: string;                        // Path to an associated PDF (event brochure, agenda, etc.)
    end_minute_time: string;                 // Minutes part of the event end time
    start_minute_time: string;               // Minutes part of the event start time
    qr_code: string;                         // Path to the event's QR code image
    start_time_format: string;               // Start time in "HH:MM:SS" format (24-hour)
    feedback: number;                        // Feedback status (whether feedback is enabled)
    event_start_date: string;                // The start date of the event (same as `event_date`)
    event_end_date: string;                  // The end date of the event (same as `event_date`)
    why_attend_info: string | null;          // Optional information on why someone should attend
    more_information: string | null;         // Additional information about the event (optional)
    t_and_conditions: string | null;         // Optional terms and conditions for the event
    video_url: string | null;                // Optional video URL related to the event (e.g., promotional video)
};

const PendingUserRequest: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { token } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID, pendingRequests, user_id } = useSelector((state: RootState) => ({
        currentEventUUID: state.events.currentEventUUID,
        pendingRequests: state.events.pendingRequests,
        user_id: state.auth.user?.id
    }));

    useEffect(() => {
        if (currentEventUUID && token && user_id) {
            dispatch(fetchAllPendingUserRequests({eventuuid: currentEventUUID, token, user_id}));
        }

        console.log(pendingRequests);
    }, [currentEventUUID, token, dispatch]);
    // eventuuid: currentEventUUID, token

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;  // Display 10 rows per page

    // Filter States
    const [firstNameFilter, setFirstNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');

    // Calculate filtered data based on the filters
    const filteredAttendees = attendees.filter((attendee) => {
        return (
            attendee.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
            attendee.Email.toLowerCase().includes(emailFilter.toLowerCase()) &&
            attendee.Company.toLowerCase().includes(companyFilter.toLowerCase())
        );
    });

    // Calculate the data to display for the current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredAttendees.slice(indexOfFirstRow, indexOfLastRow);

    // Calculate total pages
    const totalPages = Math.ceil(filteredAttendees.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPaginationNumbers = () => {
        const paginationNumbers: JSX.Element[] = [];
        const delta = 2; // Number of pages before and after the current page to show

        // Always show the first page
        paginationNumbers.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === 1 ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
            >
                1
            </button>
        );

        // Show the second page if not the first page, and show ellipses if necessary
        if (currentPage > delta + 2) {
            paginationNumbers.push(
                <span key="ellipsis-start" className="p-1 px-3 text-gray-500">...</span>
            );
        }

        // Show the current page and pages around it (if applicable)
        const start = Math.max(2, currentPage - delta); // Start the range near the current page
        const end = Math.min(totalPages - 1, currentPage + delta); // End the range near the current page

        // If we have room, show pages in the middle range (after 1, before last page)
        for (let i = start; i <= end; i++) {
            paginationNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === i ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
                >
                    {i}
                </button>
            );
        }

        // Show ellipses before the last page if needed
        if (currentPage < totalPages - delta - 1) {
            paginationNumbers.push(
                <span key="ellipsis-end" className="p-1 px-3 text-gray-500">...</span>
            );
        }

        // Always show the last page
        if (totalPages > 1) {
            paginationNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === totalPages ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
                >
                    {totalPages}
                </button>
            );
        }

        return paginationNumbers;
    };

    return (
        <div>
            {/* Heading and Buttons Wrapper Div */}
            <div className='flex justify-between items-center'>
                <HeadingH2 title='7th CHRO Confex & Awards 2024, Chennai' />
                <div className='flex items-center gap-3'>
                    <Link to="/events/" className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            {/* table filters and pagination wrapper div */}
            <div className='bg-white p-6 rounded-lg shadow-md mt-3'>
                <div className='mt-4'>
                    <div className='flex justify-between items-baseline'>
                        {/* Filters */}
                        <div className='space-x-3 flex'>
                            {/* Filter by first name */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
                                placeholder="Search by First Name"
                                value={firstNameFilter}
                                onChange={(e) => setFirstNameFilter(e.target.value)}
                            />
                            {/* filter by email */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
                                placeholder="Search by Email"
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                            />
                            {/* filter by company */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
                                placeholder="Search by company"
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                            />


                            <button className="btn bg-klt_primary-500 h-full px-6 py-2 flex items-center text-white btn-sm">
                                <FaDownload size={20} /> Download Excel
                            </button>
                        </div>
                        <p className='font-semibold'>Total Pending Requests: {filteredAttendees.length}</p>
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto max-w-full mt-3">
                        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                            <thead>
                                <tr className="bg-klt_primary-500 text-white">
                                    <th className="py-3 px-4 text-start text-nowrap">Attendee-ID</th>
                                    <th className="py-3 px-4 text-start text-nowrap">First Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Last Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Mobile No.</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Status</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentRows.map((data: Attendee, index: number) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.attendeeID}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.firstName}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.lastName}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Designation}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Company}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Email}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.mobile}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Status}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap flex gap-3">
                                                <Link to={"/events/edit-agenda"} className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit size={20} />
                                                </Link>
                                                <button className="text-red-500 hover:text-red-700">
                                                    <MdDelete size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-end items-center mt-4">
                        <div className="flex items-center space-x-1">
                            {/* Previous Button */}
                            <button
                                className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <TiChevronLeft />
                            </button>

                            {renderPaginationNumbers()}

                            {/* Next Button */}
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
            </div>
        </div>
    );
}

export default PendingUserRequest;
