import React, { useEffect, useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
// import { messageData, MessageStatusData } from './tempData';

type MessageState = {
  _id: string;
  messageID: string;
  customerPhoneNumber: string;
  messageStatus: string;
  timestamp: string;
  __v: number;
}

type ReciptState = {
  _id: string;
  eventUUID: string;
  userID: string;
  firstName: string;
  messageID: MessageState;
  templateName: string;
  __v: number;
}

type DataTableProps = {
  data: ReciptState[];
  cardStatus: string;
};


const DataTable: React.FC<DataTableProps> = ({ data, cardStatus }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  // const itemsPerPage = 10;

  // Filter state
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  // const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [cardStatus]);

  // Filtered data based on the filters
  const filteredData = data.filter((data: ReciptState) => {
    const nameMatch = nameFilter ? data.firstName.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const phoneMatch = phoneFilter ? data.messageID.customerPhoneNumber.includes(phoneFilter) : true;

    const cardStatusMatch = cardStatus
      ? cardStatus === "Sent"
        ? ["Sent", "Delivered", "Read"].includes(data.messageID.messageStatus)
        : data.messageID.messageStatus === cardStatus
      : true;

    return nameMatch && phoneMatch && cardStatusMatch;
  });

  // function to convert the date to normal date for the user to read properly
  function normalDateFormat(date: string) {
    const newDate = new Date(date);
    const readableDate = newDate.toLocaleString();
    return readableDate;
  }

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
    <div className="text-black py-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        {/* Show dropdown */}
        <div className="mb-2 flex items-center ">
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">
            Show:
          </label>
          <select
            id="itemsPerPage"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none"
            value={itemsPerPage}
            onChange={(e) => { setCurrentPage(1); setItemsPerPage(Number(e.target.value)) }} // Reset to page 1 when items per page change
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

          {/* Message Status filter
          <select
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Sent">Sent</option>
            <option value="Delivered">Delivered</option>
            <option value="Read">Read</option>
            <option value="Failed">Failed</option>
          </select> */}
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
            {
              (currentData.length === 0) &&
              <tr>
                <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
                  Nothing found
                </td>
              </tr>
            }
            {currentData.map((data: ReciptState, index: number) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data.firstName}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data.messageID.customerPhoneNumber}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{data.messageID.messageStatus}</td>
                <td className="py-3 px-4 text-gray-800 text-nowrap">{normalDateFormat(data.messageID.timestamp)}</td>
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
