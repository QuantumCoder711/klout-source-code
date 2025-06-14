import React, { useEffect, useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { allEventAttendee } from '../../event/eventSlice';
import { FaEdit, FaFileExcel, FaEye, FaUserFriends, FaUserClock, FaPoll, FaUserCheck } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import HeadingH2 from '../../../component/HeadingH2';
import * as XLSX from 'xlsx';  // Import the xlsx library
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import Loader from '../../../component/Loader';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsSendFill } from 'react-icons/bs';
import { FaMessage } from 'react-icons/fa6';
import { BiSolidMessageSquareDots } from 'react-icons/bi';
import { useGlobalContext } from '../../../GlobalContext';
import dummyImage from "/dummyImage.jpg";
import { Stars } from 'lucide-react';
import { IoIosClose } from "react-icons/io";

type attendeeType = {
    uuid: string;
    title: string;
    first_name: string;
    job_title: string;
    company_name: string;
    email_id: string;
    alternate_email: string;
    phone_number: string;
    alternate_mobile_number: string;
    status: string;
    last_name: string;
    check_in: number;
    check_in_time: string;
    check_in_second: number;
    check_in_second_time: string;
    check_in_third: number;
    check_in_third_time: string;
    check_in_forth: number;
    check_in_forth_time: string;
    check_in_fifth: number;
    check_in_fifth_time: string;
    event_name: string;
    not_invited: boolean;
    image: string;
    id: number;
    award_winner: number;
};

interface AttendeeExportData {
    'First Name': string;
    'Last Name': string;
    'Designation': string;
    'Company': string;
    'Email': string;
    'Mobile': string;
    'Role': string;
    'Check In'?: string;
    'Check In Time'?: string;
    'Event Name'?: string;
    'Check In 2nd'?: string;  // Optional, will only exist if dateDifference > 1
    'Check In Time 2nd'?: string;
    'Check In 3rd'?: string;
    'Check In Time 3rd'?: string;
    'Check In 4th'?: string;
    'Check In Time 4th'?: string;
    'Check In 5th'?: string;
    'Check In Time 5th'?: string;
}

interface AllEventAttendeeProps {
    uuid: string | undefined;
}

