import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { domain } from './constants';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Spinner from '../../component/Loader';
import { useAppDispatch } from '../../redux/store';
import { login } from '../auth/authSlice';
import { addNewEvent } from '../event/eventSlice';

interface Signup {
    first_name: string;
    last_name: string;
    mobile_number: string;
    email: string;
    password: string;
    confirm_password: string;
    company: number;
    company_name: string | number;
    tnc: boolean;
    notifications: boolean;
    mobile_otp: string;
    email_otp: string;
    source_website: boolean;
    step: string;
};

interface ApiType {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
    uuid: string;
}

// interface Form {
//     title: string;
//     image: File | string | null; // This can be either a File from the file input or a string for selected template URLs
//     description: string;
//     event_start_date: string;
//     event_end_date: string;
//     event_date: string;
//     start_time: string; // New field for formatted start time (e.g., '16:05')
//     start_minute_time: string; // New field for start time minute part (e.g., '05')
//     start_time_type: string; // New field for AM/PM designation (e.g., 'PM')
//     end_time: string; // New field for formatted end time (e.g., '17:05')
//     end_minute_time: string; // New field for end time minute part (e.g., '05')
//     end_time_type: string; // New field for AM/PM designation (e.g., 'PM')
//     event_venue_name: string;
//     event_venue_address_1: string;
//     event_venue_address_2: string;
//     country: string;
//     state: string;
//     city: string;
//     pincode: string;
//     status: number;
//     feedback: number;
//     google_map_link: string;
//     event_otp: string;
//     view_agenda_by: number;
// }

interface AccountCreateProps {
    closeModal: () => void;
    eventDetails: any;
}

