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
import HeadingH2 from '../../../component/HeadingH2';
import * as XLSX from 'xlsx';  // Import the xlsx library
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';

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
    event_name: string;
    id: number;
};

const AllEventAttendee: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID, eventAttendee } = useSelector((state: RootState) => ({
        currentEventUUID: state.events.currentEventUUID,
        eventAttendee: state.events.eventAttendee as attendeeType[],
    }));



    console.log(eventAttendee);

    // const { currentAttendeeUUID } = useSelector((state: RootState) => state.attendee);

    // console.log(currentAttendeeUUID);



    useEffect(() => {
        if (currentEventUUID && token) {
            dispatch(allEventAttendee({ eventuuid: currentEventUUID, token }));
        }
    }, [currentEventUUID, token]);

    const [itemsPerPage, setItemsPerPage] = useState(10);
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
        const matchesCheckIn = checkInFilter === '' || attendee.check_in === Number(checkInFilter);
        const matchesRole = roleFilter === '' || (attendee.status ?? '').toLowerCase() === roleFilter.toLowerCase();
        return matchesName && matchesCompany && matchesDesignation && matchesCheckIn && matchesRole;
    });

    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

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
                    .delete(`/api/attendees/${id}`, {
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
                        // dispatch(fetchEvents(token));
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

    return (
        <>
            <HeadingH2 title={eventAttendee[0]?.event_name || 'Event Attendees'} />
            <br />

            <div className="flex gap-2 mb-4">
                <Link to="/events/add-attendee" onClick={() => {
                    dispatch(heading('Add Attendee'))
                }} className="btn btn-secondary text-white btn-sm" >
                    <FaUserFriends /> Add Attendee
                </Link>
                <Link to="/events/send-reminder" onClick={()=>dispatch(heading('Send Reminder'))} className="btn btn-accent text-white btn-sm">
                    <BsSendFill /> Send Reminder
                </Link>
                <Link to="" className="btn btn-primary text-white btn-sm">
                    <FaMessage /> Send Invitation
                </Link>
                <Link to="" className="btn btn-warning text-white btn-sm">
                    <BiSolidMessageSquareDots /> Send Same Day Reminder
                </Link>
                <Link to="/events/pending-user-request" onClick={() => { dispatch(heading("Pending Requests")) }} className="btn btn-error text-white btn-sm">
                    <FaUserClock /> Pending User Request
                </Link>
                <button className="btn btn-success btn-outline btn-sm ml-auto" onClick={handleExport}>
                    <FaFileExcel /> Export Data
                </button>
            </div >
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    {/* Show dropdown */}
                    <div className="mb-2 flex items-center">
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

                    {/* Search inputs */}
                    <div className="mb-2 flex gap-2">
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
                    <div className="mb-2 text-right">
                        <span className="text-gray-800 font-semibold">
                            Total Attendee: {eventAttendee.length}
                        </span>
                        <br />
                        <span className="text-gray-800 font-semibold">
                            Checked In: {eventAttendee.filter((item) => item.check_in === 1).length}
                        </span>
                        <br />
                        <span className="text-gray-800 font-semibold">
                            Search Result: {filteredAttendees.length}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-w-full">
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
                                <th className="py-3 px-4 text-start text-nowrap">Check In</th>
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
                                        <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>{attendee.check_in === 1 ? 'Yes' : 'No'}</td>
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