const AllEventAttendee: React.FC<AllEventAttendeeProps> = ({ uuid }) => {
    const dispatch = useAppDispatch();

    const { count } = useGlobalContext();
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const [deleteArray, setDeleteArray] = useState<number[]>([]);

    const [deletingAttendee, setDeletingAttendee] = useState<boolean>(false);

    const [dataForDeletion, setDataForDeletion] = useState<{attendee_id: number, uuid: string}[]>([]);

    const [selectedSponsorAttendees, setSelectedSponsorAttendees] = useState<attendeeType[]>([]);
    const [sponsorId, setSponsorId] = useState<number>(0);

    const handleSponsorAttendeeSelect = (attendee: attendeeType) => {
        setSelectedSponsorAttendees(prev => [...prev, attendee]);
    }

    const handleRemoveSponsorAttendee = async (id: number) => {
        const uuid = dataForDeletion.find((data) => data.attendee_id === id)?.uuid;
        setSelectedSponsorAttendees(prev => prev.filter(attendee => attendee.id !== id));

        await axios.delete(`${apiBaseUrl}/api/delete-sponsor-attendee/${uuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    // const [selectedAction, setSelectedAction] = useState('');

    const { token } = useSelector((state: RootState) => state.auth);
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID, eventAttendee, loading, allEvents } = useSelector((state: RootState) => ({
        currentEventUUID: state.events.currentEventUUID,
        eventAttendee: state.events.eventAttendee as attendeeType[],
        loading: state.events.attendeeLoader,
        allEvents: state.events.events,
    }));

    const currentEvent = allEvents.find(event => uuid === event.uuid);

    const qrCode = `${apiBaseUrl}/${currentEvent?.qr_code}`;

    const [dateDifference, setDateDifference] = useState<number>(0);

    // Helper function to calculate the difference in days
    const calculateDateDifference = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    };

    useEffect(() => {
        if (currentEvent && token) {
            dispatch(allEventAttendee({ eventuuid: currentEvent.uuid, token }));
        }

        if (currentEvent) {
            setDateDifference(calculateDateDifference(currentEvent?.event_start_date, currentEvent?.event_end_date));
        }

        // console.log("Checked Users are: ", checkedUsers);
    }, [currentEventUUID, token]);


    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [searchDesignation, setSearchDesignation] = useState('');
    const [checkInFilter, setCheckInFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Filter attendees based on the search terms
    const filteredAttendees = eventAttendee
        .filter((attendee) => {
            const matchesName = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.toLowerCase().includes(searchName.toLowerCase());
            const matchesCompany = (attendee.company_name ?? '').toLowerCase().includes(searchCompany.toLowerCase());
            const matchesDesignation = (attendee.job_title ?? '').toLowerCase().includes(searchDesignation.toLowerCase());
            const matchesCheckIn = checkInFilter === '' ||
                attendee.check_in === Number(checkInFilter) ||
                attendee.check_in_second === Number(checkInFilter) ||
                attendee.check_in_third === Number(checkInFilter) ||
                attendee.check_in_forth === Number(checkInFilter) ||
                attendee.check_in_fifth === Number(checkInFilter);
            const matchesRole = roleFilter === '' || (attendee.status ?? '').toLowerCase() === roleFilter.toLowerCase();
            return matchesName && matchesCompany && matchesDesignation && matchesCheckIn && matchesRole;
        })
        // .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time)); // Sort in descending order
        // Ensure check_in_time is parsed as a Date object for comparison
        .sort((a, b) => {
            const dateTimeA = new Date(a.check_in_time).getTime(); // Convert Date to timestamp (number)
            const dateTimeB = new Date(b.check_in_time).getTime(); // Convert Date to timestamp (number)

            return dateTimeB - dateTimeA; // Descending order
        });

    // console.log("Checked Users are: ", checkedUsers2ndDay);

    useEffect(() => {
        // console.log(filteredAttendees)
    }, [checkInFilter]);

    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // const [currentAttendees, setCurrentAttendees] = useState<attendeeType[]>(filteredAttendees.slice(startIndex, endIndex));

    const currentAttendees: attendeeType[] = filteredAttendees.slice(startIndex, endIndex);
    console.log(currentAttendees);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleExport = () => {
        const data = filteredAttendees.map((attendee) => {
            console.log("The date difference is: ", dateDifference);
            const result: AttendeeExportData = {
                'First Name': attendee.first_name,
                'Last Name': attendee.last_name,
                'Designation': attendee.job_title,
                'Company': attendee.company_name,
                'Email': attendee.email_id,
                'Mobile': attendee.phone_number,
                'Role': attendee.status,
            };

            // Conditionally add check-ins based on dateDifference
            if (dateDifference >= 0) {
                result['Check In'] = attendee.check_in === 1 ? 'Yes' : 'No',
                    result["Check In Time"] = attendee.check_in_time;
            }
            if (dateDifference >= 1) {
                result['Check In 2nd'] = attendee.check_in_second === 2 ? 'Yes' : 'No';
                result["Check In Time 2nd"] = attendee.check_in_second_time;
            }
            if (dateDifference >= 2) {
                result['Check In 3rd'] = attendee.check_in_third === 3 ? 'Yes' : 'No';
                result["Check In Time 3rd"] = attendee.check_in_third_time;
            }
            if (dateDifference >= 3) {
                result['Check In 4th'] = attendee.check_in_forth === 4 ? 'Yes' : 'No';
                result["Check In Time 4th"] = attendee.check_in_forth_time;
            }
            if (dateDifference >= 4) {
                result['Check In 5th'] = attendee.check_in_fifth === 5 ? 'Yes' : 'No';
                result["Check In Time 5th"] = attendee.check_in_fifth_time;
            }

            result["Event Name"] = attendee.event_name;
            return result;
        });


        // Create a new workbook and a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

        // Generate Excel file and offer download
        XLSX.writeFile(workbook, eventAttendee[0].event_name + '.xlsx');
    };

    const handleSaveSponsorAttendees = async () => {
        setPageLoading(true);
        try {
            const attendeeIds = selectedSponsorAttendees.map(attendee => attendee.id);
            const response = await axios.post(`${apiBaseUrl}/api/add-multiple-sponsor-attendee`, {
                "event_id": currentEvent?.id,
                "attendee_ids": attendeeIds,
                "sponsor_id": sponsorId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Sponsor attendees saved successfully!",
                });
                window.location.reload();
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong!",
            });
        } finally {
            setPageLoading(false);
        }
    }


    const handleModal = async (id: number) => {
        setSponsorId(id);
        (document.getElementById('sponsor_modal') as HTMLDialogElement).showModal();

        const response = await axios.post(`${apiBaseUrl}/api/get-sponsor-attendee`, {
            event_id: currentEvent?.id,
            sponsor_id: id,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.data.status === 200) {
            setDataForDeletion(response.data.data);
            const data = response.data.data.map((ids: any) => ids.attendee_id);
            const attendeesarray = data.map((id: number) => {
                return eventAttendee.find((attendee) => attendee.id === id);
            });
            setSelectedSponsorAttendees(attendeesarray);
        }
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
                {startPage > 1 && <span className="text-klt_primary-500">1</span>}
                {startPage > 2 && <span className="text-klt_primary-500">...</span>}
                {paginationNumbers.map((number) => (
                    <button
                        key={number}
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'
                            }`}
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

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${apiBaseUrl}/api/attendees/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(function (res) {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                        // setFilteredAgendaData(prevAgendas => prevAgendas.filter(agenda => agenda.uuid !== uuid));
                        // setCurrentAttendees(prevAttendee => prevAttendee.filter(attendee => attendee.id !== id));
                    })
                    .catch(function () {
                        Swal.fire({
                            icon: "error",
                            title: "An Error Occured!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
            }
        });
    }

    const showQRCode = (title: string | undefined) => {
        Swal.fire({
            title: title || "QR Code",
            // text: 'Here is your QR code',
            imageUrl: qrCode,
            imageHeight: "300px",
            imageWidth: "300px",
            confirmButtonText: 'OK'
        });
    }

    const showImage = (
        img: string,
        firstName: string,
        lastName: string,
        email: string,
        jobTitle: string,
        companyName: string,
        phoneNumber: string,
        alternateEmail: string,
        status: string
    ) => {
        const agendaImage = `${apiBaseUrl}/${img}`;

        if (img === " ") {
            img = "";
        }

        // console.log(img);

        Swal.fire({
            title: `${firstName} ${lastName}`,
            width: "750px",
            text: email,
            imageUrl: img ? agendaImage : dummyImage,  // Use provided image or fallback
            imageHeight: "300px",
            imageWidth: "300px",
            html: `
                <div style="display: flex; font-size: 14px; gap: 64px; justify-content: center">
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px">
                <div style="width:fit; text-align: left;"><strong>Job Title:</strong> ${jobTitle}</div>
                <div style="width:fit; text-align: left;"><strong>Email:</strong> ${email}</div>
                <div style="width:fit; text-align: left;"><strong>Company:</strong> ${companyName}</div>
                </div>
    
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px">
                <div style="width:fit; text-align: left;"><strong>Phone:</strong> ${phoneNumber}</div>
                <div style="width:fit; text-align: left;"><strong>Alternate Email:</strong> ${alternateEmail || '-'}</div>
                <div style="width:fit; text-align: left;"><strong>Status:</strong> ${status}</div>
                </div>
                </div>
            `,
            confirmButtonText: 'OK'
        });
    }

    // const deleteAttendee = (id: number, checked: boolean) => {
    //     if (checked) {
    //         const obj = { id };

    //         // Check if the object already exists in the array
    //         const exists = deleteArray.some((item) => item.id === id);

    //         if (!exists) {
    //             setDeleteArray([...deleteArray, obj]); // Add only if it doesn't already exist
    //             console.log("The Delete Array is: ", [...deleteArray, obj]);
    //         } else {
    //             console.log("The item already exists in the delete array:", deleteArray);
    //         }
    //     }

    //     else {
    //         // Remove the object from array
    //         const updatedArray = deleteArray.filter((item) => item.id !== id);
    //         setDeleteArray(updatedArray);
    //     }
    // };

    // const deleteAttendee = (id: number, checked: boolean) => {
    //     if (checked) {
    //         // Add the ID to the deleteArray if it doesn't already exist
    //         if (!deleteArray.includes(id)) {
    //             setDeleteArray([...deleteArray, id]); // Add ID to the array
    //             console.log("The Delete Array is: ", [...deleteArray, id]);
    //         } else {
    //             console.log("The item already exists in the delete array:", deleteArray);
    //         }
    //     } else {
    //         // Remove the ID from the deleteArray
    //         const updatedArray = deleteArray.filter((item) => item !== id);
    //         setDeleteArray(updatedArray);
    //     }
    // };

    // const handleSelectAll = (isChecked: boolean) => {
    //     console.log("Inside handle select all: ", isChecked);
    //     // const isChecked = e.target.checked;

    //     if (isChecked) {
    //         const allIds = currentAttendees.map((attendee) => attendee.id);
    //         setDeleteArray(allIds);
    //         console.log("Delete Array is: ", deleteArray);

    //     } else {
    //         setDeleteArray([]);
    //         console.log("Delete Array is: ", deleteArray);
    //     }
    // };


    const deleteAttendee = (id: number, checked: boolean) => {
        setDeleteArray((prevDeleteArray) => {
            if (checked) {
                // Add the ID to the deleteArray if not already present
                if (!prevDeleteArray.includes(id)) {
                    return [...prevDeleteArray, id];
                }
            } else {
                // Remove the ID from deleteArray
                return prevDeleteArray.filter(item => item !== id);
            }
            return prevDeleteArray; // No change if the id is already in the array
        });
    };

    // Handle "Select All" checkbox
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allIds = filteredAttendees.map((attendee) => attendee.id);
            setDeleteArray(allIds); // Select all attendees
        } else {
            setDeleteArray([]); // Deselect all attendees
        }
    };

    // useEffect to track changes in deleteArray (optional, for logging or side effects)
    useEffect(() => {
        console.log('Delete array updated:', deleteArray);
    }, [deleteArray]);

    const handleDeleteAttendees = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your selected attendees will be deleted forever.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((res) => {
            if (res.isConfirmed) {
                setDeletingAttendee(true);
                axios.post(`${apiBaseUrl}/api/delete-multiple-attendees`, {
                    ids: deleteArray
                },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                ).then(res => {
                    Swal.fire({
                        icon: "success",
                        title: res.data.message,
                        showConfirmButton: true,
                    }).then(_ => {
                        setDeletingAttendee(false);
                        window.location.reload();
                    }
                    );
                }).catch(res => {
                    Swal.fire({
                        icon: "error",
                        title: res.data.message,
                        showConfirmButton: true,
                    }).then(_ => {
                        setDeletingAttendee(false);
                        window.location.reload();
                    })
                })
            }
        })
    }

    const handleManualCheckIn = async (attendee_uuid: string) => {
        Swal.fire({
            title: "Are You Sure ?",
            text: "Are you sure want to mark this user as checked in ?",
            icon: "info",
            showCancelButton: true,
        }).then(res => {
            if (res.isConfirmed) {
                axios.post(`${apiBaseUrl}/api/manual-check-in`, {
                    user_id: user?.id,
                    attendee_uuid,
                    event_id: currentEvent?.id
                }).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire({
                            title: "Success",
                            icon: "success",
                            text: "Attendee is marked check in now"
                        }).then(() => window.location.reload());
                    }
                    else {
                        Swal.fire({
                            title: "Error",
                            icon: "error",
                            text: "Failed to mark check in"
                        });
                    }
                })
            }
        });
    }

    if (loading || deletingAttendee || pageLoading) {
        return <Loader />
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <HeadingH2 title={eventAttendee[0]?.event_name || 'Event Attendees'} />

                <div className='flex items-center gap-3'>
                    <button onClick={() => showQRCode(currentEvent?.title)} className='btn-sm text-white bg-amber-400 hover:bg-amber-500 btn'>QR Code</button>
                    <Link
                        to="#"
                        onClick={() => {
                            window.history.back(); // Go back to the previous page
                        }}
                        className="btn btn-error text-white btn-sm"
                    >
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>
            <br />

            <div className="flex items-center flex-wrap gap-2 mb-4">
                <Link
                    to={`/events/add-attendee/${uuid}`}
                    onClick={() => { dispatch(heading('Add Attendee')) }}
                    className="btn btn-secondary text-white btn-xs"
                    title="Add a new attendee"
                >
                    <FaUserFriends /> Add Attendee
                </Link>

                <Link
                    to={`/events/send-reminder/${uuid}`}
                    onClick={() => { dispatch(heading('Send Reminder')); }}
                    className="btn btn-accent text-white btn-xs"
                    title="Send a reminder to attendees"
                >
                    <BsSendFill /> Send Reminder
                </Link>

                <Link
                    // to="/events/send-invitation"
                    to={`/events/send-invitation/${uuid}`}
                    onClick={() => { dispatch(heading('Send Invitation')); }}
                    className="btn hidden btn-primary text-white btn-xs"
                    title="Send an invitation to attendees"
                >
                    <FaMessage /> Send Invitation
                </Link>

                <Link
                    // to="/events/same-day-reminder"
                    to={`/events/same-day-reminder/${uuid}`}
                    onClick={() => { dispatch(heading('Send Same Day Reminder')); }}
                    className="btn btn-warning text-white btn-xs"
                    title="Send a same day reminder"
                >
                    <BiSolidMessageSquareDots /> Send Same Day Reminder
                </Link>

                <Link
                    // to="/events/send-poll"
                    to={`/events/send-poll/${uuid}`}
                    onClick={() => { dispatch(heading('Send Poll')); }}
                    className="btn btn-info text-white btn-xs"
                    title="Send a poll to attendees"
                >
                    <FaPoll /> Send Poll
                </Link>

                <Link
                    // to="/events/send-to-app"
                    to={`/events/send-to-app/${uuid}`}
                    onClick={() => { dispatch(heading('Send In App Message')); }}
                    className="btn btn-primary text-white btn-xs"
                    title="Send an in-app message"
                >
                    <FaMessage /> Send In App Message
                </Link>

                <Link
                    // to="/events/pending-user-request"
                    to={`/events/pending-user-request/${uuid}`}
                    onClick={() => { dispatch(heading("Pending Requests")) }}
                    className="btn btn-error text-white btn-xs"
                    title="View pending user requests"
                >
                    <FaUserClock /> Pending User Request
                </Link>

                <Link
                    // to="/events/send-multiple-message"
                    to={`/events/send-multiple-message/${uuid}`}
                    onClick={() => { dispatch(heading('Send Template Message')); }}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white btn-xs"
                    title="Send template message to multiple users"
                >
                    <BsSendFill /> Send Template Message
                </Link>

                <Link
                    // to="/events/session-reminder"
                    to={`/events/session-reminder/${uuid}`}
                    onClick={() => { dispatch(heading('Session Reminder')); }}
                    className="btn bg-fuchsia-500 hover:bg-fuchsia-600 text-white btn-xs"
                    title="Send a session reminder"
                >
                    <BsSendFill /> Session Reminder
                </Link>

                <Link
                    // to="/events/day-two-reminder"
                    to={`/events/day-two-reminder/${uuid}`}
                    onClick={() => { dispatch(heading('Day 2 Reminder')); }}
                    className="btn bg-emerald-500 hover:bg-emerald-600 text-white btn-xs"
                    title="Send a Day 2 reminder"
                >
                    <BsSendFill /> Day Two Reminder
                </Link>

                <Link
                    // to="/events/reminder-to-visit-booth"
                    to={`/events/reminder-to-visit-booth/${uuid}`}
                    onClick={() => { dispatch(heading('Reminder Visit Booth')); }}
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white btn-xs"
                    title="Send reminder to visit booth"
                >
                    <BsSendFill /> Reminder Visit Booth
                </Link>

                <Link
                    // to="/events/day_two_same_day_reminder"
                    to={`/events/day_two_same_day_reminder/${uuid}`}
                    onClick={() => { dispatch(heading('Day Two Same Day Reminder')); }}
                    className="btn bg-purple-500 hover:bg-purple-600 text-white btn-xs"
                    title="Send Day 2 same day reminder"
                >
                    <BsSendFill /> Day Two Same Day Reminder
                </Link>

                <Link
                    // to="/events/thank-you-message"
                    to={`/events/thank-you-message/${uuid}`}
                    onClick={() => { dispatch(heading('Thank You Message')); }}
                    className="btn bg-rose-500 hover:bg-rose-600 text-white btn-xs"
                    title="Send a thank you message"
                >
                    <BsSendFill /> Thank You Message
                </Link>

                <button
                    className="btn btn-success btn-outline btn-sm ml-auto"
                    onClick={handleExport}
                    title="Export attendee data"
                >
                    <FaFileExcel /> Export Data
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between flex-col-reverse min-[1440px]:flex-row gap-5 items-center">
                    {/* Search inputs */}
                    <div className="mb-2 flex justify-start flex-wrap gap-2">
                        {/* Show dropdown */}
                        <div className="mb-2 flex items-center h-full">
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
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by company"
                            value={searchCompany}
                            onChange={(e) => {
                                setSearchCompany(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by designation"
                            value={searchDesignation}
                            onChange={(e) => {
                                setSearchDesignation(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />

                        {/* Check-in filter */}
                        <select
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
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
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
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

                        {/* For Deleting multiple Attendees */}
                        <button onClick={handleDeleteAttendees} disabled={deleteArray.length === 0 ? true : false} className='bg-red-500 disabled:bg-neutral-300 text-white btn-sm max-h-[40px] h-full rounded-md'>Delete Attendees</button>
                    </div>

                    {/* Total Attendee Info */}
                    <div className="mb-2 text-right min-w-fit">
                        <span className="text-gray-800 font-semibold">
                            Total Attendee: {count || currentEvent?.total_attendee}
                        </span>
                        <br />
                        <span className="text-gray-800 font-semibold">
                            {/* Checked In: {eventAttendee.filter((item) => item.check_in === 1).length} */}

                            {dateDifference >= 0 && (
                                <p>Checked In 1st: {count || (eventAttendee.filter((item) => item.check_in === 1).length)}</p>
                            )}

                            {dateDifference >= 1 && (
                                <p>Checked In 2nd: {eventAttendee.filter((item) => item.check_in_second === 1).length}</p>
                            )}

                            {dateDifference >= 2 && (
                                <p>Checked In 3rd: {eventAttendee.filter((item) => item.check_in_third === 1).length}</p>
                            )}

                            {dateDifference >= 3 && (
                                <p>Checked In 4th: {eventAttendee.filter((item) => item.check_in_forth === 1).length}</p>
                            )}

                            {dateDifference >= 4 && (
                                <p>Checked In 5th: {eventAttendee.filter((item) => item.check_in_fifth === 1).length}</p>
                            )}
                        </span>

                        <span className="text-gray-800 font-semibold">
                            Search Result: {filteredAttendees.length}
                        </span>
                    </div>
                </div>

                {/* Table */}
                {/* Table or Loader */}
                <div className="overflow-x-auto max-w-full">
                    {loading ? (
                        <div className="flex justify-center items-center py-6">
                            <Loader /> {/* Display the loader component */}
                        </div>
                    ) : (

                        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                            <thead>
                                <tr className="bg-klt_primary-500 text-white">
                                    <th className="py-3 px-4 text-start text-nowrap"><input type="checkbox" className='size-5' onClick={(e: any) => handleSelectAll(e.target.checked)} /></th>
                                    <th className="py-3 px-4 text-start text-nowrap">#</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Alternate Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Mobile</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Alternate Mobile</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Role</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Award Winner</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (1st) </th>
                                    <th className="py-3 px-4 text-start text-nowrap flex gap-3">Check In Time<br /> (1st)
                                        {/* <span className='flex flex-col justify-between'><IoMdArrowDropup className='scale-105 cursor-pointer'/> <IoMdArrowDropup className='rotate-180 scale-105 cursor-pointer'/></span>  */}
                                    </th>

                                    {dateDifference > 0 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (2nd)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (2nd)</th>
                                        </>
                                    )}
                                    {dateDifference > 1 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (3rd)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (3rd)</th>
                                        </>
                                    )}
                                    {dateDifference > 2 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (4th)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (4th)</th>
                                        </>
                                    )}
                                    {dateDifference > 3 && (
                                        <>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In <br /> (5th)</th>
                                            <th className="py-3 px-4 text-start text-nowrap">Check In Time <br /> (5th)</th>
                                        </>
                                    )}
                                    <th className="py-3 px-4 text-start text-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAttendees.length > 0 ? (
                                    currentAttendees.map((attendee: attendeeType, index) => (
                                        <tr key={attendee.uuid}
                                            // style={{
                                            //     backgroundColor: attendee.not_invited === "1" ? 'yellow' : '', // Convert conditional class to style here
                                            // }}
                                            className={`${attendee.not_invited ? "bg-yellow-100" : ""}`}
                                        >
                                            <td className='py-3 px-4 !size-5'><input type='checkbox' checked={deleteArray.includes(attendee.id)} onClick={(e: any) => deleteAttendee(attendee.id, e.target.checked)} /></td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{`${attendee.first_name} ${attendee.last_name}`}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.job_title}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.company_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.email_id}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.alternate_email ? attendee.alternate_email : "-"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.phone_number}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.alternate_mobile_number ? attendee.alternate_mobile_number : "-"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.status}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.award_winner ? "Yes" : "No"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                                                {attendee.check_in === 1 ? 'Yes' : 'No'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in === 1 ? 'green' : 'red' }}>
                                                {attendee.check_in_time ? (
                                                    <>
                                                        {/* Date part */}
                                                        {attendee.check_in_time.split(' ')[0]} <br />
                                                        {/* Time part in bold */}
                                                        <span style={{ fontWeight: 'bold' }}>
                                                            {attendee.check_in_time.split(' ')[1]}
                                                        </span>
                                                    </>
                                                ) : '-'}
                                            </td>

                                            {dateDifference > 0 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_second === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_second === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_second_time ? (
                                                            <>
                                                                {attendee.check_in_second_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_second_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 1 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_third === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_third === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_third_time ? (
                                                            <>
                                                                {attendee.check_in_third_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_third_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 2 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_forth === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_forth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_forth_time ? (
                                                            <>
                                                                {attendee.check_in_forth_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_forth_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            {dateDifference > 3 && (
                                                <>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_fifth === 1 ? 'Yes' : 'No'}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-800 text-nowrap" style={{ color: attendee.check_in_fifth === 1 ? 'green' : 'red' }}>
                                                        {attendee.check_in_fifth_time ? (
                                                            <>
                                                                {attendee.check_in_fifth_time.split(' ')[0]} <br />
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                    {attendee.check_in_fifth_time.split(' ')[1]}
                                                                </span>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                </>
                                            )}
                                            <td className="py-3 px-4 text-gray-800 text-nowrap flex items-center gap-2">
                                                {attendee.status === 'sponsor' && (
                                                    <button onClick={() => handleModal(attendee.id)}>
                                                        <Stars className='text-yellow-600 hover:text-yellow-700' />
                                                    </button>
                                                )}
                                                <dialog id="sponsor_modal" className="modal">
                                                    <div className="modal-box max-w-3xl">
                                                        <h3 className="font-bold text-lg mb-4">Sponsor Details</h3>
                                                        <p className="mb-4">This attendee is a sponsor.</p>

                                                        {/* Tagged attendees section */}
                                                        {selectedSponsorAttendees.length > 0 && (
                                                            <div className="mb-4">
                                                                <h4 className="font-semibold mb-2">Tagged Attendees:</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {selectedSponsorAttendees.map(attendee => (
                                                                        <span
                                                                            key={attendee.id}
                                                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1"
                                                                        >
                                                                            {attendee.first_name + attendee.last_name}
                                                                            <button
                                                                                onClick={()=>handleRemoveSponsorAttendee(attendee.id)}
                                                                                className="text-green-800 hover:text-red-600"
                                                                            >
                                                                                <IoIosClose size={20} />
                                                                            </button>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Attendees list */}
                                                        <div className="mt-4">
                                                            <h4 className="font-semibold mb-2">Select Attendees:</h4>
                                                            <div className="overflow-y-auto max-h-60 border rounded-lg">
                                                                <table className="min-w-full bg-white">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                                            <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200">
                                                                        {currentAttendees.filter(attendee => attendee.status !== 'sponsor').map((attendee: attendeeType) => (
                                                                            <tr key={attendee.id} className="hover:bg-gray-50">
                                                                                <td className="py-2 px-4 text-sm text-gray-700">{attendee.first_name + attendee.last_name}</td>
                                                                                <td className="py-2 px-4 text-sm text-gray-700">{attendee.company_name}</td>
                                                                                <td className="py-2 px-4 text-sm">
                                                                                    <button
                                                                                        onClick={() => handleSponsorAttendeeSelect(attendee)}
                                                                                        className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                                                                                        disabled={selectedSponsorAttendees.some(item => item.id === attendee.id)}
                                                                                    >
                                                                                        {selectedSponsorAttendees.some(item => item.id === attendee.id) ? 'Selected' : 'Select'}
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        <div className="modal-action">
                                                            <form method="dialog" className="flex gap-2">
                                                                <button className="btn btn-primary" onClick={handleSaveSponsorAttendees}>Save</button>
                                                                <button className="btn">Close</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                                <span
                                                    onClick={() => showImage(
                                                        attendee.image,
                                                        attendee.first_name,
                                                        attendee.last_name,
                                                        attendee.email_id,
                                                        attendee.job_title,
                                                        attendee.company_name,
                                                        attendee.phone_number,
                                                        attendee.alternate_email,
                                                        attendee.status
                                                    )}
                                                    className='w-6 h-6 p-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 rounded-full grid place-content-center'>
                                                    <FaEye className='text-black/70' />
                                                </span>

                                                <Link to={`/events/edit-attendee/${attendee.uuid}/${currentEvent?.id}`} onClick={() => { dispatch(heading("Edit Attendee")) }} className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleManualCheckIn(attendee.uuid)}>
                                                    <FaUserCheck className='text-green-600 hover:text-green-700' />
                                                </button>
                                                <button onClick={() => handleDelete(attendee.id)} className="text-red-500 hover:text-red-700">
                                                    <MdDelete />
                                                </button>
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
                    )}
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
        </>
    );
};

export default AllEventAttendee;