const AccountCreate: React.FC<AccountCreateProps> = ({ closeModal, eventDetails }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState<Signup>({
        first_name: "",
        last_name: "",
        mobile_number: "",
        email: "",
        password: "",
        confirm_password: "",
        company: 0,
        company_name: "",
        tnc: false,
        notifications: false,
        mobile_otp: "",
        email_otp: "",
        step: "1",
        source_website: true,
    });
    // const modalRef = useRef<HTMLDialogElement | null>(null);
    const [companies, setCompanies] = useState<ApiType[] | undefined>();
    const [selectedCompany, setSelectedCompany] = useState<string | number>('');
    const [customCompanyName, setCustomCompanyName] = useState<string>(''); // New state for custom company name
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<string[] | null>(null);
    const [accountCreated, setAccountCreated] = useState<boolean>(false);

    // Add state for errors
    const [errors, setErrors] = useState<any>({});

    const handleShowChange = (e: any) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    useEffect(() => {
        axios.get(`${domain}/api/companies`).then(res => setCompanies(res.data.data));
    }, []);

    // Handle Input Changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // Clear error for the field being modified
        setErrors((prevErrors: any) => {
            const newErrors = { ...prevErrors };
            delete newErrors[name]; // Remove error for the specific field
            return newErrors;
        });

        if (name === "company_name") {
            setSelectedCompany(value);
        } else if (name === "custom_company_name") {
            setCustomCompanyName(value);
        } else if (name === "tnc") {
            setUserDetails((prevData) => ({
                ...prevData,
                [name]: e.target.checked,
            }));
        } else if (name === "notifications") {
            setUserDetails((prevData) => ({
                ...prevData,
                [name]: e.target.checked,
            }));
        }

        setUserDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Form validation function
    const validate = () => {
        const newErrors: any = {};

        if (!userDetails.first_name) newErrors.first_name = "First name is required.";
        if (!userDetails.last_name) newErrors.last_name = "Last name is required.";
        if (!userDetails.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(userDetails.email)) newErrors.email = "Email is invalid.";
        if (!userDetails.mobile_number) newErrors.mobile_number = "Phone number is required.";
        if (!userDetails.password) newErrors.password = "Password is required.";
        if (userDetails.password !== userDetails.confirm_password) newErrors.confirm_password = "Passwords do not match.";
        if (!userDetails.tnc) newErrors.tnc = "You must agree to the terms and conditions.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Return false if there are errors
    };

    const handleClose = () => {
        closeModal();
        // setAccountCreated(false);
        // setShowRegistrationPopup(false);
        // setIsPopupComplete(true); // Indicate that the popup action is completed
    };

    // Handle form submission
    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);

        const companyId = companies?.find(company => company.name === selectedCompany);

        if (!companyId?.id) return;

        const formData: Signup = {
            ...userDetails,
            company: companyId.id,
            company_name: selectedCompany === "Others" ? customCompanyName : selectedCompany,
        };

        setUserDetails(formData);

        try {
            const res = await axios.post(`${domain}/api/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.data.status === 200) {
                setUserDetails((prev) => ({
                    ...prev,
                    step: "2"
                }));
            }

            if (res.data.status === 422) {
                const errors = [];
                if (res.data.error.email) {
                    errors.push(res.data.error.email[0]);
                }
                if (res.data.error.mobile_number) {
                    errors.push(res.data.error.mobile_number[0]);
                }
                setLoading(false)
                setFormErrors(errors);
            }
            if (res.data.status === 400) {
                const errors = [];
                if (res.data.error.email) {
                    errors.push(res.data.error.email[0]);
                }
                if (res.data.error.mobile_number) {
                    errors.push(res.data.error.mobile_number[0]);
                }
                setLoading(false)
                setFormErrors(errors);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }

        console.log("Form Data on Register:", formData);
    };

    // Handle Final Form Submission
    const finalFormSubmit = async () => {
        console.log("The event is: ", eventDetails);
        setLoading(true);
        // return;
        try {
            const res = await axios.post(`${domain}/api/register`, userDetails, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.data.status === 200) {
                setAccountCreated(true);
                const obj = {
                    email: userDetails.email,
                    password: userDetails.password
                };

                const newEvent = {
                    ...eventDetails,
                    event_venue_address_2: eventDetails.event_venue_address_1,
                    event_date: eventDetails.event_start_date,
                }

                await dispatch(login(obj));
                await dispatch(addNewEvent({ eventData: newEvent, token: res.data.access_token })).unwrap(); // unwrap if using createAsyncThunk
                await navigate("/");
            }

            // console.log("The response is: ", res.data)

            // localStorage.setItem("token", res.data.access_token);

        } catch (error) {
            console.log("Something Went Wrong", error);
        } finally {
            setUserDetails({
                first_name: "",
                last_name: "",
                mobile_number: "",
                email: "",
                password: "",
                confirm_password: "",
                company: 0,
                company_name: "",
                tnc: false,
                notifications: false,
                mobile_otp: "",
                email_otp: "",
                step: "",
                source_website: true,
            });
            setLoading(false);
        }
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            {!loading && userDetails.step === "1" && !formErrors ? <div className=''>

                <h1 className='text-2xl font-semibold text-center'>Create Your Account</h1>

                <div className='mt-5 space-y-5 overflow-y-scroll max-h-96 hide-scrollbar overflow-hidden'>
                    {/* User Name */}
                    <div className='flex gap-5 flex-col sm:flex-row w-full'>
                        {/* First Name */}
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>First Name</span>
                            <input
                                type="text"
                                name='first_name'
                                value={userDetails.first_name}
                                onChange={handleChange}
                                className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${errors.first_name ? 'border-red-500' : ''}`}
                            />
                            {errors.first_name && <span className="text-red-500 text-xs mt-1">{errors.first_name}</span>}
                        </div>

                        {/* Last Name */}
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Last Name</span>
                            <input
                                type="text"
                                name='last_name'
                                value={userDetails.last_name}
                                onChange={handleChange}
                                className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${errors.last_name ? 'border-red-500' : ''}`}
                            />
                            {errors.last_name && <span className="text-red-500 text-xs mt-1">{errors.last_name}</span>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className='flex gap-5 flex-col sm:flex-row w-full'>
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Email</span>
                            <input
                                type="email"
                                name='email'
                                value={userDetails.email}
                                onChange={handleChange}
                                className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                        </div>

                        {/* Phone No. */}
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Phone No.</span>
                            <input
                                type="tel"
                                name='mobile_number'
                                value={userDetails.mobile_number}
                                onChange={handleChange}
                                className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${errors.mobile_number ? 'border-red-500' : ''}`}
                            />
                            {errors.mobile_number && <span className="text-red-500 text-xs mt-1">{errors.mobile_number}</span>}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className='flex gap-5 flex-col sm:flex-row w-full'>
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Company Name</span>
                            <select
                                name="company_name"
                                value={selectedCompany}
                                onChange={handleChange}
                                id="company_name"
                                className={`bg-white px-3 py-1 w-full focus:outline-none rounded-lg ${errors.company_name ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Company</option>
                                {companies?.map((company) => (
                                    <option key={company.id} value={company.name}>{company.name}</option>
                                ))}
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* Custom Company Name */}
                        {selectedCompany === "Others" && (
                            <div className='flex flex-col w-full'>
                                <span className='text-sm'>Specify Company Name</span>
                                <input
                                    type="text"
                                    name='custom_company_name'
                                    value={customCompanyName}
                                    onChange={handleChange}
                                    className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${errors.custom_company_name ? 'border-red-500' : ''}`}
                                />
                                {errors.custom_company_name && <span className="text-red-500 text-xs mt-1">{errors.custom_company_name}</span>}
                            </div>
                        )}
                    </div>

                    {/* Password */}
                    <div className='flex gap-5 flex-col sm:flex-row items-center'>
                        {/* Password */}
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Password</span>
                            <div className='relative w-full'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    value={userDetails.password}
                                    onChange={handleShowChange}
                                    className={`rounded-lg w-full bg-white px-3 py-1 focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute top-0 right-0 p-1'
                                >
                                    {showPassword ? (
                                        <EyeOff className='text-gray-500 w-5' />
                                    ) : (
                                        <Eye className='text-gray-500 w-5' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className='flex flex-col w-full'>
                            <span className='text-sm'>Confirm Password</span>
                            <div className='relative w-full'>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirm_password'
                                    value={userDetails.confirm_password}
                                    onChange={handleShowChange}
                                    className={`rounded-lg w-full bg-white px-3 py-1 focus:outline-none ${errors.confirm_password ? 'border-red-500' : ''}`}
                                />
                                {errors.confirm_password && <span className="text-red-500 text-xs mt-1">{errors.confirm_password}</span>}
                                <button
                                    type='button'
                                    onClick={toggleConfirmPasswordVisibility}
                                    className='absolute top-0 right-0 p-1'
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className='text-gray-500 w-5' />
                                    ) : (
                                        <Eye className='text-gray-500 w-5' />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className='space-y-2 text-sm'>
                        <div className='flex gap-2 items-center'>
                            <input
                                type="checkbox"
                                name="tnc"
                                checked={userDetails.tnc}
                                onChange={handleChange}
                                className='size-4'
                            />
                            <span>I agree to company 
                                <a href="https://www.klout.club/terms-and-condition" className='mx-1 text-brand-primary' target='_blank'>Terms & Conditions</a>
                                and 
                                <a href="https://www.klout.club/privacypolicy.html" className='mx-1 text-brand-primary' target='_blank'>Privacy Policy</a>
                            </span>
                        </div>

                        <div className='flex gap-2 items-center'>
                            <input
                                type="checkbox"
                                name="notifications"
                                checked={userDetails.notifications}
                                onChange={handleChange}
                                className='size-4'
                            />
                            <span>I agree to receive Important updates on SMS, Email & Whatsapp.</span>
                        </div>
                    </div>
                </div>

                <button
                    className='w-full mt-5 py-1 bg-brand-primary text-white rounded-lg'
                    onClick={handleRegister}
                >
                    Register
                </button>
                <span className='pt-3 block mx-auto text-center text-sm'>
                    Already Registered ? <Link to="/login" className='text-brand-primary'>Login Here</Link>
                </span>
            </div> : <></>}

            {formErrors && <div className='max-w-fit'>
                <h1 className='text-2xl font-semibold text-center'>Validation Error</h1>

                <div className='mt-5'>
                    <p>{formErrors[0]}</p>
                    <p className='mt-1'>{formErrors[1]}</p>
                    <button onClick={() => { setFormErrors(null) }} className='px-3 py-1 w-full rounded-lg bg-brand-primary text-white mt-5 '>Ok</button>
                </div>
            </div>}

            {userDetails.step === "2" &&
                <div className='overflow-hidden hide-scrollbar max-w-fit'>
                    <h1 className='text-2xl font-semibold text-center'>Enter OTP's</h1>

                    <div className='mt-10 space-y-5 max-h-96'>
                        <div className='flex flex-col gap-5 w-80'>
                            {/* Mobile OTP */}
                            <div className='flex flex-col'>
                                <span className='text-sm'>Mobile OTP</span>
                                <input
                                    type="text"
                                    name='mobile_otp'
                                    value={userDetails.mobile_otp}
                                    onChange={handleChange}
                                    className={`rounded-lg bg-white px-3 py-1 focus:outline-none ${errors.mobile_otp ? 'border-red-500' : ''}`}
                                />
                                {errors.mobile_otp && <span className="text-red-500 text-xs mt-1">{errors.mobile_otp}</span>}
                            </div>

                            {/* Email OTP */}
                            <div className='flex flex-col'>
                                <span className='text-sm'>Email OTP</span>
                                <input
                                    type="text"
                                    name='email_otp'
                                    value={userDetails.email_otp}
                                    onChange={handleChange}
                                    className={`rounded-lg bg-white px-3 py-1 focus:outline-none ${errors.email_otp ? 'border-red-500' : ''}`}
                                />
                                {errors.email_otp && <span className="text-red-500 text-xs mt-1">{errors.email_otp}</span>}
                            </div>
                        </div>

                        <button onClick={finalFormSubmit} className='px-3 py-1 text-white w-full bg-brand-primary rounded-lg'>Create Account</button>
                    </div>
                </div>
            }

            {accountCreated && <div className=''>
                <h1 className='text-2xl font-semibold text-center'>Account Created Successfully</h1>
                <button onClick={handleClose} className='w-full px-3 py-1 rounded-lg bg-brand-primary text-white mt-10'>Ok</button>
            </div>}

        </>
    );
};

export default AccountCreate;