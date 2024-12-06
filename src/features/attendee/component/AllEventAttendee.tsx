import React, { useEffect, useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { allEventAttendee } from '../../event/eventSlice';
import { FaEdit, FaUserFriends, FaUserClock, FaFileExcel } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { attendeeUUID } from '../attendeeSlice';
import { Link } from 'react-router-dom';
import { BsSendFill } from 'react-icons/bs';
import { FaMessage } from 'react-icons/fa6';
import { BiSolidMessageSquareDots } from 'react-icons/bi';
import { FaPoll } from "react-icons/fa";
import HeadingH2 from '../../../component/HeadingH2';
import * as XLSX from 'xlsx';  // Import the xlsx library
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import Loader from '../../../component/Loader';
import { IoMdArrowRoundBack } from 'react-icons/io';

type attendeeType = {
    uuid: string;
    title: string;
    first_name: string;
    job_title: string;
    company_name: string;
    email_id: string;
    phone_number: string;
    status: string;
    last_name: string;
    check_in: number;
    check_in_time: string;
    check_in_second: number;
    check_in_second_time: string;
    check_in_third: number;
    check_in_third_time: string;
    check_in_forth: number;
    check_in_forth_time: string;
    check_in_fifth: number;
    check_in_fifth_time: string;
    event_name: string;
    id: number;
};

const AllEventAttendee: React.FC = () => {
    const dispatch = useAppDispatch();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { token } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID, eventAttendee, loading, currentEvent } = useSelector((state: RootState) => ({
        currentEventUUID: state.events.currentEventUUID,
        eventAttendee: state.events.eventAttendee as attendeeType[],
        loading: state.events.attendeeLoader,
        currentEvent: state.events
    }));

    console.log(currentEvent, eventAttendee);

    const [dateDifference, setDateDifference] = useState<number>(0);

    // Helper function to calculate the difference in days
    const calculateDateDifference = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    };


    useEffect(() => {
        if (currentEventUUID && token) {
            dispatch(allEventAttendee({ eventuuid: currentEventUUID, token }));
        }

        if (currentEvent.currentEvent) {
            setDateDifference(calculateDateDifference(currentEvent.currentEvent?.event_start_date, currentEvent.currentEvent?.event_end_date));
            // setDateDifference(3);
            console.log(dateDifference);
        }

        // console.log("Checked Users are: ", checkedUsers);
    }, [currentEventUUID, token]);


    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [searchDesignation, setSearchDesignation] = useState('');
    const [checkInFilter, setCheckInFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Filter attendees based on the search terms
    const filteredAttendees = eventAttendee.filter((attendee) => {
        const matchesName = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.toLowerCase().includes(searchName.toLowerCase());
        const matchesCompany = (attendee.company_name ?? '').toLowerCase().includes(searchCompany.toLowerCase());
        const matchesDesignation = (attendee.job_title ?? '').toLowerCase().includes(searchDesignation.toLowerCase());
        const matchesCheckIn = checkInFilter === '' || attendee.check_in === Number(checkInFilter) || attendee.check_in_second === Number(checkInFilter) || attendee.check_in_third === Number(checkInFilter) || attendee.check_in_forth === Number(checkInFilter) || attendee.check_in_fifth === Number(checkInFilter)
        const matchesRole = roleFilter === '' || (attendee.status ?? '').toLowerCase() === roleFilter.toLowerCase();
        return matchesName && matchesCompany && matchesDesignation && matchesCheckIn && matchesRole;
    });

    // console.log("Checked Users are: ", checkedUsers2ndDay);

    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // const [currentAttendees, setCurrentAttendees] = useState<attendeeType[]>(filteredAttendees.slice(startIndex, endIndex));

    const currentAttendees: attendeeType[] = filteredAttendees.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleExport = () => {
        const data = filteredAttendees.map((attendee) => ({
            'First Name': attendee.first_name,
            'Last Name': attendee.last_name,
            'Designation': attendee.job_title,
            'Company': attendee.company_name,
            'Email': attendee.email_id,
            'Mobile': attendee.phone_number,
            'Role': attendee.status,
            'Check In': attendee.check_in === 1 ? 'Yes' : 'No',
            'Event Name': attendee.event_name,
        }));

        // Create a new workbook and a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

        // Generate Excel file and offer download
        XLSX.writeFile(workbook, eventAttendee[0].event_name + '.xlsx');
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
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'
                            }`}
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

    const handleDelete = async (id: number) => {
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
                    .delete(`${apiBaseUrl}/api/attendees/${id}`, {
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
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                        // setFilteredAgendaData(prevAgendas => prevAgendas.filter(agenda => agenda.uuid !== uuid));
                        // setCurrentAttendees(prevAttendee => prevAttendee.filter(attendee => attendee.id !== id));
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
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <HeadingH2 title={eventAttendee[0]?.event_name || 'Event Attendees'} />
                <Link to="/" onClick={() => dispatch(heading("All Attendee"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>
            <br />

            <div className="flex items-center flex-wrap gap-2 mb-4">
                <Link
                    to="/events/add-attendee"
                    onClick={() => { dispatch(heading('Add Attendee')) }}
                    className="btn btn-secondary text-white btn-xs"
                    title="Add a new attendee"
                >
                    <FaUserFriends /> Add Attendee
                </Link>

                <Link
                    to="/events/send-reminder"
                    onClick={() => { dispatch(heading('Send Reminder')); }}
                    className="btn btn-accent text-white btn-xs"
                    title="Send a reminder to attendees"
                >
                    <BsSendFill /> Send Reminder
                </Link>

                <Link
                    to="/events/send-invitation"
                    onClick={() => { dispatch(heading('Send Invitation')); }}
                    className="btn hidden btn-primary text-white btn-xs"
                    title="Send an invitation to attendees"
                >
                    <FaMessage /> Send Invitation
                </Link>

                <Link
                    to="/events/same-day-reminder"
                    onClick={() => { dispatch(heading('Send Same Day Reminder')); }}
                    className="btn btn-warning text-white btn-xs"
                    title="Send a same day reminder"
                >
                    <BiSolidMessageSquareDots /> Send Same Day Reminder
                </Link>

                <Link
                    to="/events/send-poll"
                    onClick={() => { dispatch(heading('Send Poll')); }}
                    className="btn btn-info text-white btn-xs"
                    title="Send a poll to attendees"
                >
                    <FaPoll /> Send Poll
                </Link>

                <Link
                    to="/events/send-to-app"
                    onClick={() => { dispatch(heading('Send In App Message')); }}
                    className="btn btn-primary text-white btn-xs"
                    title="Send an in-app message"
                >
                    <FaMessage /> Send In App Message
                </Link>

                <Link
                    to="/events/pending-user-request"
                    onClick={() => { dispatch(heading("Pending Requests")) }}
                    className="btn btn-error text-white btn-xs"
                    title="View pending user requests"
                >
                    <FaUserClock /> Pending User Request
                </Link>

                <Link
                    to="/events/send-multiple-message"
                    onClick={() => { dispatch(heading('Send Template Message')); }}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white btn-xs"
                    title="Send template message to multiple users"
                >
                    <BsSendFill /> Send Template Message
                </Link>

                <Link
                    to="/events/session-reminder"
                    onClick={() => { dispatch(heading('Session Reminder')); }}
                    className="btn bg-fuchsia-500 hover:bg-fuchsia-600 text-white btn-xs"
                    title="Send a session reminder"
                >
                    <BsSendFill /> Session Reminder
                </Link>

                <Link
                    to="/events/day-two-reminder"
                    onClick={() => { dispatch(heading('Day 2 Reminder')); }}
                    className="btn bg-emerald-500 hover:bg-emerald-600 text-white btn-xs"
                    title="Send a Day 2 reminder"
                >
                    <BsSendFill /> Day Two Reminder
                </Link>

                <Link
                    to="/events/reminder-to-visit-booth"
                    onClick={() => { dispatch(heading('Reminder Visit Booth')); }}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white btn-xs"
                    title="Send reminder to visit booth"
                >
                    <BsSendFill /> Reminder Visit Booth
                </Link>

                <Link
                    to="/events/day_two_same_day_reminder"
                    onClick={() => { dispatch(heading('Day Two Same Day Reminder')); }}
                    className="btn bg-purple-500 hover:bg-purple-600 text-white btn-xs"
                    title="Send Day 2 same day reminder"
                >
                    <BsSendFill /> Day Two Same Day Reminder
                </Link>

                <Link
                    to="/events/thank-you-message"
                    onClick={() => { dispatch(heading('Thank You Message')); }}
                    className="btn bg-rose-500 hover:bg-rose-600 text-white btn-xs"
                    title="Send a thank you message"
                >
                    <BsSendFill /> Thank You Message
                </Link>

                <button
                    className="btn btn-success btn-outline btn-sm ml-auto"
                    onClick={handleExport}
                    title="Export attendee data"
                >
                    <FaFileExcel /> Export Data
                </button>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between flex-col-reverse min-[1440px]:flex-row gap-5 items-center">
                    {/* Search inputs */}
                    <div className="mb-2 flex justify-center flex-wrap gap-2">
                        {/* Show dropdown */}
                        <div className="mb-2 flex items-center h-full">
                            <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">
                                Show:
                            </label>
                            <select
                                id="itemsPerPage"
                                className="border border-gray-500 rounded-md p-2 bg-white outline-none"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
                            placeholder="Search by company"
                            value={searchCompany}
                            onChange={(e) => {
                                setSearchCompany(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
                            placeholder="Search by designation"
                            value={searchDesignation}
                            onChange={(e) => {
                                setSearchDesignation(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />

                        {/* Check-in filter */}
                        <select
                            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
                            value={checkInFilter}
                            onChange={(e) => {
                                setCheckInFilter(e.target.value);
                                setCurrentPage(1); // Reset to the first page when filtering
                            }}
                        >
                            <option value="">Checked In</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>

                        {/* Role filter */}
                        <select
                            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1); // Reset to the first page when filtering
                            }}
                        >
                            <option value="">Role</option>
                            <option value="speaker">Speaker</option>
                            <option value="delegate">Delegate</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="panelist">Panelist</option>
                            <option value="moderator">Moderator</option>
                        </select>
                    </div>

                    {/* Total Attendee Info */}
                    <div className="mb-2 text-right min-w-fit">
                        <span className="text-gray-800 font-semibold">
                            Total Attendee: {eventAttendee.length}
                        </span>
                        <br />
                        <span className="text-gray-800 font-semibold">
                            {/* Checked In: {eventAttendee.filter((item) => item.check_in === 1).length} */}

                            {dateDifference >= 0 && (
                                <p>Checked In 1st: {eventAttendee.filter((item) => item.check_in === 1).length}</p>
                            )}

                            {dateDifference >= 1 && (
                                <p>Checked In 2nd: {eventAttendee.filter((item) => item.check_in_second === 1).length}</p>
                            )}

                            {dateDifference >= 2 && (
                                <p>Checked In 3rd: {eventAttendee.filter((item) => item.check_in_third === 1).length}</p>
                            )}

                            {dateDifference >= 3 && (
                                <p>Checked In 4th: {eventAttendee.filter((item) => item.check_in_forth === 1).length}</p>
                            )}

                            {dateDifference >= 4 && (
                                <p>Checked In 5th: {eventAttendee.filter((item) => item.check_in_fifth === 1).length}</p>
                            )}
                        </span>

                        <span className="text-gray-800 font-semibold">
                            Search Result: {filteredAttendees.length}
                        </span>
                    </div>
                </div>

                {/* Table */}
                {/* Table or Loader */}
                <div className="overflow-x-auto max-w-full">
                    {loading ? (
                        <div className="flex justify-center items-center py-6">
                            <Loader /> {/* Display the loader component */}
                        </div>
                    ) : (
                        // <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                        //     <thead>
                        //         <tr className="bg-klt_primary-500 text-white">
                        //             <th className="py-3 px-4 text-start text-nowrap">#</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Name</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Company</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Email</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Mobile</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Role</th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (1st) </th>
                        //             <th className="py-3 px-4 text-start text-nowrap">Check In Time<br /> (1st) </th>

                        //             {dateDifference > 0 && (
                        //                 <><th className="py-3 px-4 text-start text-nowrap">Check In <br /> (2nd)</th>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Time and Date <br /> (2nd)</th>
                        //                 </>
                        //             )}
                        //             {dateDifference > 1 && (
                        //                 <>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (3rd)</th>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Time and Date <br /> (3rd)</th>
                        //                 </>
                        //             )}
                        //             {dateDifference > 2 && (
                        //                 <>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (4th)</th>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Time and Date <br /> (4th)</th>
                        //                 </>
                        //             )}
                        //             {dateDifference > 3 && (
                        //                 <>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (5th)</th>
                        //                     <th className="py-3 px-4 text-start text-nowrap">Time and Date <br /> (5th)</th>
                        //                 </>
                        //             )}
                        //             <th className="py-3 px-4 text-start text-nowrap">Action</th>
                        //         </tr>
                        //     </thead>
                        //     <tbody>
                        //         {currentAttendees.length > 0 ? (
                        //             currentAttendees.map((attendee, index) => (
                        //                 <tr key={attendee.uuid}>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{`${attendee.first_name} ${attendee.last_name}`}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.job_title}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.company_name}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.email_id}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.phone_number}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.status}</td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                        //                         {attendee.check_in === 1 ? 'Yes' : 'No'}
                        //                     </td>
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                        //                         {attendee.check_in_time ? attendee.check_in_time : '-'}
                        //                     </td>

                        //                     {dateDifference > 0 && (
                        //                         <>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_second === 1 ? 'Yes' : 'No'}
                        //                             </td>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_second_time ? attendee.check_in_second_time : '-'}
                        //                             </td>
                        //                         </>
                        //                     )}
                        //                     {dateDifference > 1 && (
                        //                         <>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_third === 1 ? 'Yes' : 'No'}
                        //                             </td>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_third_time ? attendee.check_in_third_time : '-'}
                        //                             </td>
                        //                         </>
                        //                     )}
                        //                     {dateDifference > 2 && (
                        //                         <>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_forth === 1 ? 'Yes' : 'No'}
                        //                             </td>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_forth_time ? attendee.check_in_forth_time : '-'}
                        //                             </td>
                        //                         </>
                        //                     )}
                        //                     {dateDifference > 3 && (
                        //                         <>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_fifth === 1 ? 'Yes' : 'No'}
                        //                             </td>
                        //                             <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                        //                                 {attendee.check_in_fifth_time ? attendee.check_in_fifth_time : '-'}
                        //                             </td>
                        //                         </>
                        //                     )}
                        //                     <td className="py-3 px-4 text-gray-800 text-nowrap flex gap-2">
                        //                         <Link to={`/events/edit-attendee`} onClick={() => { dispatch(attendeeUUID(attendee.uuid)); dispatch(heading("Edit Attendee")) }} className="text-blue-500 hover:text-blue-700">
                        //                             <FaEdit />
                        //                         </Link>
                        //                         <button onClick={() => handleDelete(attendee.id)} className="text-red-500 hover:text-red-700">
                        //                             <MdDelete />
                        //                         </button>
                        //                     </td>
                        //                 </tr>
                        //             ))
                        //         ) : (
                        //             <tr>
                        //                 <td colSpan={9} className="py-4 text-center text-gray-600">
                        //                     No attendees found.
                        //                 </td>
                        //             </tr>
                        //         )}
                        //     </tbody>
                        // </table>

                        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                            <thead>
                                <tr className="bg-klt_primary-500 text-white">
                                    <th className="py-3 px-4 text-start text-nowrap">#</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Mobile</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Role</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (1st) </th>
                                    <th className="py-3 px-4 text-start text-nowrap">Check In Time<br /> (1st) </th>

                                    {dateDifference > 0 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (2nd)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (2nd)</th>
                                        </>
                                    )}
                                    {dateDifference > 1 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (3rd)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (3rd)</th>
                                        </>
                                    )}
                                    {dateDifference > 2 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (4th)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (4th)</th>
                                        </>
                                    )}
                                    {dateDifference > 3 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (5th)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (5th)</th>
                                        </>
                                    )}
                                    <th className="py-3 px-4 text-start text-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAttendees.length > 0 ? (
                                    currentAttendees.map((attendee, index) => (
                                        <tr key={attendee.uuid}>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{`${attendee.first_name} ${attendee.last_name}`}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.job_title}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.company_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.email_id}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.phone_number}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.status}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                                                {attendee.check_in === 1 ? 'Yes' : 'No'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                                                {attendee.check_in_time ? (
                                                    <>
                                                        {/* Date part */}
                                                        {attendee.check_in_time.split(' ')[0]} <br />
                                                        {/* Time part in bold */}
                                                        <span style={{ fontWeight: 'bold' }}>
                                                            {attendee.check_in_time.split(' ')[1]}
                                                        </span>
                                                    </>
                                                ) : '-'}
                                            </td>

                                            {dateDifference > 0 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_second === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_second_time ? (
                                                            <>
                                                                {attendee.check_in_second_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_second_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 1 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_third === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_third_time ? (
                                                            <>
                                                                {attendee.check_in_third_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_third_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 2 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_forth === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_forth_time ? (
                                                            <>
                                                                {attendee.check_in_forth_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_forth_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 3 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_fifth === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_fifth_time ? (
                                                            <>
                                                                {attendee.check_in_fifth_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_fifth_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            <td className="py-3 px-4 text-gray-800 text-nowrap flex gap-2">
                                                <Link to={`/events/edit-attendee`} onClick={() => { dispatch(attendeeUUID(attendee.uuid)); dispatch(heading("Edit Attendee")) }} className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(attendee.id)} className="text-red-500 hover:text-red-700">
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-4 text-center text-gray-600">
                                            No attendees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    )}
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

export default AllEventAttendee;