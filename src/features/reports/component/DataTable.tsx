import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import mockAttendees from './tempData';

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
};

const DataTable: React.FC = () => {

  // Fetch attendees from the Redux store
  let { allAttendees = [] }: { allAttendees: attendeeType[] } = useSelector(
    (state: RootState) => state.attendee
  );

  allAttendees = mockAttendees;

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchDesignation, setSearchDesignation] = useState('');
  const [checkInFilter, setCheckInFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Filter attendees based on the search terms
  const filteredAttendees = allAttendees.filter((attendee) => {
    const matchesName = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.toLowerCase().includes(searchName.toLowerCase());
    const matchesCompany = (attendee.company_name ?? '').toLowerCase().includes(searchCompany.toLowerCase());
    const matchesDesignation = (attendee.job_title ?? '').toLowerCase().includes(searchDesignation.toLowerCase());
    const matchesCheckIn = checkInFilter === '' || attendee.check_in === Number(checkInFilter);
    const matchesRole = roleFilter === '' || (attendee.status ?? '').toLowerCase() === roleFilter.toLowerCase();
    return matchesName && matchesCompany && matchesDesignation && matchesCheckIn && matchesRole;
  });

  // Total pages calculation
  const totalPages = allAttendees.length > 0 ? Math.ceil(allAttendees.length / itemsPerPage) : 1;

  // Current page slice of attendees
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAttendees: attendeeType[] = allAttendees.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  // Render pagination numbers with edge-case handling
  const renderPaginationNumbers = () => {
    const paginationNumbers: number[] = [];
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
    <div className="text-black py-10">
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
            Total Attendee: {filteredAttendees.length}
          </span>
          <br />
          <span className="text-gray-800 font-semibold">
            Checked In: {filteredAttendees.filter((item) => item.check_in === 1).length}
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
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee, index) => (
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
                    {/* <Link to={`/edit/${attendee.uuid}`} className="text-blue-500 hover:text-blue-700">
                                                <FaEdit />
                                            </Link>
                                            <button className="text-red-500 hover:text-red-700">
                                                <MdDelete />
                                            </button> */}
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

      {/* Pagination Controls */}
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
  );
};

export default DataTable;
