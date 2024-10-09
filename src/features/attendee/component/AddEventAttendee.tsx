import React, { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";

// Define the form data type
type FormInputType = {
    first_name: string;
    last_name: string;
    job_title: string;
    company_name: string;
    industry: string;
    email_id: string;
    phone_number: string;
    alternate_mobile_number: string;
    website: string;
    linkedin_page_link: string;
    employee_size: number;
    company_turn_over: number;
    status: string;
    image: File | null;
};

const AddEventAttendee: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputType>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setValue("image", file); // storing it in the form
        }
    };

    const onSubmit: SubmitHandler<FormInputType> = async () => {
        // Here you will handle form submission
        // Use data along with API calls and necessary actions
    };

    const downloadSampleExcel = () => {
        // Add your Excel sample download logic
    };

    const handleExcelUpload = () => {
        // Logic for handling Excel file uploads
    };

    return (
        <div className="p-6 pt-3">
            <h2 className="text-black text-2xl font-semibold ps-5">
                Add Attendee Details
            </h2>
            <button type="button" onClick={downloadSampleExcel} className="btn btn-primary mb-4">
                Download Sample Excel CSV Sheet Format
                <i className="fa fa-download mx-2"></i>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section - Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="first_name" type="text" className="grow" {...register('first_name', { required: 'First Name is required' })} />
                        </label>
                        {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="last_name" type="text" className="grow" {...register('last_name', { required: 'Last Name is required' })} />
                        </label>
                        {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Email &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="email_id" type="email" className="grow" {...register('email_id', { required: 'Email is required' })} />
                        </label>
                        {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="job_title" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Job Title &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="job_title" type="text" className="grow" {...register('job_title', { required: 'Job Title is required' })} />
                        </label>
                        {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="company_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Company Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="company_name" type="text" className="grow" {...register('company_name', { required: 'Company Name is required' })} />
                        </label>
                        {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="industry" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Industry &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="industry" type="text" className="grow" {...register('industry', { required: 'Industry is required' })} />
                        </label>
                        {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="phone_number" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="phone_number" type="tel" className="grow" {...register('phone_number')} />
                        </label>
                        {errors.phone_number && <p className="text-red-600">{errors.phone_number.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="alternate_mobile_number" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Alternate Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="alternate_mobile_number" type="tel" className="grow" {...register('alternate_mobile_number')} />
                        </label>
                        {errors.alternate_mobile_number && <p className="text-red-600">{errors.alternate_mobile_number.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="website" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Website &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="website" type="url" className="grow" {...register('website')} />
                        </label>
                        {errors.website && <p className="text-red-600">{errors.website.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="linkedin_page_link" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">LinkedIn Profile Link &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="linkedin_page_link" type="url" className="grow" {...register('linkedin_page_link')} />
                        </label>
                        {errors.linkedin_page_link && <p className="text-red-600">{errors.linkedin_page_link.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="employee_size" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Employee Size &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="employee_size" type="number" className="grow" {...register('employee_size')} />
                        </label>
                        {errors.employee_size && <p className="text-red-600">{errors.employee_size.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="company_turn_over" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Company Turn Over &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="company_turn_over" type="number" className="grow" {...register('company_turn_over')} />
                        </label>
                        {errors.company_turn_over && <p className="text-red-600">{errors.company_turn_over.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="status" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Status &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="status" className="grow bg-white" {...register('status', { required: 'Status is required' })}>
                                <option value="">Select Status</option>
                                <option value="speaker">Speaker</option>
                                <option value="panelist">Panellist</option>
                                <option value="sponsor">Sponsor</option>
                                <option value="delegate">Delegate</option>
                                <option value="moderator">Moderator</option>
                                <option value="others">Others</option>
                            </select>
                        </label>
                        {errors.status && <p className="text-red-600">{errors.status.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="image" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Profile Picture &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="grow"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                            />
                        </label>
                        <div className="mt-3">
                            <img
                                src={selectedImage}
                                alt="Selected Profile"
                                className="w-32 h-32 object-cover"
                            />
                        </div>
                    </div>

                    <div className="col-span-3 flex justify-center mt-4">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>

                {/* Right Section - Excel Upload */}
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Bulk Upload</h3>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="excel_file" className="input input-bordered bg-white text-black flex items-center gap-2 mb-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Upload Excel &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input
                                id="excel_file"
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="grow"
                                onChange={() => handleExcelUpload()}
                            />
                        </label>
                        <button type="button" className="btn btn-primary" onClick={handleExcelUpload}>
                            Upload Excel Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEventAttendee;