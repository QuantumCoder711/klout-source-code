import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import { Editor } from '@tinymce/tinymce-react';

const SendReminder: React.FC = () => {
    // State to keep track of selected roles and selected sending method
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
    const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | 'mail' | null>("mail");
    const [sendTime, setSendTime] = useState<'now' | 'later' | null>("now"); // State for "now" and "later" radio buttons

    // Handle change of checkboxes
    const handleCheckboxChange = (role: string) => {
        if (role === 'all') {
            // Toggle "All" checkbox: Select all roles or deselect all
            if (selectedRoles.includes('all')) {
                // If "All" is already selected, deselect all roles
                setSelectedRoles([]);
            } else {
                // Otherwise, select all roles
                setSelectedRoles(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
            }
        } else {
            // For other roles, toggle individual role
            setSelectedRoles(prevRoles =>
                prevRoles.includes(role)
                    ? prevRoles.filter(r => r !== role) // Deselect if already selected
                    : [...prevRoles, role] // Select if not selected
            );
        }
    };

    // Handle method selection (WhatsApp or Mail)
    const handleMethodChange = (method: 'whatsapp' | 'mail') => {
        setSelectedMethod(method);
    };

    // Handle sending time selection (Now or Later)
    const handleSendTimeChange = (time: 'now' | 'later') => {
        setSendTime(time);
    };

    return (
        <div>
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Send Email / SMS to Attendee' />
                <Link to="/events/all-attendee" className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                {/* Message Div Wrapper */}
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send Email / SMS to Attendee for NextGen CIO Leadership Summit &amp; Awards 2024</h6>
                    </div>

                    {/* All Fields Wrapper Div */}
                    <div className='p-5'>
                        {/* Select Roles */}
                        <div className='mt-2'>
                            <h5 className='font-semibold mb-3'>Select Roles</h5>
                            <div className="flex flex-row items-center gap-10 pl-5">
                                {/* Checkbox for All Roles */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('all')}
                                        onChange={() => handleCheckboxChange('all')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>All</span>
                                </label>

                                {/* Checkbox for Speaker */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('speaker')}
                                        onChange={() => handleCheckboxChange('speaker')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Speaker</span>
                                </label>

                                {/* Checkbox for Delegate */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('delegate')}
                                        onChange={() => handleCheckboxChange('delegate')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Delegate</span>
                                </label>

                                {/* Checkbox for Sponsor */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('sponsor')}
                                        onChange={() => handleCheckboxChange('sponsor')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Sponsor</span>
                                </label>

                                {/* Checkbox for Moderator */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('moderator')}
                                        onChange={() => handleCheckboxChange('moderator')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Moderator</span>
                                </label>

                                {/* Checkbox for Panelist */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('panelist')}
                                        onChange={() => handleCheckboxChange('panelist')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Panelist</span>
                                </label>
                            </div>
                        </div>

                        {/* Select WhatsApp or Mail */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <div className="flex gap-10 pl-5">
                                {/* Radio button for Mail */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendMethod"
                                        checked={selectedMethod === 'mail'}
                                        onChange={() => handleMethodChange('mail')}
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

                        {/* WhatsApp Message */}
                        {selectedMethod === "whatsapp" && <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-1/2 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi "<strong>firstname</strong>", just a reminder for our event "<strong>Event-Title</strong>". We're excited to welcome you to this exclusive event. "<strong>Event-Date-Time</strong>". <br /> <br /> To ensure a smooth check-in experience, please download the  Klout Club app in advance. You can download it here <a href="https://onelink.to/r3fzb9" className='font-bold'>https://onelink.to/r3fzb9</a>
                                </p>
                            </div>
                        </div>}


                        {/* Subject Input */}
                        {selectedMethod === "mail" && <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Subject</label>
                            <input type="text" name="Subject" id="subject" className='input w-full mt-2' />
                        </div>}

                        {/* Rich Textarea */}
                        {selectedMethod === "mail" && <div className="mt-10">
                            <label htmlFor="Message" className='block font-semibold'>Message</label>

                            {/* TinyMCE Editor */}
                            <div className="form-group">
                                <Editor
                                    apiKey="nv4qeg7zimei3mdz8lj1yzl5bakrmw4li6baiikh87f8vksz" // Get your API key from TinyMCE
                                    // value={formInput.message}
                                    // className={`form-control ${errors.message ? "is-invalid" : ""
                                    //     }`}
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
                        <div className='mt-10'>
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
                        <button className='px-4 py-3 mt-10 bg-klt_primary-500 text-white font-semibold rounded-md'>Submit Now</button>
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
                            src="https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="temp image" />

                        <h3 className='text-xl mt-2 font-medium'>NextGen CIO Leadership Summit & Awards 2024</h3>
                        <div className='grid place-content-end mt-2'>
                            <button className="btn btn-error text-white btn-sm ">
                                View Event <IoMdArrowRoundBack size={20} className='rotate-180' />
                            </button>
                        </div>

                        <div className='w-full bg-zinc-200 mt-5 rounded-xl p-5'>
                            <div>
                                <h4 className='font-bold mb-2'>Date</h4>
                                <p>Start Date - 2024-10-23</p>
                                <p>End Date - 2024-10-23</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Time</h4>
                                <p>From 9:00 AM - 6:00 PM</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Location</h4>
                                <p>Holiday Inn Mumbai International Airport, Sakinaka, Junction, Andheri - Kurla Rd, Andheri East, Mumbai, Maharashtra, India, 400072</p>
                            </div>
                        </div>

                        <div className='mt-4'>
                            <h4 className='font-bold mb-2'>Description</h4>
                            <p>In the midst of the ever-evolving digital business sphere, a compelling demand for reshaping businesses aligns with a technological and security revolution, significantly amplifying the role of the Chief Information Officer (CIO). Progressing beyond the traditional scope of an IT manager, the CIO has emerged as a strategic pioneer, propelling digital advancement, operational mastery, and business enlargement. These prevailing trends shed light on the intricate landscape that CIOs traverse, demanding an in-depth comprehension of technology's trajectory, astute business acumen, and adeptness in cultivating collaboration across the organizational spectrum. As technology takes center stage in shaping industries and markets, the CIO's position remains pivotal in charting an organization's future course, coordinating innovation, and fostering cohesion across the enterprise. In this transformative epoch, the CIO spearheads the orchestration of technology, steering progress and ensuring coherence in an increasingly interwoven business environment NEXTGEN CIO Leadership Summit & Awards 2024 serves as a dynamic platform for IT leaders to convene, learn, and observe seasoned senior information and technology experts as they benchmark optimal practices and establish future objectives. This event facilitates knowledge exchange, insights, and networking opportunities, fostering a collaborative environment where attendees can glean valuable insights, refine strategies, and explore emerging trends. By uniting industry visionaries, the confex aims role in advancing technological prowess, strategic foresight, and collective innovation, contributing to the evolution of the digital landscape.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendReminder;
