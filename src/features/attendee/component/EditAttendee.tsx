import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineFileDownload } from 'react-icons/md';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TiArrowRight } from 'react-icons/ti';
import Loader from '../../../component/Loader';

// Define the form data type
type FormInputType = {
  first_name: string;
  last_name: string;
  job_title: string;
  company_name: string;
  customCompany: string;
  industry: string;
  email_id: string;
  phone_number: string;
  alternate_mobile_number: string;
  website: string;
  linkedin_page_link: string;
  employee_size: number;
  company_turn_over: number;
  status: string;
  event_id: number | undefined;
  image: File | null;
};

type ApiType = {
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
  uuid: string;
}


const EditAttendee = () => {

  const dummyImage = "https://via.placeholder.com/150";

  const [selectedImage, setSelectedImage] = useState('');
  const { token } = useSelector((state: RootState) => (state.auth));
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputType>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [industries, setIndustries] = useState<ApiType[] | undefined>();
  const [selectedIndustry, setSelectedIndustry] = useState<string>(''); // Track selected industry

  const [jobTitles, setJobTitles] = useState<ApiType[] | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<string>(''); // Track selected company

  const [companies, setCompanies] = useState<ApiType[] | undefined>();
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(''); // Track selected job title

  const { currentAttendeeUUID, loading } = useSelector((state: RootState) => state.attendee);

  console.log(currentAttendeeUUID);

  useEffect(() => {
    axios.get("/api/job-titles").then(res => setJobTitles(res.data.data));
    axios.get("/api/companies").then(res => setCompanies(res.data.data));
    axios.get("/api/get-industries").then(res => setIndustries(res.data.data));

    axios.post(`/api/attendees/${currentAttendeeUUID}`, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then((res => {
      const attendeeData = res.data.data;
        setValue("first_name", attendeeData.first_name);
        setValue("last_name", attendeeData.last_name);
        setValue("email_id", attendeeData.email_id);
        setValue("phone_number", attendeeData.phone_number);
        setValue("alternate_mobile_number", attendeeData.alternate_mobile_number);
        setValue("website", attendeeData.website);
        setValue("linkedin_page_link", attendeeData.linkedin_page_link);
        setValue("employee_size", attendeeData.employee_size);
        setValue("company_turn_over", attendeeData.company_turn_over);
        setValue("status", attendeeData.status);
        setSelectedImage(attendeeData.image || dummyImage);
    }));
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setValue("image", file); // storing it in the form
    }
  };

  const onSubmit: SubmitHandler<FormInputType> = async (data) => {

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof FormInputType];
      // formData.append(key, value);
      if (key === "image" && value instanceof File) {
        formData.append(key, value);  // Append the image file
      }
      else {
        formData.append(key, value ? value.toString() : ""); // Append other form data as strings
      }
    });

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // formData.append("event_id", Number(events[0].id));

    console.log(formData);

    axios
      .post(`/api/attendees/${currentAttendeeUUID}`, formData, {
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

  if(loading) {
    return <Loader />
  }

  return (
    <div className="p-6 pt-3">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-black text-2xl font-semibold ps-5">
          Edit Attendee Details
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        <div className='flex gap-3 w-full'>
          <div className="w-full">
            <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="first_name" type="text" className="grow" {...register('first_name', { required: 'First Name is required' })} />
            </label>
            {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="last_name" type="text" className="grow" {...register('last_name', { required: 'Last Name is required' })} />
            </label>
            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">

          <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
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

          <img src={selectedImage || dummyImage} alt="" className='w-full h-60 object-contain' />
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Email &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="email_id" type="email" className="grow" {...register('email_id', { required: 'Email is required' })} />
            </label>
            {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
          </div>

          <div className="w-full">
            {/* Industry Dropdown */}
            <div className="w-full">
              <label htmlFor="industry" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Industry &nbsp;
                  <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="industry"
                  className="grow h-full bg-white"
                  {...register('industry', { required: 'Industry is required' })}
                  value={selectedIndustry} // Bind selected value
                  onChange={(e) => { setSelectedIndustry(e.target.value); }} // Track industry selection
                >
                  <option value="">Select an industry</option>
                  {industries?.map((industry: ApiType) => (
                    <option key={industry.id} value={industry.name}>
                      {industry.name}
                    </option>
                  ))}
                  <option value="Others">Others</option> {/* Add "Others" option */}
                </select>
              </label>
              {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}

              {/* Conditionally Render Custom Industry Input */}
              {selectedIndustry === 'Others' && (
                <div className='flex flex-col w-full gap-3 my-4'>
                  <label htmlFor="customIndustry" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Industry &nbsp;
                      <TiArrowRight className='mt-1' />
                    </span>
                    <input
                      id="customIndustry"
                      type="text"
                      // value={customIndustry} // Uncomment if you have a state for custom industry
                      // onChange={handleCustomIndustryChange} // Handle custom industry change
                      className="grow"
                      {...register('industry', { required: 'Industry name is required' })} // Field for custom industry
                    />
                  </label>
                  {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}
                </div>
              )}
            </div>
          </div>


        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            {/* Company Name Dropdown */}
            <div className="w-full">
              <label htmlFor="company_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Company Name &nbsp; <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="company_name"
                  className="grow h-full bg-white"
                  {...register('company_name', { required: 'Company Name is required' })}
                  value={selectedCompany} // Bind selected value
                  onChange={(e) => { setSelectedCompany(e.target.value) }} // Track company selection
                >
                  <option value="">Select a company</option>
                  {companies?.map((company: ApiType) => (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                  <option value="Others">Others</option> {/* Add "Others" option */}
                </select>
              </label>
              {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}

              {/* Conditionally Render Custom Company Name Input */}
              {selectedCompany === 'Others' && (
                <div className='flex flex-col w-full gap-3 my-4'>
                  <label htmlFor="customCompanyName" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Custom Company Name &nbsp;
                      <TiArrowRight className='mt-1' />
                    </span>
                    <input
                      id="customCompanyName"
                      type="text"
                      className="grow"
                      {...register('company_name', { required: 'Company name is required' })}
                    />
                  </label>
                  {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            {/* Job Title Dropdown */}
            <div className="w-full">
              <label htmlFor="job_title" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Job Title &nbsp;
                  <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="job_title"
                  className="grow h-full bg-white"
                  {...register('job_title', { required: 'Job Title is required' })}
                  value={selectedJobTitle} // Bind selected value
                  onChange={(e) => { setSelectedJobTitle(e.target.value) }} // Track job title selection
                >
                  <option value="">Select a job title</option>
                  {jobTitles?.map((job: ApiType) => (
                    <option key={job.id} value={job.name}>
                      {job.name}
                    </option>
                  ))}
                  <option value="Others">Others</option> {/* Add "Others" option */}
                </select>
              </label>
              {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}

              {/* Conditionally Render Custom Job Title Input */}
              {selectedJobTitle === 'Others' && (
                <div className="flex flex-col w-full gap-3 my-4">
                  <label htmlFor="customJobTitle" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Custom Job Title &nbsp;
                      <TiArrowRight className="mt-1" />
                    </span>
                    <input
                      id="customJobTitle"
                      type="text"
                      className="grow"
                      {...register('job_title', { required: 'Job title is required' })}
                    />
                  </label>
                  {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="phone_number" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="phone_number" type="tel" className="grow" {...register('phone_number', { required: 'Phone Number is required' })} />
            </label>
            {errors.phone_number && <p className="text-red-600">{errors.phone_number.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="alternate_mobile_number" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Alternate Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="alternate_mobile_number" type="tel" className="grow" {...register('alternate_mobile_number')} />
            </label>
            {errors.alternate_mobile_number && <p className="text-red-600">{errors.alternate_mobile_number.message}</p>}
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="website" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Website &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="website" type="url" className="grow" {...register('website')} />
            </label>
            {errors.website && <p className="text-red-600">{errors.website.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="linkedin_page_link" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">LinkedIn Profile Link &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="linkedin_page_link" type="url" className="grow" {...register('linkedin_page_link')} />
            </label>
            {errors.linkedin_page_link && <p className="text-red-600">{errors.linkedin_page_link.message}</p>}
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="employee_size" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Employee Size &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="employee_size" type="number" className="grow" {...register('employee_size')} />
            </label>
            {errors.employee_size && <p className="text-red-600">{errors.employee_size.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="company_turn_over" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Company Turn Over &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="company_turn_over" type="number" className="grow" {...register('company_turn_over')} />
            </label>
            {errors.company_turn_over && <p className="text-red-600">{errors.company_turn_over.message}</p>}
          </div>
        </div>

        <div className="w-1/2">
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

        <div className="col-span-3 flex justify-center mt-4">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditAttendee;