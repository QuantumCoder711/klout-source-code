import React, { useEffect, useState } from "react";
import HeadingH2 from "../../../component/HeadingH2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { RootState } from '../../../redux/store';
import axios from "axios";
import swal from "sweetalert";

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

    const { user, token } = useSelector((state: RootState) => state.auth);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const companyLogo: string = user?.company_logo ? `${imageBaseUrl}/${user?.company_logo}` : "";
    const userImage: string = user?.image ? `${imageBaseUrl}/${user?.image}` : "";
    const { register, handleSubmit, formState: { errors } } = useForm<formInputType>();
    const [selectedImage, setSelectedImage] = useState(companyLogo);
    const [selectedUserImage, setSelectedUserImage] = useState(userImage);
    const [image, setImage] = useState(null);
    const [jobTitle, setJobTitles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [customCompanyName, setCustomCompanyName] = useState<string>(user?.company_name || '');
    const [customDesignationName, setCustomDesignationName] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState<string>();
    const [selectedDesignation, setSelectedDesignation] = useState<string | null>();
    const dummyImage = "https://via.placeholder.com/150";

    console.log(token);

    useEffect(() => {
        axios.get("/api/job-titles").then(res => setJobTitles(res.data.data || []));
        axios.get("/api/companies").then(res => setCompanies(res.data.data || []));
        setSelectedCompany(user?.company_name);
        setSelectedDesignation(user?.designation_name);
    }, []);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompany(e.target.value);
        if (e.target.value !== "Others") {
            setCustomCompanyName(''); // Reset custom name if a valid company is selected
        }
    };

    const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDesignation(e.target.value);
        if (e.target.value !== "Others") {
            setCustomDesignationName(''); // Reset custom name if a valid designation is selected
        }
    };

    const handleCustomCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomCompanyName(e.target.value);
        console.log(customCompanyName);
    };

    const handleCustomDesignationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomDesignationName(e.target.value);
        console.log(customDesignationName);
    };

    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };
    // Handle image upload
    const handleUserImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedUserImage(imageUrl);
        }
    };

    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Prepare data
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (companyLogo !== "") {
            formData.append("companyLogo", companyLogo);
        }

        if (userImage !== "") {
            formData.append("userImage", userImage);
        }

        console.log(formData);

        axios
            .post(`/api/updateprofile`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                 },
            })
            .then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success");
                    // console.log(formData);
                };
            });

    }


    return (
        <div>

            <div className="flex justify-between items-center">
                <HeadingH2 title="Profile" />
                <Link to="/" className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go To Dasboard
                </Link>
            </div>

            <div>
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
                        <div className='flex flex-col w-full gap-3 my-4'>
                            <label htmlFor="company" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 min-w-fit flex items-center">Company &nbsp; <TiArrowRight className='mt-1' /></span>
                                <select
                                    id="company"
                                    {...register("company", { required: "Company is required" })}
                                    className="bg-white pl-3 w-full"
                                    defaultValue={user?.company_name}
                                    value={selectedCompany}
                                    onChange={handleCompanyChange}
                                >
                                    <option>{user?.company_name}</option>
                                    {companies?.map((company: companyType) => (
                                        <option key={company.id} value={company.name}>
                                            {company.name}
                                        </option>
                                    ))}
                                    <option value="Others">Others</option>
                                </select>
                            </label>
                            {errors.company && <p className="text-red-600">{errors.company.message}</p>}
                            {/* {errors.company && <p className="text-red-600">{errors.company.message}</p>} */}
                        </div>

                        {/* Custom Company Name */}
                        {selectedCompany === "Others" && (
                            <div className='flex flex-col w-full gap-3 my-4'>
                                <label htmlFor="customCompany" className="input input-bordered bg-white text-black flex items-center gap-2">
                                    <span className="font-semibold text-green-700 flex items-center">Company Name &nbsp; <TiArrowRight className='mt-1' /></span>
                                    <input
                                        id="customCompany"
                                        type="text"
                                        // value={customCompanyName}
                                        // onChange={handleCustomCompanyNameChange}
                                        className="grow" {...register('company', { required: 'Company name is required' })}
                                    />
                                </label>
                                {errors.company && <p className="text-red-600">{errors.company.message}</p>}
                            </div>
                        )}

                        {/* Designation */}
                        <div className='flex flex-col w-full gap-3 my-4'>
                            <label htmlFor="designation" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 min-w-fit flex items-center">Designation &nbsp; <TiArrowRight className='mt-1' /></span>
                                <select
                                    id="designation"
                                    {...register("designation", { required: "Designation is required" })}
                                    className="bg-white pl-3 w-full"
                                    // value={selectedDesignation}
                                    defaultValue={user?.designation}
                                    onChange={handleDesignationChange}
                                >
                                    <option>{user?.designation_name}</option>
                                    {jobTitle?.map((designation: jobTitleType) => (
                                        <option key={designation.id} value={designation.name}>
                                            {designation.name}
                                        </option>
                                    ))}
                                    <option value="Others">Others</option>
                                </select>
                            </label>

                            {errors.designation && <p className="text-red-600">{errors.designation.message}</p>}
                        </div>

                        {/* Custom Designation Name */}
                        {selectedDesignation === "Others" && (
                            <div className='flex flex-col w-full gap-3 my-4'>
                                <label htmlFor="customDesignation" className="input input-bordered bg-white text-black flex items-center gap-2">
                                    <span className="font-semibold text-green-700 flex items-center">Designation Name &nbsp; <TiArrowRight className='mt-1' /></span>
                                    <input
                                        id="customDesignation"
                                        type="text"
                                        // value={customDesignationName}
                                        // onChange={handleCustomDesignationNameChange}
                                        className="grow" {...register('designation', { required: 'Designation is required' })}
                                    />
                                </label>
                                {errors.designation && <p className="text-red-600">{errors.designation.message}</p>}
                            </div>
                        )}
                    </div>


                    <div className="flex w-full gap-3 my-4">
                        <div className='flex flex-col w-full gap-3'>
                            {/* Company Logo Upload */}
                            <label htmlFor="companyLogo" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Company Logo &nbsp; <TiArrowRight className='mt-1' />
                                </span>
                                <input
                                    id="companyLogo"
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
                                    src={selectedImage || dummyImage}
                                    alt="Selected Logo"
                                    className="w-32 h-32 object-cover"
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
                                    src={selectedUserImage || dummyImage}
                                    alt="Selected Profile"
                                    className="w-32 h-32 object-cover"
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

                    <div className="col-span-3 flex justify-center mt-4">
                        <button type="submit" onClick={() => onSubmit} className="btn btn-primary">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
