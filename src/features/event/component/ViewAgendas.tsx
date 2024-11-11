import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiChevronLeft, TiChevronRight, TiPlus } from "react-icons/ti";
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import axios from 'axios';

// Define the AgendaType interface
type AgendaType = {
  id: number;
  uuid: string;
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  start_time_type: string;
  end_time: string;
  end_time_type: string;
  image_path: string;
  created_at: string;
  updated_at: string;
  start_minute_time: string;
  end_minute_time: string;
  position: number;
};

const ViewAgendas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [agendaData, setAgendaData] = useState<AgendaType[]>([]); // Fix agendaData to be an array
  const [filteredAgendaData, setFilteredAgendaData] = useState<AgendaType[]>([]); // To store filtered data
  const [filterTitle, setFilterTitle] = useState(""); // State for the filter input

  const { currentEventUUID } = useSelector((state: RootState) => state.events);
  const { events } = useSelector((state: RootState) => state.events);
  
  const currentEvent = events.find((event) => event.uuid === currentEventUUID); // Use find() to directly get the current event

  useEffect(() => {
    if (currentEvent) {
      axios.get(`/api/all-agendas/${currentEvent.id}`)
        .then((res) => {
          if (res.data) {
            setAgendaData(res.data.data);
            setFilteredAgendaData(res.data.data); // Initialize filtered data
          }
        });
    }
  }, [currentEvent]);

  // Handle title filter input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilterTitle(query);
    
    // Filter the agendaData based on the title input
    const filtered = agendaData.filter((agenda) =>
      agenda.title.toLowerCase().includes(query)
    );
    setFilteredAgendaData(filtered); // Update filtered data
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;  // Display 10 rows per page

  // Calculate the data to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAgendaData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAgendaData.length / rowsPerPage);

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
        <HeadingH2 title={events[0].title} />
        <div className='flex items-center gap-3'>
          <Link to="/events/" className="btn btn-error text-white btn-sm">
            <IoMdArrowRoundBack size={20} /> Go Back
          </Link>
        </div>
      </div>

      <Link to="/events/add-agenda" className="btn mt-5 btn-secondary w-fit flex items-center text-white btn-sm">
        <TiPlus size={20} /> Add Agenda
      </Link>

      {/* table filters and pagination wrapper div */}
      <div className='bg-white p-6 rounded-lg shadow-md mt-3'>
        <div className='mt-4'>
          {/* Filters */}
          <div className='flex justify-between items-baseline'>
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
              placeholder="Search by Title"
              value={filterTitle} // bind the filter state to the input
              onChange={handleFilterChange} // Update the filter state on input change
            />
            <p className='font-semibold'>Total Agendas: {filteredAgendaData.length}</p>
          </div>

          {/* table */}
          <div className="overflow-x-auto max-w-full mt-3">
            <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
              <thead>
                <tr className="bg-klt_primary-500 text-white">
                  <th className="py-3 px-4 text-start text-nowrap">S.No</th>
                  <th className="py-3 px-4 text-start text-nowrap">Title</th>
                  <th className="py-3 px-4 text-start text-nowrap">Event Date</th>
                  <th className="py-3 px-4 text-start text-nowrap">Time</th>
                  <th className="py-3 px-4 text-start text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((data: AgendaType, index: number) => (
                  <tr key={data.id}>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{indexOfFirstRow + index + 1}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.title}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.event_date}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.start_time + ':' + data.start_minute_time + ' ' +  data.start_time_type.toUpperCase() + ' ' + '-' + ' ' + data.end_time + ':' + data.end_minute_time + ' ' + data.end_time_type.toUpperCase()}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap flex gap-3">
                      <Link to={`/events/edit-agenda/${data.uuid}`} className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={20} />
                      </Link>
                      <button className="text-red-500 hover:text-red-700">
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
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
};

export default ViewAgendas;
