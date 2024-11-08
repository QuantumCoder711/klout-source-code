import React, { useState } from "react";
import HeadingH2 from "../component/HeadingH2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";

type formInputType = {
  firstName: string,
  lastName: string;
  email: string;
  description: string;
  end_time: string,
  phone: string;
  end_minute_time: string,
  end_time_type: string,
  priority: string;
  company: string;
  address: string;
  pincode: string;
  designation: string;
  image: File | null,
};

const ProfilePage: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<formInputType>();
  const [selectedImage, setSelectedImage] = useState('');
  const [image, setImage] = useState(null);
  const dummyImage = "https://via.placeholder.com/150";

  // Handle image upload
  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    setImage(file)
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const onSubmit: SubmitHandler<formInputType> = async (data) => {
    // Prepare data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (image) {
      formData.append('image', image);
    }

    console.log(formData);
  };
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
              <label htmlFor="firstName" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className=" font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="first-name" type="text" className="grow" {...register('firstName', { required: 'First Name is required' })} />
              </label>
              {errors.firstName && <p className="text-red-600">{errors.firstName.message}</p>}
            </div>

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Last Name */}
              <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className=" font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="title" type="text" className="grow" {...register('lastName', { required: 'Last Name is required' })} />
              </label>
              {errors.lastName && <p className="text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="flex w-full gap-3">

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Email */}
              <label htmlFor="email" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className=" font-semibold text-green-700 flex justify-between items-center">Email &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="first-name" type="text" className="grow" {...register('email', { required: 'Email is required' })} />
              </label>
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Phone Number */}
              <label htmlFor="phone" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">Phone No. &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="phone" type="text" className="grow" {...register('phone', { required: 'Phone No. is required' })} />
              </label>
              {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="flex w-full gap-3">

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Company */}
              <label htmlFor="company" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className=" font-semibold text-green-700 flex justify-between items-center">Company Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="company" type="text" className="grow" {...register('company', { required: 'Company name is required' })} />
              </label>
              {errors.company && <p className="text-red-600">{errors.company.message}</p>}
            </div>

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Designation */}
              <label htmlFor="designation" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">Designation &nbsp; <TiArrowRight className='mt-1' /> </span>
                <input id="designation" type="text" className="grow" {...register('designation', { required: 'Designation is required' })} />
              </label>
              {errors.designation && <p className="text-red-600">{errors.designation.message}</p>}
            </div>
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
                  onChange={handleImageUpload}
                />
              </label>
              {errors.image && <p className="text-red-600">{errors.image.message}</p>}

              {/* Display the uploaded image or dummy image */}
              <div className="mt-3">
                <img
                  src={selectedImage || dummyImage}
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
                <input id="address" type="text" className="grow" {...register('address', { required: 'Address is required' })} />
              </label>
              {errors.address && <p className="text-red-600">{errors.address.message}</p>}
            </div>

            <div className='flex flex-col w-full gap-3 my-4'>
              {/* Pincode */}
              <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">Pincode &nbsp; <TiArrowRight className='mt-1' /></span>
                <input id="pincode" type="text" className="grow" {...register('pincode', { required: 'Pincode is required' })} />
              </label>
              {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
            </div>
          </div>

          <div className="col-span-3 flex justify-center mt-4">
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
