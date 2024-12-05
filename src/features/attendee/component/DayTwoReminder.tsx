import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { eventUUID } from '../../event/eventSlice';
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';

const DayTwoReminder: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
    const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | null>("whatsapp");  // Default to whatsapp only
    const [selectedCheckedUser, setSelectedCheckedUser] = useState<'checkedIn' | 'nonCheckedIn' | 'all'>("all");
    const [sendTime, setSendTime] = useState<'now' | 'later' | null>("now");

    const [loading, setLoading] = useState<boolean>(false);
    // const [currentAttendee] = useSelector((state: RootState)=>state.attendee)

    // const [link, setLink] = useState('abc');
    // const [error, setError] = useState('');

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setLink(value);

    //     // Regular expression to validate a URL
    //     const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    //     if (value && !urlPattern.test(value)) {
    //         setError('Please enter a valid URL');
    //     } else {
    //         setError('');
    //     }
    // };

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { currentEvent } = useSelector((state: RootState) => state.events);

    // Handle method selection (WhatsApp only now)
    const handleMethodChange = () => {
        setSelectedMethod('whatsapp');
    };

    // Handle selection of user status (All, CheckedIn, Non-CheckedIn)
    const handleCheckedUser = (status: 'checkedIn' | 'nonCheckedIn' | 'all') => {
        setSelectedCheckedUser(status);
    };

    // Handle sending time selection (Now or Later)
    const handleSendTimeChange = (time: 'now' | 'later') => {
        setSendTime(time);
    };

    // Handle individual role checkbox change
    const handleCheckboxChange = (role: string) => {
        if (role === 'all') {
            // If "All" is checked, select all roles
            if (selectedRoles.includes('all')) {
                setSelectedRoles([]);
            } else {
                setSelectedRoles(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
            }
        } else {
            // If any individual role is checked/unchecked, update the selected roles
            if (selectedRoles.includes(role)) {
                setSelectedRoles(selectedRoles.filter((r) => r !== role));
            } else {
                setSelectedRoles([...selectedRoles, role]);
            }
        }
    };

    const handleSubmit = () => {
        // if(!link) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Validation Error',
        //         text: 'Poll link is required.',
        //     });
        //     return;
        // }
        // const formData = new FormData();
        let dataObj = {};
        if (currentEvent) {
            dataObj = {
                // "link": link,
                "event_id": currentEvent?.uuid,
                "send_to": 'All',
                "send_method": "whatsapp",
                "subject": "",
                "message": "Template",
                "start_date": currentEvent?.event_start_date,
                "delivery_schedule": sendTime,
                "start_date_time": "01",
                "start_date_type": "am",
                "end_date": currentEvent?.event_end_date,
                "end_date_time": "01",
                "end_date_type": "pm",
                "no_of_times": "1",
                "hour_interval": "1",
                "status": 1,
                "check_in": selectedCheckedUser === 'all' ? 2 :
                    selectedCheckedUser === 'checkedIn' ? 1 : 0
            };
        }

        // console.log(dataObj); // Check if `check_in` is added correctly

        setLoading(true);

        try {
            axios.post(`${imageBaseUrl}/api/day-two-reminder`, dataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
                .then(res => {
                    // Check if the response is successful (status 200)
                    setLoading(false);
                    if (res.status === 200) {
                        // Show success message using SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'The day two reminder was sent successfully!',
                        }).then((result) => {
                            // Check if the OK button was clicked
                            if (result.isConfirmed) {
                                // Navigate to the '/events/all-attendee' route
                                window.location.href = "/events/all-attendee";
                            }
                        });
                    }
                })
                .catch(error => {
                    // Show error message if there is any issue
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong',
                        text: error.response?.data?.message || 'An error occurred. Please try again.'
                    });
                });
        } catch (error) {
            // Catch any unexpected errors
            console.log(error)
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'An unexpected error occurred.'
            });
        }
    }

    // Check if all roles are selected
    const isAllSelected = selectedRoles.length === 6;

    if (!currentEvent) {
        return null;
    }

    return (
        <div>
            {loading && (
                <div className="w-full h-screen fixed top-0 left-0 bg-black/50 grid place-content-center">
                    <span className="loading loading-spinner text-klt_primary-500"></span>
                </div>
            )}
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Send WhatsApp to Attendee' />
                <Link to="/events/all-attendee" onClick={()=>dispatch(heading("All Attendee"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send WhatsApp to Attendee for {currentEvent.title}</h6>
                    </div>

                    <div className='p-5'>
                        {/* Select Roles */}
                        <div className='mt-2'>
                            <h5 className='font-semibold mb-3'>Select Roles</h5>
                            <div className="flex flex-row text-sm items-center justify-between pl-5">
                                {/* Checkbox for All Roles */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={() => handleCheckboxChange('all')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>All</span>
                                </label>

                                {/* Other checkboxes for individual roles like speaker, delegate, etc. */}
                                {['speaker', 'delegate', 'sponsor', 'moderator', 'panelist'].map((role) => (
                                    <label key={role} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role)}
                                            onChange={() => handleCheckboxChange(role)}
                                            className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                        />
                                        <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Send By */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendMethod"
                                    checked={selectedMethod === 'whatsapp'}
                                    onChange={handleMethodChange}
                                    className="bg-transparent border-zinc-400"
                                />
                                <RiWhatsappFill size={24} className='text-green-500' />
                            </label>
                        </div>

                        {/* User Status */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send to</h5>
                            <div className="flex gap-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'all'}
                                        onChange={() => handleCheckedUser('all')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>All</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'checkedIn'}
                                        onChange={() => handleCheckedUser('checkedIn')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Checked In</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'nonCheckedIn'}
                                        onChange={() => handleCheckedUser('nonCheckedIn')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Non-Checked In</span>
                                </label>
                            </div>
                        </div>

                        {/* WhatsApp Message */}
                        <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-1/2 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi "<strong>firstname</strong>", just a reminder for our event "<strong>Event-Title</strong>". We're excited to welcome you to this exclusive event. "<strong>Event-Date-Time</strong>". <br /> <br /> To ensure a smooth check-in experience, please download the Klout Club app in advance. You can download it here <a href="https://onelink.to/r3fzb9" className='font-bold'>https://onelink.to/r3fzb9</a>
                                </p>
                            </div>
                        </div>

                        {/* Poll Link */}
                        {/* <div className='mt-10'>
                            <label htmlFor="link" className="block text-gray-700 font-semibold">
                                Link <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="link"
                                type="text"
                                value={link}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Enter your link here"
                            />
                            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                        </div> */}

                        {/* WhatsApp Message */}
                        {/*<div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-1/2 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi <strong>User</strong>, <br /> <br />
                                    Hope you're enjoying the <strong>{currentEvent.title}</strong> 🎉 We'd love for you to take a moment to fill out this quick poll/survery: <strong>link</strong> <br /> <br />
                                    Thank you for your time! <br />
                                </p>
                            </div>
                        </div>*/}

                        {/* Send Time: Now or Later */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Delivery Schedule</h5>
                            <div className="flex gap-10 pl-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendTime"
                                        checked={sendTime === 'now'}
                                        onChange={() => handleSendTimeChange('now')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Now</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendTime"
                                        checked={sendTime === 'later'}
                                        onChange={() => handleSendTimeChange('later')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Later</span>
                                </label>
                            </div>
                        </div>

                        <button onClick={handleSubmit} className='px-4 py-3 mt-10 bg-klt_primary-500 text-white font-semibold rounded-md'>Submit Now</button>
                    </div>
                </div>

                {/* Event Details Div Wrapper */}
                <div className='border border-zinc-400 w-2/6 rounded-xl'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Event Details</h6>
                    </div>

                    <div className='p-5'>
                        <img
                            className='w-full rounded-xl'
                            src={`${imageBaseUrl}/${currentEvent?.image}`} alt="event image" />

                        <h3 className='text-xl mt-2 font-medium'>{currentEvent?.title}</h3>
                        <div className='grid place-content-end mt-2'>
                            <Link to={"/events/view-event/"} onClick={() => { dispatch(eventUUID(currentEvent?.uuid)); dispatch(heading('View Event')); }} className="btn btn-error text-white btn-sm ">
                                View Event <IoMdArrowRoundBack size={20} className='rotate-180' />
                            </Link>
                        </div>

                        <div className='w-full bg-zinc-200 mt-5 rounded-xl p-5'>
                            <div>
                                <h4 className='font-bold mb-2'>Date</h4>
                                <p>Start Date - {currentEvent.event_start_date}</p>
                                <p>End Date - {currentEvent.event_end_date}</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Time</h4>
                                <p>From {currentEvent.start_time + ':' + currentEvent.start_minute_time + ' ' + currentEvent.start_time_type} - {currentEvent.end_time + ':' + currentEvent.end_minute_time + ' ' + currentEvent.end_time_type}</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Location</h4>
                                <p>{currentEvent.event_venue_name} <br />
                                    {currentEvent.event_venue_address_1}</p>
                            </div>
                        </div>

                        <div className='mt-4'>
                            <h4 className='font-bold mb-2'>Description</h4>
                            <p>{currentEvent.description}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayTwoReminder;
