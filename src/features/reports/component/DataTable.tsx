import React, { useState } from 'react';
import { messageData, MessageRecord } from '../temp/dummyData';

const DataTable: React.FC = () => {
  // Define the state for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate the start and end index for slicing the data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = messageData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(messageData.length / rowsPerPage);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="text-black py-10">
      <table className="table-auto w-full overflow-y-scroll text-left">
        <thead>
          <tr className="border rounded-md">
            <th className="py-3 px-5">SNo</th>
            <th className="py-3 px-5">Name</th>
            <th className="py-3 px-5">Phone Number</th>
            <th className="py-3 px-5">Message Status</th>
            <th className="py-3 px-5">Date</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((message: MessageRecord) => (
            <tr key={message.SNo} className="border rounded-md font-medium">
              <td className="py-3 px-5">{message.SNo}</td>
              <td className="py-3 px-5">{message.Name}</td>
              <td className="py-3 px-5">{message.PhoneNumber}</td>
              <td className="py-3 px-5">{message.MessageStatus}</td>
              <td className="py-3 px-5">{message.Date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center pt-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md mr-2 disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-klt_primary-500 text-white' : 'bg-gray-100'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md ml-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
