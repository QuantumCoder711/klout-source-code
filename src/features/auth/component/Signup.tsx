import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'; // Use the custom hook
import { RootState } from '../../../redux/store'; // Your Redux store type
import { Navigate, useNavigate } from 'react-router-dom';
import signinBanner from '../../../assets/images/signinbanner.webp';
import typingEffect from '../../../utils/typingEffect';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import Swal from 'sweetalert2';
import axios from 'axios';
import Loader from '../../../component/Loader';

type Signup = {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  password: string;
  confirm_password: string;
  company: string;
  company_name: string;
  // designation: string;
  // designation_name: string;
  // pincode: string;
  tnc: string;
  notifications: string;
  // address: string;
  mobile_otp: string;
  email_otp: string;
  step: number;
};

type ApiType = {
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
  uuid: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { token, loading, loginError } = useSelector((state: RootState) => state.auth);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, control } = useForm<Signup>();
  const [steps, setSteps] = useState<number>(1);
  const [companies, setCompanies] = useState<ApiType[] | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<string | number>(''); // Track selected company
  const [companyID, setCompanyID] = useState<string | number>(''); // Track selected company

  const [designations, setDesignations] = useState<ApiType[] | undefined>();
  
  const textToType = "Step into the Future of Event Management with Klout Club - Your Event, Your Way!";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/companies`).then(res => setCompanies(res.data.data));
    axios.get(`${apiBaseUrl}/api/job-titles`).then(res => setDesignations(res.data.data));
    console.log(companies, designations);
  }, []);

  const findCompanyID = () => {
    if (companies) {
      const company = companies.find(company => company.name == selectedCompany)
      if (company)
        setCompanyID(company.id);
    }
  }

  useEffect(() => {
    // Only show error modal if the form has been submitted and there's a loginError
    if (submitted && loginError) {
      Swal.fire({
        icon: "error",
        title: loginError,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      setSubmitted(false); // Reset submitted state after error is handled
    }
  }, [loginError, submitted]); // Runs when loginError or submitted changes

  useEffect(() => {
    console.log(selectedCompany);
    console.log(companyID);
    findCompanyID();
    console.log(companyID);
  }, [selectedCompany, companyID]);

  if (token) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: Signup) => {
    // setSubmitted(true); // Mark the form as submitted
    // await dispatch(login(data));
    if (data) {
      const formData = new FormData();
      setFormSubmitting(true);
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof Signup]; // Get the value of the key
        formData.append(key, value as string); // Append each key-value pair to formData
      });

      if (companyID) {
        formData.append("company", companyID as string);
      }

      // formData.append("mobile_otp", );
      // formData.append("email_otp", "");
      if (steps === 1) {
        formData.append("step", "1");
      }
      else {
        formData.append("step", "2");
      }
      formData.append("confirm_password", "");

      // console.log("The form data is:", formData);
      // Log formData content by iterating through it
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      if (steps === 1) {
        try {
          const res = await axios.post(`${apiBaseUrl}/api/register`, formData, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          console.log("The response is: ", res.data);
          if (res.data.status === 200) {
            setSteps(2);
          }

          if (res.data.status === 422) {
            const errors = [];
            if (res.data.error.email) {
              errors.push(res.data.error.email[0]);
            }
            if (res.data.error.mobile_number) {
              errors.push(res.data.error.mobile_number[0]);
            }

            Swal.fire({
              title: res.data.message,
              icon: "error",
              html: errors.join('<br class="mt-4">')  // This will create a line break between errors
            });
          }

        } catch (error) {
          console.log("The error is: ", error);
        } finally {
          setFormSubmitting(false);
        }
      }

      else {
        try {
          const res = await axios.post(`${apiBaseUrl}/api/register`, formData, {
            headers: {
              "Content-Type": "application/json"
            }
          });

          console.log("The response is: ", res.data);
          if (res.data.status === 200) {
            Swal.fire({
              title: res.data.message,
              text: "Your account has been created successfully !",
              icon: 'success',
            }).then(() => navigate("/login"));
          }

          if (res.data.status === 422) {
            Swal.fire({
              title: res.data.error.message,
              icon: "error",
            });
          }

        } catch (error: any) {
          Swal.fire({
            title: error.data.message,
            icon: "error",
          });
        } finally {
          setFormSubmitting(false);
        }
      }
    }
  };

  if (formSubmitting) {
    return (<div className='w-full h-screen bg-white grid place-content-center'>
      <Loader />
    </div>)
  }

  return (
    <div className="flex h-screen">
      {/* Left side with image */}
      <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

        {/* Text */}
        <h1 className="text-white text-5xl font-normal relative z-10 p-20">
          {displayedText}
        </h1>
      </div>

      {/* Right side with form */}
      <div className="w-1/3 flex items-center justify-center bg-gray-100 overflow-scroll">
        <div className="w-full p-8 space-y-4 h-full">
          {steps === 1 && <div className='min-h-fit'>
            <HeadingH2 title='Create Your Account' className='text-center' />
          </div>}

          {steps === 2 && <div className='min-h-fit'>
            <HeadingH2 title='OTP Verification' className='text-center' />
          </div>}

          <form onSubmit={handleSubmit(onSubmit)} style={steps === 2 ? { height: "100%" } : {}} className="space-y-4 flex flex-col justify-center overflow-scroll">

            {steps === 1 && <>
              {/* First Name & Last Name */}
              <div className='flex gap-3'>

                {/* First Name */}
                <div className='w-full'>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    {...register('first_name', { required: 'First name is required' })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                  />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>

                {/* Last Name */}
                <div className='w-full'>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    {...register('last_name', { required: 'Last name is required' })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                  />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
                <input
                  type="text"
                  {...register('mobile_number', {
                    required: 'Mobile No. is required',
                    pattern: {
                      value: /^[0-9]{10}$/, // Regular expression to match exactly 10 digits
                      message: 'Mobile number must be exactly 10 digits'
                    }
                  })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                />
                {errors.mobile_number && <p className="text-red-500 text-sm">{errors.mobile_number.message}</p>}
              </div>


              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/* Password Field with Eye Icon */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 10,
                        message: 'Password must be at least 10 characters long'
                      }
                    })}
                    className="mt-1 block relative w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                  />
                  {/* Eye Icon */}
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                  </span>
                </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  {/* <Link to={"/forgot-password"} className="text-klt_primary-900 text-sm mt-3">Forgot Password ?</Link> */}
              </div>


              {/* Company */}
              <div className='flex gap-3'>
                {/* Company Field */}
                <div className='w-full'>
                  <label className='block text-sm font-medium text-gray-700'>Company</label>
                  <select
                    {...register("company_name", {
                      required: "Company Name is required", onChange: (e) => {
                        setSelectedCompany(e.target.value); // Update state for selected company
                        // setValue("company_name", e.target.value);  // Update form value for company name
                      }
                    })} className="mt-1 block relative w-full  p-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500">
                    <option value="">Select Company</option>
                    {companies?.map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Company */}
                {companyID === 439 && <div className='w-full'>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    {...register('company_name', { required: 'Company is required' })}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                  />
                  {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name.message}</p>}
                </div>}
              </div>

              {/* Company's Conditions */}
              <div className='flex flex-col gap-3'>
                {/* Terms & Conditions */}
                <div className='flex gap-3 items-center'>
                  <Controller
                    name="tnc"
                    control={control}
                    rules={{ required: "You must agree to the Terms & Conditions" }} // Validation rule
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        {...field}
                        id="tnc"
                        className="checkbox rounded size-4"
                        checked={field.value === "on"} // Check if the value is "on"
                        onChange={(e) => field.onChange(e.target.checked ? "on" : "off")} // Set value to "on" or "off"
                      />
                    )}
                  />
                  <p className="text-sm">I agree to company T&C and Privacy Policy</p>
                </div>
                {errors.tnc && <p className="text-red-500 text-sm">{errors.tnc.message}</p>} {/* Error message */}

                {/* Notifications */}
                <div className="flex gap-3 items-center">
                  <Controller
                    name="notifications"
                    control={control}
                    rules={{ required: "You must agree to receive notifications" }} // Validation rule
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        {...field}
                        id="notifications"
                        className="checkbox rounded size-4"
                        checked={field.value === "on"} // Check if the value is "on"
                        onChange={(e) => field.onChange(e.target.checked ? "on" : "off")} // Set value to "on" or "off"
                      />
                    )}
                  />
                  <p className="text-sm">I agree to receive Important updates on SMS, Email & Whatsapp.</p>
                </div>
                {errors.notifications && <p className="text-red-500 text-sm">{errors.notifications.message}</p>} {/* Error message */}
              </div>
            </>}

            {/* OTP's */}
            {steps === 2 && <div className='flex flex-col gap-3'>
              {/* Email OTP */}
              <div className='w-full'>
                <label className="block text-sm font-medium text-gray-700">Email OTP</label>
                <input
                  type="number"
                  {...register('email_otp', { required: 'Email OTP is required' })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                />
                {errors.email_otp && <p className="text-red-500 text-sm">{errors.email_otp.message}</p>}
              </div>

              {/* Mobile OTP */}
              <div className='w-full'>
                <label className="block text-sm font-medium text-gray-700">Mobile OTP</label>
                <input
                  type="number"
                  {...register('mobile_otp', { required: 'Mobile OTP is required' })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                />
                {errors.mobile_otp && <p className="text-red-500 text-sm">{errors.mobile_otp.message}</p>}
              </div>
            </div>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                disabled={loading}
              >
                {steps === 1 ? "Proceed to Next Step" : "Verify OTP's"}
              </button>
            </div>

            <hr className='!my-5 border border-zinc-200' />

            <span>Already have an account ? <Link to={"/login"} className='text-klt_primary-900'>Login Here</Link></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;