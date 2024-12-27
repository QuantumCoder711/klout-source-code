import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../../redux/store';
import axios from "axios";
import swal from "sweetalert";
import Loader from "../../../component/Loader";
import { useDispatch } from "react-redux";
import { heading } from "../../heading/headingSlice";

type formInputType = {
    first_name: string,
    last_name: string;
    email: string;
    description: string;
    end_time: string,
    mobile_number: string;
    end_minute_time: string,
    end_time_type: string,
    priority: string;
    company: string;
    address: string;
    pincode: string;
    designation: string;
    image: File | null,
};

type jobTitleType = {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
    uuid: string;
}

type companyType = {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
}

const Profile: React.FC = () => {

    const { user, token, loading } = useSelector((state: RootState) => state.auth);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const dispatch = useDispatch<AppDispatch>()

    const [edit, setEdit] = useState<boolean>(false);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const company_logo: string = user?.company_logo ? `${imageBaseUrl}/${user?.company_logo}` : "";
    const userImage: string = user?.image ? `${imageBaseUrl}/${user?.image}` : "";
    const [logoUrl, setLogoUrl] = useState<string>(company_logo);
    const [userUrl, setUserUrl] = useState<string>(userImage);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<formInputType>();
    const [selectedImage, setSelectedImage] = useState(company_logo);
    const [selectedUserImage, setSelectedUserImage] = useState(userImage);
    const [jobTitle, setJobTitles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [, setCustomCompanyName] = useState<string>(user?.company_name || '');
    const [, setCustomDesignationName] = useState<string>('');
    // const [selectedCompany, setSelectedCompany] = useState<string>();
    // const [selectedDesignation, setSelectedDesignation] = useState<string | null>();
    const dummyImage = "https://via.placeholder.com/150";

    // State to track the selected company
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedDesignation, setSelectedDesignation] = useState<string>('');

    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompany(event.target.value);
    };

    const handleDesignationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDesignation(event.target.value);
    }

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/job-titles`).then(res => setJobTitles(res.data.data));
        axios.get(`${apiBaseUrl}/api/companies`).then(res => setCompanies(res.data.data));
        if (user?.company && user.designation_name) {
            // setSelectedCompany(user.company);
            // setSelectedDesignation(user.designation_name);
            setValue("company", user.company_name);
            setValue("designation", user.designation);
        }

        console.log(companies)
    }, []);


    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        // setImage(file)
        setSelectedImage(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogoUrl(imageUrl);
        }
    };
    // Handle image upload
    const handleUserImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        // setImage(file)
        setSelectedUserImage(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserUrl(imageUrl);
        }
    };

    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Prepare data
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (selectedImage !== "") {
            console.log("Selected Image is: ", selectedImage);
            formData.append("company_logo", selectedImage);
        }

        if (selectedUserImage !== "") {
            console.log("Selected User Image is: ", selectedUserImage);
            formData.append("image", selectedUserImage);
        }

        console.log(formData);

        axios
            .post(`${apiBaseUrl}/api/updateprofile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
            .then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success").then(() => {
                        window.location.reload();
                        // setEdit(false);
                        // window.history.back();
                    });
                };
            });

    }

    useEffect(() => {
        setLogoUrl(company_logo);
        setUserUrl(userImage);
    }, [company_logo, userImage]);


    if (loading) {
        return <Loader />
    }

    return (
        <div>

            <div className="flex justify-end">
                {/* <HeadingH2 title="Profile" /> */}
                <Link to="/" onClick={() => dispatch(heading("Dashboard"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go To Dasboard
                </Link>
            </div>

            {/* Container for the profile page */}
            {!edit && <div className="max-w-5xl mx-auto p-8">

                {/* Profile Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg relative">
                    <div className="absolute top-2 right-2">
                        <img src={
                            user?.company_logo === null ? dummyImage : `${imageBaseUrl}/${user?.company_logo}`} alt="Company Logo" className="w-16 h-16 rounded-md mx-auto object-contain border border-gray-300" />
                    </div>
                    <div className="flex items-center space-x-8">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <img src={
                                user?.image === null ? dummyImage : `${imageBaseUrl}/${user?.image}`} alt="Profile Picture" className="w-80 h-60 rounded-lg object-cover" />
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{user?.first_name + " " + user?.last_name}</h2>
                            <h3 className="text-lg font-semibold text-gray-800">{user?.company_name}</h3>
                            <p className="text-sm text-gray-600">{user?.designation}</p>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            <p className="text-gray-500 text-sm">{user?.mobile_number}</p>
                            <p className="text-gray-600 text-sm">{user?.designation_name}</p>
                            <p className="text-gray-500 text-sm">{user?.address + ", " + user?.pincode}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        {/* Company Info */}
                        <div className="flex items-center space-x-8">
                            {/* Company Logo  */}
                            <div className="flex-shrink-0 w-40">

                            </div>

                            <div className="space-y-4">

                                {/* <p className="text-gray-500">{user?.pincode}</p> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            }

            {!edit && <div className="text-center">
                <button onClick={() => setEdit(true)} className="btn btn-primary mx-auto">Edit Profile</button>
            </div>}

            {edit && <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className="gap-4 mt-10">
                    <div className="flex w-full gap-3">

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* First Name */}
                            <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="first_name"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.first_name}  // Use defaultValue instead of value
                                    {...register('first_name', { required: 'First Name is required' })}
                                />
                            </label>
                            {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Last Name */}
                            <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="last_name"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.last_name} // Use defaultValue instead of value
                                    {...register('last_name', { required: 'Last Name is required' })}
                                />
                            </label>
                            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div className="flex w-full gap-3">

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Email */}
                            <label htmlFor="email" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">Email &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="email"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.email} // Use defaultValue instead of value
                                    {...register('email', { required: 'Email is required' })}
                                />

                            </label>
                            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Phone Number */}
                            <label htmlFor="phone" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Phone No. &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="phone"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.mobile_number} // Use defaultValue instead of value
                                    {...register('mobile_number', { required: 'Phone No. is required' })}
                                />
                            </label>
                            {errors.mobile_number && <p className="text-red-600">{errors.mobile_number.message}</p>}
                        </div>
                    </div>

                    <div className="flex w-full gap-3">
                        {/* Company */}
                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-col gap-3">
                                {/* Company Name */}
                                <label htmlFor="company" className="input input-bordered bg-white text-black flex items-center gap-2 w-full">
                                    <span className="font-semibold min-w-fit text-green-700 flex justify-between items-center">
                                        Company Name &nbsp;
                                        <TiArrowRight className='mt-1' />
                                    </span>
                                    {/* Dropdown */}
                                    <select
                                        id="company"
                                        className="bg-transparent text-black w-full p-2 border-none outline-none"
                                        defaultValue={user?.company}
                                        
                                        {...register('company', {
                                            required: 'Company is required',
                                            onChange: handleCompanyChange
                                        })}
                                    >
                                        {/* <option value="">Select a company</option> */}
                                        {
                                            companies.map((item: companyType) => (
                                                <option key={item.id} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))
                                        }
                                        <option value="Others">Others</option> {/* Option for Others */}
                                    </select>
                                </label>

                                {/* Conditionally Render Address Input */}
                                {selectedCompany === 'Others' && (
                                    <label htmlFor="customCompany" className="input input-bordered bg-white text-black flex items-center gap-2">
                                        <span className="font-semibold text-green-700 flex justify-between items-center">
                                            Company Name &nbsp;
                                            <TiArrowRight className='mt-1' />
                                        </span>
                                        <input
                                            id="customCompany"
                                            type="text"
                                            className="grow"
                                            defaultValue={user?.company_name} // Use defaultValue instead of value
                                            {...register('company', { required: 'Company is required' })}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            {/* Designation Name */}
                            <label htmlFor="designation" className="input input-bordered bg-white text-black flex items-center gap-2 w-full">
                                <span className="font-semibold min-w-fit text-green-700 flex justify-between items-center">
                                    Designation Name &nbsp;
                                    <TiArrowRight className='mt-1' />
                                </span>
                                {/* Dropdown */}
                                <select
                                    id="designation"
                                    className="bg-transparent text-black w-full p-2 border-none outline-none"
                                    // value={selectedDesignation}
                                    defaultValue={user?.designation}
                                    {...register('designation', { required: 'Designation is required', onChange: handleDesignationChange})}

                                >
                                    {/* <option value="">Select a Designation</option> */}
                                    {
                                        jobTitle.map((item: jobTitleType) => (
                                            <option key={item.name} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))
                                    }
                                    <option value="Others">Others</option> {/* Option for Others */}
                                </select>
                            </label>

                            {/* Conditionally Render Address Input */}
                            {selectedDesignation === 'Others' && (
                                <label htmlFor="customDesignation" className="input input-bordered bg-white text-black flex items-center gap-2">
                                    <span className="font-semibold text-green-700 flex justify-between items-center">
                                        Designation Name &nbsp;
                                        <TiArrowRight className='mt-1' />
                                    </span>
                                    <input
                                        id="customDesignation"
                                        type="text"
                                        className="grow"
                                        defaultValue={user?.designation} // Use defaultValue instead of value
                                        {...register('designation', { required: 'Designation is required' })}
                                    />
                                </label>
                            )}
                        </div>
                    </div>



                    <div className="flex w-full gap-3 my-4">
                        <div className='flex flex-col w-full gap-3'>
                            {/* Company Logo Upload */}
                            <label htmlFor="company_logo" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Company Logo &nbsp; <TiArrowRight className='mt-1' />
                                </span>
                                <input
                                    id="company_logo"
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    onChange={handleImageUpload}
                                />
                            </label>
                            {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                            {/* Display the uploaded image or dummy image */}
                            <div className="mt-3">
                                <img
                                    src={logoUrl || dummyImage}
                                    alt="Selected Logo"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-3'>
                            {/* Profile Image Upload */}
                            <label htmlFor="image" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Profile Image &nbsp; <TiArrowRight className='mt-1' />
                                </span>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    onChange={handleUserImageUpload}
                                />
                            </label>
                            {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                            {/* Display the uploaded image or dummy image */}
                            <div className="mt-3">
                                <img
                                    // defaultValue={user?.image}
                                    src={userUrl || dummyImage}
                                    alt="Selected Profile"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex w-full gap-3">
                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Address */}
                            <label htmlFor="address" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Address &nbsp; <TiArrowRight className='mt-1' /></span>
                                <input
                                    id="address"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.address} // Use defaultValue instead of value
                                    {...register('address', { required: 'Address is required' })}
                                />
                            </label>
                            {errors.address && <p className="text-red-600">{errors.address.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Pincode */}
                            <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Pincode &nbsp; <TiArrowRight className='mt-1' /></span>
                                <input
                                    id="pincode"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.pincode} // Use defaultValue instead of value
                                    {...register('pincode', { required: 'Pincode is required' })}
                                />
                            </label>
                            {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
                        </div>
                    </div>

                    <div className="col-span-3 flex justify-center mt-4 gap-3">
                        <button type="submit" onClick={() => onSubmit} className="btn btn-primary">Update Profile</button>
                        <button type="submit" onClick={() => setEdit(false)} className="btn bg-gray-500 text-white">Cancel</button>
                    </div>
                </form>
            </div>}
        </div>
    );
};

export default Profile;
