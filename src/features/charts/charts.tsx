import React, { useState } from 'react';
import ChartCard from './components/ChartCard';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti'; // Import the icons

const Charts: React.FC = () => {
  const { events, loading } = useSelector((state: RootState) => state.events);
  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  if (loading) {
    return <Loader />;
  }

  // Calculate the index of the first and last event to show on the current page
  const indexOfLastEvent = currentPage * cardsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - cardsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Total pages
  const totalPages = Math.ceil(events.length / cardsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Render pagination numbers dynamically
  const renderPaginationNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border rounded-md ${currentPage === i ? 'bg-green-100 text-klt_primary-600' : 'text-klt_primary-600 hover:bg-green-100'}`}
        >
          {i}
        </button>
      );
    }
    return numbers;
  };

  return (
    <div>
      {/* Display Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
        {currentEvents.map((event) => (
          <ChartCard
            key={event.uuid}
            uuid={event.uuid}
            title={event.title}
            venue={event.event_venue_name}
            date={event.event_date}
            image={`${imageBaseUrl}/${event.image}`}
          />
        ))}
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

export default Charts;
