import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { heading } from "../../heading/headingSlice"
import Loader from '../../../component/Loader';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import * as XLSX from 'xlsx';

interface Person {
    _id: string;
    firstName: string;
    lastName: string;
    linkedinUrl: string;
    designation: string;
    company: string;
    industry: string;
    city: string;
    email: string;
    phone_number: string;
}

const SearchPeople: React.FC = () => {
    const { uuid } = useParams();
    const dispatch = useAppDispatch();
    const allEvents = useSelector((state: RootState) => state.events.events);
    const event = allEvents.find((event) => event.uuid === uuid);
    const [searchData, setSearchData] = useState({
        city: "",
        designation: ""
    });
    const { user } = useSelector((state: RootState) => state.auth);
    const { token } = useSelector((state: RootState) => state.auth);
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [exportLoading, setExportLoading] = useState(false);

    const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);

    // Pagination calculations
    const totalPages = Math.ceil(peopleList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPeople = peopleList.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    }

    const handleGetPeopleList = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${appBaseUrl}/api/mapping/v1/people/search-people`, searchData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPeopleList(response.data.data.peoples);
            setCurrentPage(1); // Reset to first page on new search
        } catch (error) {
            console.log("The error is", error);
            Swal.fire({
                title: "Error!",
                text: "There was an error fetching people data.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleCheckboxChange = (_id: string) => {
        setSelectedPeople(prev => {
            if (prev.includes(_id)) {
                return prev.filter(id => id !== _id);
            } else {
                return [...prev, _id];
            }
        });
    }

    const handleSelectAll = () => {
        if (selectedPeople.length === peopleList.length) {
            // If all are selected, unselect all
            setSelectedPeople([]);
        } else {
            // Otherwise, select all current visible people
            const allCurrentIds = peopleList.map(person => person._id);
            setSelectedPeople(allCurrentIds);
        }
    }

    const handleExportData = () => {
        setExportLoading(true);
        
        const dataToExport = peopleList.map((person) => ({
            'First Name': person.firstName,
            'Last Name': person.lastName,
            'Designation': person.designation,
            'Company': person.company,
            'Industry': person.industry,
            'City': person.city,
            'Email': person.email,
            'Phone Number': person.phone_number,
            'LinkedIn': person.linkedinUrl
        }));

        // Create a new workbook and a worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'People List');

        // Generate Excel file and offer download
        XLSX.writeFile(workbook, `People_List_${new Date().toISOString().split('T')[0]}.xlsx`);
        setExportLoading(false);
    }

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
                {startPage > 1 && <span className="text-klt_primary-500 cursor-pointer" onClick={() => handlePageChange(1)}>1</span>}
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
                {endPage < totalPages && <span className="text-gray-600 cursor-pointer" onClick={() => handlePageChange(totalPages)}>{totalPages}</span>}
            </div>
        );
    };

    const handleInvitePeople = async () => {
        setLoading(true);
        if (selectedPeople.length === 0) {
            Swal.fire({
                title: "Error!",
                text: "Please select at least one person.",
                icon: "error",
            });
        }
        
        const attendees = selectedPeople.map((personId) => {
            const person = peopleList.find(p => p._id === personId);
            return {
                first_name: person?.firstName || "",
                last_name: person?.lastName || "",
                email_id: person?.email || "",
                phone_number: person?.phone_number || "",
                status: "delegate",
                alternate_mobile_number: "",
                alternate_email: "",
                company_name: person?.company || "",
                job_title: person?.designation || "",
            };
        });

        console.log(attendees);


        try {
            const response = await axios.post(`${apiBaseUrl}/api/bulk-upload-requested-attendees-without-excel`, {
                event_id: event?.id,
                user_id: user?.id,
                attendees: attendees
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.status) {
                Swal.fire({
                    title: "Success!",
                    text: "People added to list successfully.",
                    icon: "success",
                }).then(() => {
                    window.location.href = `/events/all-requested-attendees/${uuid}`;
                })
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "There was an error inviting people.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading || exportLoading) {
        return <Loader />
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>{event?.title}</h1>
                <Link
                    to="#"
                    onClick={() => {
                        window.history.back(); // Go back to the previous page
                        dispatch(heading("All Events")); // Optional: You can still dispatch the action if needed
                    }}
                    className="btn btn-error text-white btn-sm"
                >
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='mt-10'>
                <div className='flex gap-3 items-center justify-center mb-6'>
                    <input type="text" placeholder='Search by Designation' className='input input-bordered input-sm w-full max-w-xs' name='designation' value={searchData.designation} onChange={handleSearchData} />
                    <input type="text" placeholder='Search by City' className='input input-bordered w-full input-sm max-w-xs' name='city' value={searchData.city} onChange={handleSearchData} />
                    <button onClick={handleGetPeopleList} className='btn btn-primary btn-sm'>Search</button>
                </div>

                {peopleList.length > 0 ? (
                    <>
                        <div className="mb-2 flex justify-between items-center">
                            <span className="text-gray-800 font-semibold">
                                Showing {currentPeople.length} entries out of {peopleList.length}
                            </span>
                            <div className='gap-5 flex items-center'>
                                {selectedPeople.length > 0 && (
                                    <div className=" bg-gray-100 rounded-lg flex items-center gap-2">
                                        <p className="font-semibold">{selectedPeople.length} people selected</p>
                                        <button onClick={handleInvitePeople} className="btn btn-primary btn-sm">Add Selected People</button>
                                    </div>
                                )}
                                <button 
                                    onClick={handleExportData} 
                                    className="btn btn-success btn-sm text-white"
                                    disabled={peopleList.length === 0}
                                >
                                    Export to Excel
                                </button>
                                <div className="">
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
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                                <thead>
                                    <tr className="bg-klt_primary-500 text-white">
                                        <th className="py-3 px-4 text-start text-nowrap">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={peopleList.length > 0 && selectedPeople.length === peopleList.length}
                                                    onChange={handleSelectAll}
                                                />
                                                {/* <span className="ml-2">Select All</span> */}
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-start text-nowrap">S.No</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Name</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Industry</th>
                                        <th className="py-3 px-4 text-start text-nowrap">City</th>
                                        <th className="py-3 px-4 text-start text-nowrap">LinkedIn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPeople.map((person, index) => (
                                        <tr key={person._id} className="bg-white border-b border-gray-400 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={selectedPeople.includes(person._id)}
                                                    onChange={() => handleCheckboxChange(person._id)}
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.firstName} {person.lastName}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.designation}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.company}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.industry}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.city}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">
                                                {person.linkedinUrl && (
                                                    <a
                                                        href={person.linkedinUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        View Profile
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
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
                        )}
                    </>
                ) : (
                    <div className="text-center py-10">
                        {searchData.city || searchData.designation ? (
                            <p className="text-lg text-gray-600">No people found matching your search criteria.</p>
                        ) : (
                            <p className="text-lg text-gray-600">Enter search criteria and click Search to find people.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPeople;