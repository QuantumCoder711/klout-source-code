import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { eventUUID } from '../../event/eventSlice';
import { useDispatch } from 'react-redux';
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';
import Loader from '../../../component/Loader';

type Role = 'all' | 'speaker' | 'delegate' | 'sponsor' | 'moderator' | 'panelist';

const InviteRegistrations: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    // State to keep track of selected roles and selected sending method
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(["all"]);
    const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | 'email' | null>("email");
    const [sendTime, setSendTime] = useState<'now' | 'later' | null>("now"); // State for "now" and "later" radio buttons
    const [message, setMessage] = useState<string>("");

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(false);

    const { events } = useSelector((state: RootState) => state.events);

    const currentEvent = events.find((event) => event.uuid === uuid);

    const [title, setTitle] = useState<string>(`Exclusive Invitation: ${currentEvent?.title}- Join Industry Leaders!`);


    // Effect to ensure 'all' is checked if no other roles are selected
    useEffect(() => {
        if (selectedRoles.length === 0) {
            setSelectedRoles(['all']);
        }
    }, [selectedRoles]);

    // Handle change of checkboxes
    // const handleCheckboxChange = (role: Role) => {
    //     let updatedRoles = [...selectedRoles];

    //     if (role === 'all') {
    //         // If "All" is checked, uncheck all other roles
    //         if (updatedRoles.includes('all')) {
    //             updatedRoles = [];
    //         } else {
    //             updatedRoles = ['all'];
    //         }
    //     } else {
    //         // If a role is checked or unchecked, update the list
    //         if (updatedRoles.includes(role)) {
    //             updatedRoles = updatedRoles.filter(item => item !== role);
    //             // Uncheck "All" if any specific role is deselected
    //             if (updatedRoles.includes('all')) {
    //                 updatedRoles = updatedRoles.filter(item => item !== 'all');
    //             }
    //         } else {
    //             updatedRoles.push(role);
    //             // Uncheck "All" if any specific role is selected
    //             if (updatedRoles.includes('all')) {
    //                 updatedRoles = updatedRoles.filter(item => item !== 'all');
    //             }
    //         }
    //     }

    //     setSelectedRoles(updatedRoles);
    // };

    // Function to capitalize the first letter of a role
    const capitalizeRole = (role: Role): string => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    // Converting selectedRoles array to a comma-separated string with capitalized roles
    const selectedRolesString = selectedRoles.map(capitalizeRole).join(',');


    // Handle method selection (WhatsApp or Mail)
    const handleMethodChange = (method: 'whatsapp' | 'email') => {
        setSelectedMethod(method);
    };

    // Handle sending time selection (Now or Later)
    const handleSendTimeChange = (time: 'now' | 'later') => {
        setSendTime(time);
    };

    const handleSubmit = () => {
        setLoading(true);
        // Validate that Subject and Message are filled in
        if (selectedMethod == "email") {
            if (!title || !message) {
                // Show an error message if either Subject or Message is empty
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Subject and Message are required.',
                });
                setLoading(false);
                return;
            }

        }

        let dataObj = {};
        if (currentEvent) {
            dataObj = {
                "event_id": currentEvent?.uuid,
                "send_to": selectedRolesString,
                "send_method": selectedMethod === "whatsapp" ? "whatsapp" : selectedMethod,
                "subject": title,
                "message": selectedMethod === "whatsapp" ? "Template" : message,
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
            };
        }

        try {
            axios.post(`${imageBaseUrl}/api/invitation-request-message`, dataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: '<span class="text-green-600 font-bold">Success!</span>',
                            html: `<div class="text-left p-3">
                                <p class="mb-2">✅ Your campaign has been <strong class="text-green-600">successfully scheduled</strong>!</p>
                                <p class="mb-2">⏱️ It will be delivered within the next <strong>24 hours</strong>.</p>
                                <p class="mb-2">📧 You will receive <strong>confirmation emails</strong> shortly.</p>
                                <p>📊 Track the confirmation under <a href="/events/pending-user-request/${currentEvent?.uuid}" class="text-blue-600">Pending User Delegates</a> section in your dashboard.</p>
                                </div>`,
                            customClass: {
                                popup: 'rounded-lg',
                                title: 'text-xl mb-4',
                                htmlContainer: 'text-base'
                            },
                            backdrop: `rgba(0,0,123,0.1)`,
                            showConfirmButton: true,
                            confirmButtonColor: '#4CAF50',
                            confirmButtonText: 'Great!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.history.back();
                            }
                        });
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                        // Handle timeout error
                        Swal.fire({
                            icon: 'success',
                            title: '<span class="text-green-600 font-bold">Success!</span>',
                            html: '<div class="text-left p-3">' +
                                '<p class="mb-2">✅ Your campaign has been <strong class="text-green-600">successfully scheduled</strong>!</p>' +
                                '<p class="mb-2">⏱️ It will be delivered within the next <strong>24 hours</strong>.</p>' +
                                '<p class="mb-2">📧 You will receive <strong>confirmation emails</strong> shortly.</p>' +
                                '<p>📊 Track the status under <strong class="text-blue-600">"Pending User Delegates"</strong> section in your dashboard.</p>' +
                                '</div>',
                            customClass: {
                                popup: 'rounded-lg',
                                title: 'text-xl mb-4',
                                htmlContainer: 'text-base'
                            },
                            backdrop: `rgba(0,0,123,0.1)`,
                            showConfirmButton: true,
                            confirmButtonColor: '#4CAF50',
                            confirmButtonText: 'Great!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = "/events/all-attendee";
                            }
                        });
                    } else if (error.response) {
                        // Handle other errors with a response
                        Swal.fire({
                            icon: 'error',
                            title: 'Something went wrong',
                            text: error.response?.data?.message || 'An error occurred. Please try again.',
                        });
                    } else {
                        console.log("THe network error is: ", error);
                        // Handle other errors without a response
                        Swal.fire({
                            icon: 'error',
                            title: 'Network Error',
                            text: 'An unexpected error occurred. Please check your connection and try again.',
                        });
                    }
                });
        } catch (error) {
            console.log("The error is: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'An unexpected error occurred.',
            });
            setLoading(false);
        }
    };


    if (!currentEvent) {
        return;
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            {loading && (
                <div className="w-full h-screen fixed top-0 left-0 bg-black/50 grid place-content-center">
                    <span className="loading loading-spinner text-klt_primary-500"></span>
                </div>
            )}
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Invited Registrations' />
                <Link
                    to="#"
                    onClick={() => {
                        window.history.back(); // Go back to the previous page
                        dispatch(heading("All Attendees")); // Optional: You can still dispatch the action if needed
                    }}
                    className="btn btn-error text-white btn-sm"
                >
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                {/* Message Div Wrapper */}
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send Email / SMS to Attendee for {currentEvent.title}</h6>
                    </div>

                    {/* All Fields Wrapper Div */}
                    <div className='p-5'>

                        {/* Select WhatsApp or Mail */}
                        <div className='mt-2'>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <div className="flex gap-10 pl-5">
                                {/* Radio button for Mail */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendMethod"
                                        checked={selectedMethod === 'email'}
                                        onChange={() => handleMethodChange('email')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <IoMail size={24} className='text-blue-500 ml-2' />
                                </label>

                                {/* Radio button for WhatsApp */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendMethod"
                                        checked={selectedMethod === 'whatsapp'}
                                        onChange={() => handleMethodChange('whatsapp')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <RiWhatsappFill size={24} className='text-green-500 ml-2' />
                                </label>
                            </div>
                        </div>

                        {selectedMethod === "whatsapp" && (
                            <div 
                                role="alert" 
                                className="bg-sky-400/10 border-2 border-sky-500 p-3 rounded-lg mt-10 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-sky-700">You need to first send emails.</span>
                            </div>
                        )}

                        {/* WhatsApp Message */}
                        {selectedMethod === "whatsapp" && <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-2/3 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hello, this is a follow-up reminder for the email sent for {<strong>{currentEvent.title}</strong>} happening on {<strong>{currentEvent.event_start_date}</strong>} at {<strong>{currentEvent.event_venue_name}</strong>}. <br /><br />
                                    
                                    Kindly review the same or check the link below for more details on the invitation. <br /><br />
                                    
                                    Best Regards, <br />
                                    {user?.company_name}
                                </p>
                            </div>
                        </div>}


                        {/* Subject Input */}
                        {selectedMethod === "email" && <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Subject <span className="text-red-600 ml-1">*</span></label>
                            <input
                                type="text"
                                value={title}
                                name="Subject"
                                onChange={(e) => setTitle(e.target.value)}
                                id="subject"
                                className='input w-full mt-2'
                            />
                        </div>}

                        {/* Rich Textarea */}
                        {selectedMethod === "email" && <div className="mt-10">
                            <label htmlFor="Message" className='block font-semibold'>Message <span className="text-red-600 ml-1">*</span></label>

                            {/* TinyMCE Editor */}
                            <div className="form-group">
                                <Editor
                                    apiKey="nv4qeg7zimei3mdz8lj1yzl5bakrmw4li6baiikh87f8vksz" // Get your API key from TinyMCE
                                    value={message}
                                    onEditorChange={(content) => setMessage(content)}
                                    // onEditorChange={(e)=>setTitle()}
                                    // className={`form-control ${errors.message ? "is-invalid" : ""
                                    //     }`}
                                    initialValue={`<p>
                                    We are delighted to invite you to the ${currentEvent?.title}, an exclusive gathering of top thought
                                    leaders and industry experts. This premier event is designed to foster meaningful
                                    discussions, networking, and recognition of excellence in the industry.<br /><br />

                                    📅 Date: ${currentEvent?.event_start_date}<br />
                                    📍 Location: ${currentEvent?.event_venue_name}<br /><br />

                                    Join us for an evening/day based on timing of the event of insights, connections, and
                                    celebration.<br /><br />

                                    We look forward to your participation!<br /><br />

                                    Best regards,<br />
                                    ${user?.first_name} ${user?.last_name}<br />
                                    ${user?.company_name}
                                </p>`}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            "advlist autolink lists link image charmap print preview anchor",
                                            "searchreplace visualblocks code fullscreen",
                                            "insertdatetime media table paste code help wordcount",
                                        ],
                                        toolbar:
                                            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
                                    }}
                                // onEditorChange={handleEditorChange}
                                // onBlur={handleBlur}
                                // onFocus={handleInputFocus}
                                />
                                {/* 
                                {errors.message && (
                                    <div
                                        className="invalid-feedback"
                                        style={{
                                            textAlign: "left",
                                        }}
                                    >
                                        {errors.message}
                                    </div>
                                )} */}
                            </div>
                        </div>}

                        {/* Send Time: Now or Later */}
                        <div className='mt-10 hidden'>
                            <h5 className='font-semibold mb-3'>Delivery Schedule</h5>
                            <div className="flex gap-10 pl-5">
                                {/* Radio button for Now */}
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

                                {/* Radio button for Later */}
                                {/* <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendTime"
                                        checked={sendTime === 'later'}
                                        onChange={() => handleSendTimeChange('later')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Later</span>
                                </label> */}
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
                            <Link to={`/events/view-event/${uuid}`} onClick={() => { dispatch(eventUUID(currentEvent?.uuid)); dispatch(heading('View Event')); }} className="btn btn-error text-white btn-sm ">
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
}

export default InviteRegistrations;
