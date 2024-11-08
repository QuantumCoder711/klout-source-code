import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiChevronLeft, TiChevronRight, TiPlus } from "react-icons/ti";
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { agendaData, AgendaData } from '../temp/tempData';

const ViewAgendas: React.FC = () => {
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;  // Display 10 rows per page

    // Calculate the data to display for the current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = agendaData.slice(indexOfFirstRow, indexOfLastRow);

    // Calculate total pages
    const totalPages = Math.ceil(agendaData.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Render pagination numbers with edge-case handling
    const renderPaginationNumbers = () => {
        const paginationNumbers: number[] = [];
        const maxVisiblePages = 5;
    
        // Determine the range of pages to show
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
        // Adjust startPage if endPage exceeds totalPages
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
    
        // Create the page number buttons to render
        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.push(i);
        }
    
        return (
            <div className="flex items-center space-x-1">
                {/* Show first page link if there is a gap before the first visible page */}
                {startPage > 2 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 border rounded-md text-klt_primary-500 hover:bg-green-100"
                        >
                            1
                        </button>
                        <span className="text-klt_primary-500">...</span>
                    </>
                )}
    
                {/* Display page number buttons */}
                {paginationNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'}`}
                    >
                        {number}
                    </button>
                ))}
    
                {/* Show last page link if there is a gap after the last visible page */}
                {endPage < totalPages - 1 && (
                    <>
                        <span className="text-klt_primary-500">...</span>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 border rounded-md text-klt_primary-500 hover:bg-green-100"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>
        );
    };
    

    return (
        <div>
            {/* Heading and Buttons Wrapper Div */}
            <div className='flex justify-between items-center'>
                <HeadingH2 title='All Agendas for 7th CHRO Confex & Awards 2024, Chennai Total Agenda - 21' />

                <div className='flex items-center gap-3'>
                    <Link to="/events/" className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>

                    <Link to="/events/add-agenda" className="btn btn-primary text-white btn-sm">
                        <TiPlus size={20} /> Add Agenda
                    </Link>
                </div>
            </div>

            {/* table filters and pagination wrapper div */}
            <div className='mt-10'>
                <div className='p-3'>
                    {/* Filters */}
                    <input
                        type="text"
                        className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
                        placeholder="Search by Title"
                    />

                    {/* table */}
                    <div className="overflow-x-auto max-w-full mt-10">
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
                                {
                                    currentRows.map((data: AgendaData, index: number) => (
                                        <tr key={index}>
                                            {/* Adjusted S.No to show global numbering across pages */}
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{indexOfFirstRow + index + 1}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.title}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.eventDate}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.time}</td>
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

export default ViewAgendas;
