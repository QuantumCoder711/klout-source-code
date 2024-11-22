import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { eventUUID } from '../../event/eventSlice';
import { heading } from '../../heading/headingSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from "../../../../public/logo.png";

interface DataObj {
    event_id?: number; // You can mark it optional if it might not always be provided
    title?: string;
    message?: string;
    check_in?: number; // Ensure that check_in is a number, or you can make it a boolean if needed
}

const SendToApp: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [selectedMethod, setSelectedMethod] = useState<'kloutApp'>("kloutApp");  // Default to whatsapp only
    const [selectedCheckedUser, setSelectedCheckedUser] = useState<'checkedIn' | 'nonCheckedIn' | 'all'>("all");

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { currentEvent } = useSelector((state: RootState) => state.events);

    console.log(currentEvent);

    // Handle method selection (WhatsApp only now)
    const handleMethodChange = () => {
        setSelectedMethod('kloutApp');
    };

    // Handle selection of user status (All, CheckedIn, Non-CheckedIn)
    const handleCheckedUser = (status: 'checkedIn' | 'nonCheckedIn' | 'all') => {
        setSelectedCheckedUser(status);
    };

    console.log(currentEvent);
    console.log(message);
    const handleSubmit = () => {
        // const formData = new FormData();
        let dataObj: DataObj = {

        };
        if (currentEvent) {
            dataObj = {
                "event_id": currentEvent?.id,
                "title": title,
                "message": message,
            };
            // Use property assignment instead of append()
            if (selectedCheckedUser === 'checkedIn') {
                dataObj.check_in = 1; // Direct assignment
            }

            if (selectedCheckedUser === 'nonCheckedIn') {
                dataObj.check_in = 0; // Direct assignment
            }
        }

        console.log(dataObj); // Check if `check_in` is added correctly

        try {
            axios.post(`${imageBaseUrl}/api/custom-notification-message`, dataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
                .then(res => {
                    // Check if the response is successful (status 200)
                    if (res.status === 200) {
                        // Show success message using SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'The app message was sent successfully!',
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong',
                        text: error.response?.data?.message || 'An error occurred. Please try again.'
                    });
                });
        } catch (error) {
            // Catch any unexpected errors
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'An unexpected error occurred.'
            });
        }
    }

    if (!currentEvent) {
        return null;
    }

    return (
        <div>
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Send In App Message' />
                <Link to="/events/all-attendee" className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send App notification to Attendee for {currentEvent.title}</h6>
                    </div>

                    <div className='p-5'>

                        {/* Send By */}
                        <div className=''>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendMethod"
                                    checked={selectedMethod === 'kloutApp'}
                                    onChange={handleMethodChange}
                                    className="bg-transparent border-zinc-400"
                                />

                                {/* <RiWhatsappFill size={24} className='text-green-500' /> */}
                                <img src={logo} alt="Klout App" width={32} />
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

                        {/* Title */}
                        <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Title</label>
                            <input type="text" placeholder='Enter title here' name="Subject" onChange={(e) => setTitle(e.target.value)} id="subject" className='input w-full mt-2' />
                        </div>

                        {/* App Message */}
                        <h5 className='font-semibold mb-3 mt-10'>Your Message</h5>
                        <textarea name="message" onChange={(e)=>setMessage(e.target.value)} placeholder="Enter your message here..." className='w-full h-60 p-3' />
                        {/* <Editor
                            apiKey="nv4qeg7zimei3mdz8lj1yzl5bakrmw4li6baiikh87f8vksz" // Get your API key from TinyMCE
                            value={message}
                            onEditorChange={(content) => setMessage(content)}
                            initialValue="<p>Please type here...</p>"
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
                        /> */}

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

export default SendToApp;
