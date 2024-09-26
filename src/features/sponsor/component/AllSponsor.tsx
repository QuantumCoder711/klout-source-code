import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';

const AllSponsor: React.FC = () => {
  const attendeesData = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Attendee ${index + 1}`,
    job: `Job Title ${index + 1}`,
    company: `Company ${index + 1}`,
    location: `Location ${index + 1}`,
    lastLogin: `${Math.floor(Math.random() * 12 + 1)}/${Math.floor(Math.random() * 28 + 1)}/2023`,
    favoriteColor: ['Blue', 'Green', 'Red', 'Purple', 'Yellow', 'Pink', 'Orange', 'Teal', 'Navy', 'Brown'][Math.floor(Math.random() * 10)],
  }));

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(attendeesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentAttendees = attendeesData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationNumbers = () => {
    const paginationNumbers = [];
    const maxVisiblePages = 5; // Maximum number of visible page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start and end page if at the beginning or end
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-2">
          <span className="text-gray-800 font-semibold">
            Showing {currentAttendees.length} entries out of {attendeesData.length}
          </span>
        </div>
        <div className="mb-2">
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">Show:</label>
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


        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
            <thead>
              <tr className="bg-klt_primary-500 text-white">
                <th className="py-3 px-4 text-start">#</th>
                <th className="py-3 px-4 text-start">Name</th>
                <th className="py-3 px-4 text-start">Job</th>
                <th className="py-3 px-4 text-start">Company</th>
                <th className="py-3 px-4 text-start">Location</th>
                <th className="py-3 px-4 text-start">Last Login</th>
                <th className="py-3 px-4 text-start">Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {currentAttendees.length > 0 ? (
                currentAttendees.map((attendee, index) => (
                  <tr key={attendee.id} className="bg-white border-b border-gray-400 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{startIndex + index + 1}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.name}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.job}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.company}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.location}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.lastLogin}</td>
                    <td className="py-3 px-4 text-gray-800">{attendee.favoriteColor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-2 px-4 text-center text-gray-600">No attendees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Entries Count and Pagination Controls */}
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

export default AllSponsor;
