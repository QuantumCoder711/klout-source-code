import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { messageData, MessageStatusData } from './tempData';

const DataTable: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter state
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filtered data based on the filters
  const filteredData = messageData.filter((data: MessageStatusData) => {
    const nameMatch = nameFilter ? data.Name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const phoneMatch = phoneFilter ? data['Phone No.'].includes(phoneFilter) : true;
    const statusMatch = statusFilter ? data['Message Status'] === statusFilter : true;

    return nameMatch && phoneMatch && statusMatch;
  });

  // Calculate total number of pages for filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Function to handle pagination (next/prev)
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get the data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Render pagination numbers
  const renderPaginationNumbers = () => {
    const paginationNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
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
    return paginationNumbers;
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
            onChange={(e) => setCurrentPage(1)} // Reset to page 1 when items per page change
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Search inputs */}
        <div className="mb-2 flex gap-2">
          {/* Search By Name Filter */}
          <input
            type="text"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            placeholder="Search by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />

          {/* Search By Phone No. Filter */}
          <input
            type="tel"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            placeholder="Search by Phone No."
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />

          {/* Message Status filter */}
          <select
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Sent</option>
            <option value="Delivered">Delivered</option>
            <option value="Read">Read</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
          <thead>
            <tr className="bg-klt_primary-500 text-white">
              <th className="py-3 px-4 text-start text-nowrap">S.No</th>
              <th className="py-3 px-4 text-start text-nowrap">Name</th>
              <th className="py-3 px-4 text-start text-nowrap">Phone No.</th>
              <th className="py-3 px-4 text-start text-nowrap">Message Status</th>
              <th className="py-3 px-4 text-start text-nowrap">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data: MessageStatusData, index: number) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Name}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data['Phone No.']}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data['Message Status']}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data.Date}</td>
              </tr>
            ))}
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
  );
};

export default DataTable;
