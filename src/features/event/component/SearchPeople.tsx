import React, { useState, useEffect, useRef } from 'react';
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
    mobileNumber: string;
    employeeSize: string;
}

// interface LinkedInUrl {
//     email: string;
//     linkedinUrl: string;
//     mobile: string;
// }

const SearchPeople: React.FC = () => {
    const { uuid } = useParams();
    const dispatch = useAppDispatch();
    const allEvents = useSelector((state: RootState) => state.events.events);
    const event = allEvents.find((event) => event.uuid === uuid);
    const [searchData, setSearchData] = useState({
        designation: "",
        city: "",
    });

    //For revealing the button
    const [showButton, setShowButton] = useState<boolean>(false);
    const sequenceRef = useRef("");

    const [filters, setFilters] = useState({
        designation: "",
        company: "",
        city: "",
        companySize: "",
        industry: ""
    });

    const { user } = useSelector((state: RootState) => state.auth);
    const { token } = useSelector((state: RootState) => state.auth);
    const [peopleList, setPeopleList] = useState<Person[]>([]);
    const [filteredPeopleList, setFilteredPeopleList] = useState<Person[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // const [_, setSelectedPeopleLinkedin] = useState<LinkedInUrl[]>([]);
    const [exportLoading, setExportLoading] = useState(false);

    const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);

    // Apply filters whenever filters or peopleList changes
    useEffect(() => {
        applyFilters();
    }, [filters, peopleList]);

    // Reveal function
    useEffect(() => {
        const handleButtonDisplay = (event: KeyboardEvent) => {
            sequenceRef.current += event.key.toLowerCase(); // Append the typed key

            // Keep only the last 6 characters
            if (sequenceRef.current.length > 6) {
                sequenceRef.current = sequenceRef.current.slice(-6);
            }

            // Check if sequence matches "reveal"
            if (sequenceRef.current === "reveal") {
                setShowButton(true);
                sequenceRef.current = ""; // Reset sequence
            }

            // Check if sequence matches "hide"
            if (sequenceRef.current === "hide") {
                setShowButton(false);
                sequenceRef.current = ""; // Reset sequence
            }
        };

        window.addEventListener("keydown", handleButtonDisplay);
        return () => window.removeEventListener("keydown", handleButtonDisplay);
    }, []);

    // Apply filters to the people list
    const applyFilters = () => {
        let filtered = [...peopleList];

        if (filters.designation) {
            filtered = filtered.filter(person =>
                person.designation.toLowerCase().includes(filters.designation.toLowerCase())
            );
        }

        if (filters.company) {
            filtered = filtered.filter(person =>
                person.company.toLowerCase().includes(filters.company.toLowerCase())
            );
        }

        if (filters.city) {
            filtered = filtered.filter(person =>
                person.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.companySize) {
            filtered = filtered.filter(person =>
                person.employeeSize.toLowerCase().includes(filters.companySize.toLowerCase())
            );
        }

        if (filters.industry) {
            filtered = filtered.filter(person =>
                person.industry.toLowerCase().includes(filters.industry.toLowerCase())
            );
        }

        setFilteredPeopleList(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredPeopleList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPeople = filteredPeopleList.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    }

    const handleFilterData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
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

            setPeopleList(response.data.data.peoplesWithCompanySize);
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
        if (selectedPeople.length === filteredPeopleList.length) {
            // If all are selected, unselect all
            setSelectedPeople([]);
        } else {
            // Otherwise, select all current visible people
            const allCurrentIds = filteredPeopleList.map(person => person._id);
            setSelectedPeople(allCurrentIds);
        }
    }

    const handleExportData = () => {
        setExportLoading(true);

        const dataToExport = filteredPeopleList.map((person) => ({
            'First Name': person.firstName,
            'Last Name': person.lastName,
            'Designation': person.designation,
            'Company': person.company,
            'Company Size': person.employeeSize,
            'Industry': person.industry,
            'City': person.city,
            'Email': person.email,
            'Phone Number': person.mobileNumber,
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
                phone_number: String(person?.mobileNumber) || "",
                status: "delegate",
                alternate_mobile_number: "",
                alternate_email: "",
                company_name: person?.company || "",
                job_title: person?.designation || "",
                linkedin_url: person?.linkedinUrl || "",
            };
        });


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

    // const handleGetContacts = async () => {
    //     setLoading(true);
    //     const linkedinUrls = selectedPeople.map(person => peopleList.find(p => p._id === person)?.linkedinUrl);
    //     try {
    //         const response = await axios.post(`${apiBaseUrl}/api/extract-numbers-in-bulk`, {
    //             linkedinUrls
    //         }, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });
    //         setSelectedPeopleLinkedin(response.data);

    //         const data = response.data;
    //         for(let singleEntry of data){
    //             if(singleEntry.email !== ""){
    //                 peopleList.map((person) => {
    //                     if(person.linkedinUrl === singleEntry.linkedinUrl){
    //                         person.email = singleEntry.email;
    //                     }
    //                 });
    //             }

    //             if(singleEntry.mobile !== ""){
    //                 peopleList.map((person) => {
    //                     if(person.linkedinUrl === singleEntry.linkedinUrl){
    //                         person.mobileNumber = singleEntry.mobile;   
    //                     }
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         console.log("The error is: ", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

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
                                Showing {currentPeople.length} entries out of {filteredPeopleList.length}
                            </span>
                            <div className='gap-5 flex items-center'>
                                {selectedPeople.length > 0 && (
                                    <div className=" bg-gray-100 rounded-lg flex items-center gap-2">
                                        <p className="font-semibold">{selectedPeople.length} people selected</p>
                                        <button onClick={handleInvitePeople} className="btn btn-primary btn-sm">Add Selected People</button>
                                        {/* <button onClick={handleGetContacts} className='btn btn-success btn-sm text-white'>Get Contacts</button> */}
                                    </div>
                                )}
                                {showButton && <button
                                    onClick={handleExportData}
                                    className="btn btn-success btn-sm text-white"
                                    disabled={filteredPeopleList.length === 0}
                                >
                                    Export to Excel
                                </button>}
                                <div className="flex items-center gap-2">
                                    <div>
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
                        </div>
                        <div className='my-3 flex gap-3'>
                            {/* Filter by designation */}
                            <input type="text" placeholder='Search by Designation' className='input input-bordered input-sm w-full' name='designation' value={filters.designation} onChange={handleFilterData} />

                            {/* Filter by Company */}
                            <input type="text" placeholder='Search by Company' className='input input-bordered input-sm w-full' name='company' value={filters.company} onChange={handleFilterData} />

                            {/* Filter by Company Size */}
                            <input type="text" placeholder='Search by Company Size' className='input input-bordered input-sm w-full' name='companySize' value={filters.companySize} onChange={handleFilterData} />

                            {/* Filter by Industry */}
                            <input type="text" placeholder='Search by Industry' className='input input-bordered input-sm w-full' name='industry' value={filters.industry} onChange={handleFilterData} />
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
                                                    checked={filteredPeopleList.length > 0 && selectedPeople.length === filteredPeopleList.length}
                                                    onChange={handleSelectAll}
                                                />
                                                {/* <span className="ml-2">Select All</span> */}
                                            </div>
                                        </th>
                                        <th className="py-3 px-4 text-start text-nowrap">S.No</th>
                                        <th className="py-3 px-4 text-start text-nowrap">LinkedIn</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Name</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Mobile Number</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Company Size</th>
                                        <th className="py-3 px-4 text-start text-nowrap">Industry</th>
                                        <th className="py-3 px-4 text-start text-nowrap">City</th>
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
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.firstName} {person.lastName}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">
                                                {person.email ? person.email.split('@')[0].substring(0, 2) + '...@...' : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">
                                                {person.mobileNumber ? (typeof person.mobileNumber === 'string' ? person.mobileNumber.substring(0, 2) + 'xxxxxxxx' : String(person.mobileNumber).substring(0, 2) + 'xxxxxxxx') : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.designation}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.company}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.employeeSize}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.industry}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap capitalize ">{person.city}</td>
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