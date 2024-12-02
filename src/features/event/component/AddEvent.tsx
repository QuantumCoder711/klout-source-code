// import React, { useState, useEffect, useRef } from 'react';
// import html2canvas from "html2canvas";
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { Country, State, City } from 'country-state-city';
// import { TiArrowRight } from "react-icons/ti";
// import '../component/style/addEvent.css';
// import { addNewEvent, fetchEvents } from '../eventSlice';
// import { useSelector } from 'react-redux';
// import { RootState, useAppDispatch } from '../../../redux/store';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import Loader from '../../../component/Loader';

// type formInputType = {
//     title: string,
//     description: string,
//     event_start_date: string,
//     event_end_date: string,
//     start_time: string,
//     start_minute_time: string,
//     start_time_type: string,
//     end_time: string,
//     end_minute_time: string,
//     end_time_type: string,
//     event_venue_name: string,
//     event_venue_address_1: string,
//     event_venue_address_2: string,
//     event_date: string,
//     country: string,
//     state: string,
//     city: string,
//     pincode: string,
//     image: File | null,
//     feedback: number,
//     status: number,
//     google_map_link: string
// };



// const AddEvent: React.FC = () => {
//     const { token } = useSelector((state: RootState) => state.auth);
//     const dispatch = useAppDispatch();
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<formInputType>();
//     const [countries, setCountries] = useState<any[]>([]);
//     const [states, setStates] = useState<any[]>([]);
//     const [cities, setCities] = useState<any[]>([]);
//     const [selectedImage, setSelectedImage] = useState('');
//     const [image, setImage] = useState(null);
//     const selectedCountryCode = watch('country');
//     const dummyImage = "https://via.placeholder.com/150";

//     const eventDetailsRef = useRef<HTMLDivElement>(null);

//     const [eventCreate, setEventCreate] = useState<Boolean>(false);
//     const [eventName, setEventName] = useState<string>("");
//     const [eventImage, setEventImage] = useState<string | Blob | null>(null);
//     const [eventStartDate, setEventStartDate] = useState<string>("");
//     const [eventEndDate, setEventEndDate] = useState<string>("");
//     const [eventVenueName, setEventVenueName] = useState<string>("");
//     const [eventCity, setEventCity] = useState<string>("");


//     // Handle image upload
//     const handleImageUpload = (e: any) => {
//         const file = e.target.files?.[0];
//         setImage(file)
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setSelectedImage(imageUrl);
//         }
//     };

//     useEffect(() => {
//         // Load countries on component mount
//         const countryList = Country.getAllCountries();
//         setCountries(countryList);
//     }, []);

//     if (!countries) {
//         return <Loader />
//     }

//     const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedCountry = e.target.value;
//         setValue('country', selectedCountry);
//         // Reset states and cities
//         setStates(State.getStatesOfCountry(selectedCountry));
//         setCities([]); // Clear cities when country changes
//     };

//     const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedState = e.target.value;
//         setValue('state', selectedState);
//         // Set cities based on selected state and country
//         setCities(City.getCitiesOfState(selectedCountryCode, selectedState));
//     };
//     // Define what happens on form submit
//     // const onSubmit: SubmitHandler<formInputType> = async (data) => {
//     //     data.event_venue_address_2 = data.event_venue_address_1;
//     //     data.event_date = data.event_start_date;
//     //     data.feedback = 1;
//     //     data.status = 1;
//     //     const formData = new FormData();
//     //     Object.entries(data).forEach(([key, value]) => {
//     //         formData.append(key, value as string);
//     //     });
//     //     if (image) {
//     //         formData.append('image', image);
//     //     }

//     //     // Dispatch the addNewEvent action
//     //     dispatch(addNewEvent({ eventData: formData, token }));


//     //     try {
//     //         await dispatch(addNewEvent({ eventData: formData, token })).unwrap(); // unwrap if using createAsyncThunk
//     //         toast.success('Event added successfully!');

//     //         // Clear the form
//     //         reset();

//     //         // Dispatch another action here if needed
//     //         // dispatch(anotherAction());
//     //     } catch (error) {
//     //         toast.error(error.message || 'Something went wrong!');
//     //     }
//     // };

//     // Function to convert the div to an image
//     const handleConvertToImage = () => {
//         if (eventDetailsRef.current) {
//             // Use html2canvas to take a screenshot of the div
//             html2canvas(eventDetailsRef.current).then((canvas) => {
//                 const imageUrl = canvas.toDataURL('image/png'); // Convert canvas to image
//                 setEventImage(imageUrl);
//             });
//         }
//     };



//     const onSubmit: SubmitHandler<formInputType> = async (data) => {
//         // Step 1: Show confirmation dialog to ask if the user wants to submit the event
//         const result = await Swal.fire({
//             title: 'Do you want to add this event ?',
//             icon: 'info',
//             showDenyButton: true,
//             // text: "You won't be able to revert this once submitted!",
//             confirmButtonText: 'Yes, add it!',
//             denyButtonText: 'No, cancel',
//         });

//         // If the user confirms, proceed with the submission
//         if (result.isConfirmed) {
//             handleConvertToImage();
//             console.log(image);
//             // Step 2: Prepare data
//             data.event_venue_address_2 = data.event_venue_address_1; // Duplicate address
//             data.event_date = data.event_start_date; // Map event date
//             data.feedback = 1; // Set default feedback
//             data.status = 1; // Set default status

//             // Check if image is provided
//             if (!image) {
//                 Swal.fire({
//                     title: 'Error',
//                     text: 'Please upload an image before submitting the event.',
//                     icon: 'error',
//                     confirmButtonText: 'Ok'
//                 });
//                 return; // Stop the form submission if no image
//             }

//             const formData = new FormData();
//             Object.entries(data).forEach(([key, value]) => {
//                 formData.append(key, value as string);
//             });

//             // Append image if available
//             if (image) {
//                 formData.append('image', image);
//             }

//             try {
//                 // Dispatch the addNewEvent action
//                 await dispatch(addNewEvent({ eventData: formData, token })).unwrap(); // unwrap if using createAsyncThunk

//                 // Fetch events after adding the new one
//                 await dispatch(fetchEvents(token));

//                 // Show success message
//                 Swal.fire({
//                     title: 'Success',
//                     text: 'Event added successfully!',
//                     icon: 'success',
//                     confirmButtonText: 'Ok'
//                 }).then(() => {
//                     // Navigate to the home page after success
//                     navigate('/');
//                 });

//                 // Clear the form
//                 reset();
//             } catch (error: any) {
//                 // Show error message
//                 const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
//                 Swal.fire({
//                     title: 'Error',
//                     text: errorMessage,
//                     icon: 'error',
//                     confirmButtonText: 'Ok'
//                 });
//             }
//         }
//     };

//     const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
//     const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
//     const amPm = ['AM', 'PM'];

//     return (

//         <div className='p-6 pt-3'>
//             <h2 className='text-black text-2xl font-semibold ps-5'>Add Details to create new event</h2>
//             {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
//             <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
//                 {eventCreate && <>
//                     <div ref={eventDetailsRef} className='h-[350px] w-[350px] p-3 mx-auto shadow-lg mt-3 bg-white rounded-md border border-gray-300'>
//                         <p className="text-center text-3xl font-bold text-gray-800 mb-4">{eventName}</p>
//                         <div className='flex flex-col space-y-4 mt-10'>

//                             <div className='flex justify-between items-center'>
//                                 {/* Event Start Date */}
//                                 {eventStartDate && (
//                                     <div className='flex justify-center items-center'>
//                                         <span className='font-semibold text-gray-600'>
//                                             <TiArrowRight className='inline-block mr-2 text-orange-500' />
//                                             Start:
//                                         </span>
//                                         <p className='ml-1 font-normal text-gray-800'>{eventStartDate}</p>
//                                     </div>
//                                 )}

//                                 {/* Event End Date */}
//                                 {eventEndDate && (
//                                     <div className='flex justify-center items-center'>
//                                         <span className='font-semibold text-gray-600'>
//                                             <TiArrowRight className='inline-block mr-2 text-orange-500' />
//                                             End:
//                                         </span>
//                                         <p className='ml-1 font-normal text-gray-800'>{eventEndDate}</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Event Venue */}
//                             {eventVenueName && (
//                                 <div className='mt-5'>
//                                     <p className='font-normal text-gray-800'>
//                                         <span className='text-lg font-semibold text-gray-600'>
//                                             <TiArrowRight className='inline-block mr-2 text-orange-500' />
//                                             Address:
//                                         </span>
//                                         {eventVenueName}, {eventCity}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <button onClick={() => setEventCreate(false)} className='block mt-3 bg-orange-500 hover:bg-orange-600 btn mx-auto text-center text-white'>Upload Image</button>
//                 </>
//                 }
//                 <div className='flex flex-col gap-3 my-4'>
//                     {/* Title */}
//                     <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
//                         <span className=" font-semibold text-green-700 flex justify-between items-center">Event Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                         {/* <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required', onChange=(e)=>setEventName(e.target.value)})} /> */}
//                         <input
//                             id="title"
//                             type="text"
//                             className="grow"
//                             {...register('title', {
//                                 required: 'Title is required',
//                             })}
//                             onChange={(e) => setEventName(e.target.value)} // Correctly add onChange handler here
//                         />
//                     </label>
//                     {errors.title && <p className="text-red-600">{errors.title.message}</p>}
//                 </div>


//                 {!eventCreate && <div className='flex flex-row-reverse gap-3'>
//                     {/* Image Upload */}
//                     <div className='flex flex-col gap-3'>
//                         <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
//                             <span className="font-semibold text-green-700 flex justify-between items-center">
//                                 Banner Image &nbsp; <TiArrowRight className='mt-1' />
//                             </span>
//                             <input
//                                 id="image"
//                                 type="file"
//                                 accept="image/*"
//                                 className="grow"
//                                 onChange={handleImageUpload}
//                             />
//                         </label>
//                         <span className='block text-center'>Or</span>
//                         <button onClick={() => setEventCreate(true)} className='btn hover:bg-orange-600 w-fit mx-auto bg-orange-500 p-3 text-white'>Create Event Banner</button>
//                     </div>

//                     {/* Display the uploaded image or dummy image */}
//                     <div className="mt-3 w-full">
//                         <img
//                             src={selectedImage || dummyImage}
//                             alt="Selected Banner"
//                             className="w-full h-60 object-cover"
//                         />
//                     </div>
//                 </div>}

//                 <div className='flex flex-col gap-3 my-4'>
//                     {/* Description */}
//                     <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
//                         <span className=" font-semibold text-green-700 flex justify-between items-center">Description <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                         <textarea id="description" className="grow bg-white" {...register('description', { required: 'Description is required' })} />
//                     </label>
//                     {errors.description && <p className="text-red-600">{errors.description.message}</p>}
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
//                     <div className='flex flex-col gap-3'>
//                         {/* Event Start Date */}
//                         <label htmlFor="event_start_date" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">Event Start Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <input id="event_start_date" type="date" className="grow bg-white" {...register('event_start_date', { required: 'Start date is required' })} onChange={(e) => setEventStartDate(e.target.value)} />
//                         </label>
//                         {errors.event_start_date && <p className="text-red-600">{errors.event_start_date.message}</p>}
//                     </div>

//                     <div className='flex flex-col gap-3'>
//                         {/* Event End Date */}
//                         <label htmlFor="event_end_date" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">Event End Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <input id="event_end_date" type="date" className="grow" {...register('event_end_date', { required: 'End date is required' })} onChange={(e) => setEventEndDate(e.target.value)} />
//                         </label>
//                         {errors.event_end_date && <p className="text-red-600">{errors.event_end_date.message}</p>}
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
//                     <div className='flex flex-col gap-3'>
//                         {/* Start Time */}
//                         <label className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <div className="flex gap-2 grow">
//                                 <select id="start_time" className="grow bg-white" {...register('start_time', { required: 'Start hour is required' })}>
//                                     <option value="">HH</option>
//                                     {hours.map((hour) => (
//                                         <option key={hour} value={hour}>{hour}</option>
//                                     ))}
//                                 </select>
//                                 <select id="start_minute_time" className="grow bg-white" {...register('start_minute_time', { required: 'Start minute is required' })}>
//                                     <option value="">MM</option>
//                                     {minutes.map((minute) => (
//                                         <option key={minute} value={minute}>{minute}</option>
//                                     ))}
//                                 </select>
//                                 <select id="start_time_type" className="grow bg-white" {...register('start_time_type', { required: 'AM/PM is required' })}>
//                                     <option value="">AM/PM</option>
//                                     {amPm.map((ampm) => (
//                                         <option key={ampm} value={ampm}>{ampm}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </label>
//                         {errors.start_time && <p className="text-red-600">{errors.start_time.message}</p>}
//                         {errors.start_minute_time && <p className="text-red-600">{errors.start_minute_time.message}</p>}
//                         {errors.start_time_type && <p className="text-red-600">{errors.start_time_type.message}</p>}
//                     </div>

//                     <div className='flex flex-col gap-3'>
//                         {/* End Time */}
//                         <label className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">End Time <span className="text-red-600 ml-1">*</span>&nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <div className="flex gap-2 grow">
//                                 <select id="end_time" className="grow bg-white" {...register('end_time', { required: 'End hour is required' })}>
//                                     <option value="">HH</option>
//                                     {hours.map((hour) => (
//                                         <option key={hour} value={hour}>{hour}</option>
//                                     ))}
//                                 </select>
//                                 <select id="end_minute_time" className="grow bg-white" {...register('end_minute_time', { required: 'End minute is required' })}>
//                                     <option value="">MM</option>
//                                     {minutes.map((minute) => (
//                                         <option key={minute} value={minute}>{minute}</option>
//                                     ))}
//                                 </select>
//                                 <select id="end_time_type" className="grow bg-white" {...register('end_time_type', { required: 'AM/PM is required' })}>
//                                     <option value="">AM/PM</option>
//                                     {amPm.map((ampm) => (
//                                         <option key={ampm} value={ampm}>{ampm}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </label>
//                         {errors.end_time && <p className="text-red-600">{errors.end_time.message}</p>}
//                         {errors.end_minute_time && <p className="text-red-600">{errors.end_minute_time.message}</p>}
//                         {errors.end_time_type && <p className="text-red-600">{errors.end_time_type.message}</p>}
//                     </div>
//                 </div>





//                 <div className='flex flex-col gap-3 my-4'>
//                     {/* Venue Name */}
//                     <label htmlFor="event_venue_name" className="input input-bordered bg-white text-black flex items-center gap-2">
//                         <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                         <input id="event_venue_name" type="text" className="grow" {...register('event_venue_name', { required: 'Venue name is required' })} onChange={(e) => setEventVenueName(e.target.value)} />
//                     </label>
//                     {errors.event_venue_name && <p className="text-red-600">{errors.event_venue_name.message}</p>}
//                 </div>

//                 <div className='flex flex-col gap-3 my-4'>
//                     {/* Venue Address */}
//                     <label htmlFor="event_venue_address_1" className="input input-bordered bg-white text-black flex items-center gap-2">
//                         <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Address <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                         <input id="event_venue_address_1" type="text" className="grow" {...register('event_venue_address_1', { required: 'Address is required' })} />
//                     </label>
//                     {errors.event_venue_address_1 && <p className="text-red-600">{errors.event_venue_address_1.message}</p>}
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
//                     <div className='flex flex-col gap-3'>
//                         {/* Country */}
//                         <label htmlFor="country" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">Country <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <select id="country" className="grow bg-white" {...register('country', { required: 'Country is required' })} onChange={handleCountryChange}>
//                                 <option value="">Select Country</option>
//                                 {countries.map((country) => (
//                                     <option key={country.isoCode} value={country.isoCode}>
//                                         {country.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </label>
//                         {errors.country && <p className="text-red-600">{errors.country.message}</p>}
//                     </div>

//                     <div className='flex flex-col gap-3'>
//                         {/* State */}
//                         <label htmlFor="state" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">State <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <select id="state" className="grow bg-white" {...register('state', { required: 'State is required' })} onChange={handleStateChange}>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.isoCode} value={state.isoCode}>
//                                         {state.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </label>
//                         {errors.state && <p className="text-red-600">{errors.state.message}</p>}
//                     </div>

//                     <div className='flex flex-col gap-3'>
//                         {/* City */}
//                         <label htmlFor="city" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">City <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <select id="city" className="grow bg-white" {...register('city', { required: 'City is required' })} onChange={(e) => setEventCity(e.target.value)}>
//                                 <option value="">Select City</option>
//                                 {cities.map((city) => (
//                                     <option key={city.id} value={city.name}>
//                                         {city.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </label>
//                         {errors.city && <p className="text-red-600">{errors.city.message}</p>}
//                     </div>

//                     <div className='flex flex-col gap-3'>
//                         {/* Pincode */}
//                         <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
//                             <span className=" font-semibold text-green-700 flex justify-between items-center">Pincode <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
//                             <input id="pincode" type="text" className="grow" {...register('pincode', { required: 'Pincode is required', minLength: { value: 6, message: 'Pincode must be at least 5 characters' } })} />
//                         </label>
//                         {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
//                     </div>
//                 </div>


//                 <div className='flex flex-col gap-3 my-4'>
//                     {/* Google Map Link */}
//                     <label htmlFor="google_map_link" className="input input-bordered bg-white text-black flex items-center gap-2">
//                         <span className=" font-semibold text-green-700 flex justify-between items-center">Google Map Link &nbsp; <TiArrowRight className='mt-1' /> </span>
//                         <input id="google_map_link" type="url" className="grow" {...register('google_map_link', { required: false, pattern: { value: /^https?:\/\//, message: 'Link must start with http or https' } })} />
//                     </label>
//                     {errors.google_map_link && <p className="text-red-600">{errors.google_map_link.message}</p>}
//                 </div>

//                 <div className="col-span-3 flex justify-center mt-4">
//                     <button type="submit" className="btn btn-primary">Add Event</button>
//                 </div>
//             </form>
//         </div>

//     );
// };

// export default AddEvent;


import React, { useState, useEffect } from 'react';
// import html2canvas from "html2canvas";
import { useForm, SubmitHandler } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { TiArrowRight } from "react-icons/ti";
import '../component/style/addEvent.css';
import { addNewEvent, fetchEvents } from '../eventSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../../component/Loader';

type formInputType = {
    title: string,
    description: string,
    event_start_date: string,
    event_end_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    event_venue_name: string,
    event_venue_address_1: string,
    event_venue_address_2: string,
    event_date: string,
    country: string,
    state: string,
    city: string,
    pincode: string,
    image: File | null,
    feedback: number,
    status: number,
    google_map_link: string
};



const AddEvent: React.FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<formInputType>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [image, setImage] = useState(null);
    const selectedCountryCode = watch('country');
    const dummyImage = "https://via.placeholder.com/150";

    // const eventDetailsRef = useRef<HTMLDivElement>(null);

    // const [eventCreate, setEventCreate] = useState<Boolean>(false);
    // const [eventName, setEventName] = useState<string>("");
    // const [eventStartDate, setEventStartDate] = useState<string>("");
    // const [eventEndDate, setEventEndDate] = useState<string>("");
    // const [eventVenueName, setEventVenueName] = useState<string>("");
    // const [eventCity, setEventCity] = useState<string>("");


    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    useEffect(() => {
        // Load countries on component mount
        const countryList = Country.getAllCountries();
        setCountries(countryList);
    }, []);

    if (!countries) {
        return <Loader />
    }

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = e.target.value;
        setValue('country', selectedCountry);
        // Reset states and cities
        setStates(State.getStatesOfCountry(selectedCountry));
        setCities([]); // Clear cities when country changes
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedState = e.target.value;
        setValue('state', selectedState);
        // Set cities based on selected state and country
        setCities(City.getCitiesOfState(selectedCountryCode, selectedState));
    };
    // Define what happens on form submit
    // const onSubmit: SubmitHandler<formInputType> = async (data) => {
    //     data.event_venue_address_2 = data.event_venue_address_1;
    //     data.event_date = data.event_start_date;
    //     data.feedback = 1;
    //     data.status = 1;
    //     const formData = new FormData();
    //     Object.entries(data).forEach(([key, value]) => {
    //         formData.append(key, value as string);
    //     });
    //     if (image) {
    //         formData.append('image', image);
    //     }

    //     // Dispatch the addNewEvent action
    //     dispatch(addNewEvent({ eventData: formData, token }));


    //     try {
    //         await dispatch(addNewEvent({ eventData: formData, token })).unwrap(); // unwrap if using createAsyncThunk
    //         toast.success('Event added successfully!');

    //         // Clear the form
    //         reset();

    //         // Dispatch another action here if needed
    //         // dispatch(anotherAction());
    //     } catch (error) {
    //         toast.error(error.message || 'Something went wrong!');
    //     }
    // };

    // Function to convert the div to an image
    // const handleConvertToImage = async () => {
    //     if (eventDetailsRef.current) {
    //         // Use html2canvas to take a screenshot of the div
    //         await html2canvas(eventDetailsRef.current).then(async (canvas) => {
    //             const imageUrl = await canvas.toDataURL('image/png'); // Convert canvas to image
    //             if(eventName!=="") {
    //                 setSelectedImage(imageUrl);
    //             }
    //             // setImageSrc(imageUrl); // Save the image URL in state
    //         });
    //     }
    // };


    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Step 1: Show confirmation dialog to ask if the user wants to submit the event
        const result = await Swal.fire({
            title: 'Do you want to add this event ?',
            icon: 'info',
            showDenyButton: true,
            // text: "You won't be able to revert this once submitted!",
            confirmButtonText: 'Yes, add it!',
            denyButtonText: 'No, cancel',
        });

        // If the user confirms, proceed with the submission
        if (result.isConfirmed) {
            // await handleConvertToImage();
            console.log(selectedImage);
            // Step 2: Prepare data
            data.event_venue_address_2 = data.event_venue_address_1; // Duplicate address
            data.event_date = data.event_start_date; // Map event date
            data.feedback = 1; // Set default feedback
            data.status = 1; // Set default status

            // Check if image is provided
            if (!image) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please upload an image before submitting the event.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Stop the form submission if no image
            }

            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            // Append image if available
            if (image) {
                formData.append('image', image);
            }

            try {
                // Dispatch the addNewEvent action
                await dispatch(addNewEvent({ eventData: formData, token })).unwrap(); // unwrap if using createAsyncThunk

                // Fetch events after adding the new one
                await dispatch(fetchEvents(token));

                // Show success message
                Swal.fire({
                    title: 'Success',
                    text: 'Event added successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Navigate to the home page after success
                    navigate('/');
                });

                // Clear the form
                reset();
            } catch (error: any) {
                // Show error message
                const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPm = ['AM', 'PM'];

    return (

        <div className='p-6 pt-3'>
            <h2 className='text-black text-2xl font-semibold ps-5'>Add Details to create new event</h2>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4">

                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Event Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        {/* <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required', onChange=(e)=>setEventName(e.target.value)})} /> */}
                        <input
                            id="title"
                            type="text"
                            className="grow"
                            {...register('title', {
                                required: 'Title is required',
                            })}
                        // onChange={(e) => setEventName(e.target.value)} // Correctly add onChange handler here
                        />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>


                <div className='flex flex-row-reverse gap-3'>
                    {/* Image Upload */}
                    <div className='flex flex-col gap-3'>
                        <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Banner Image <span className="text-red-600 ml-1">*</span>  &nbsp; <TiArrowRight className='mt-1' />
                            </span>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="grow"
                                onChange={handleImageUpload}
                            />
                        </label>
                        {/* <span className='block text-center'>Or</span> */}
                        {/* <button onClick={() => setEventCreate(true)} className='btn hover:bg-orange-600 w-fit mx-auto bg-orange-500 p-3 text-white'>Create Event Banner</button> */}
                    </div>

                    {/* Display the uploaded image or dummy image */}
                    <div className="mt-3 w-full">
                        <img
                            src={selectedImage || dummyImage}
                            alt="Selected Banner"
                            className="w-full h-60 object-cover"
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" className="grow bg-white" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className='flex flex-col gap-3'>
                        {/* Event Start Date */}
                        <label htmlFor="event_start_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event Start Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_start_date" type="date" className="grow bg-white" {...register('event_start_date', { required: 'Start date is required' })}
                            // onChange={(e) => setEventStartDate(e.target.value)} 
                            />
                        </label>
                        {errors.event_start_date && <p className="text-red-600">{errors.event_start_date.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Event End Date */}
                        <label htmlFor="event_end_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event End Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_end_date" type="date" className="grow" {...register('event_end_date', { required: 'End date is required' })}
                            // onChange={(e) => setEventEndDate(e.target.value)}
                            />
                        </label>
                        {errors.event_end_date && <p className="text-red-600">{errors.event_end_date.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Start Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="start_time" className="grow bg-white" {...register('start_time', { required: 'Start hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="start_minute_time" className="grow bg-white" {...register('start_minute_time', { required: 'Start minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="start_time_type" className="grow bg-white" {...register('start_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.start_time && <p className="text-red-600">{errors.start_time.message}</p>}
                        {errors.start_minute_time && <p className="text-red-600">{errors.start_minute_time.message}</p>}
                        {errors.start_time_type && <p className="text-red-600">{errors.start_time_type.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* End Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">End Time <span className="text-red-600 ml-1">*</span>&nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="end_time" className="grow bg-white" {...register('end_time', { required: 'End hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="end_minute_time" className="grow bg-white" {...register('end_minute_time', { required: 'End minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="end_time_type" className="grow bg-white" {...register('end_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.end_time && <p className="text-red-600">{errors.end_time.message}</p>}
                        {errors.end_minute_time && <p className="text-red-600">{errors.end_minute_time.message}</p>}
                        {errors.end_time_type && <p className="text-red-600">{errors.end_time_type.message}</p>}
                    </div>
                </div>





                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Name */}
                    <label htmlFor="event_venue_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_name" type="text" className="grow" {...register('event_venue_name', { required: 'Venue name is required' })}
                        // onChange={(e) => setEventVenueName(e.target.value)} 
                        />
                    </label>
                    {errors.event_venue_name && <p className="text-red-600">{errors.event_venue_name.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Address */}
                    <label htmlFor="event_venue_address_1" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Address <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_address_1" type="text" className="grow" {...register('event_venue_address_1', { required: 'Address is required' })} />
                    </label>
                    {errors.event_venue_address_1 && <p className="text-red-600">{errors.event_venue_address_1.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Country */}
                        <label htmlFor="country" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Country <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="country" className="grow bg-white" {...register('country', { required: 'Country is required' })} onChange={handleCountryChange}>
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.country && <p className="text-red-600">{errors.country.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* State */}
                        <label htmlFor="state" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">State <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="state" className="grow bg-white" {...register('state', { required: 'State is required' })} onChange={handleStateChange}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.state && <p className="text-red-600">{errors.state.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* City */}
                        <label htmlFor="city" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">City <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="city" className="grow bg-white" {...register('city', { required: 'City is required' })}
                            // onChange={(e) => setEventCity(e.target.value)}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Pincode */}
                        <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Pincode <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="pincode" type="text" className="grow" {...register('pincode', { required: 'Pincode is required', minLength: { value: 6, message: 'Pincode must be at least 5 characters' } })} />
                        </label>
                        {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
                    </div>
                </div>


                <div className='flex flex-col gap-3 my-4'>
                    {/* Google Map Link */}
                    <label htmlFor="google_map_link" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Google Map Link &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="google_map_link" type="url" className="grow" {...register('google_map_link', { required: false, pattern: { value: /^https?:\/\//, message: 'Link must start with http or https' } })} />
                    </label>
                    {errors.google_map_link && <p className="text-red-600">{errors.google_map_link.message}</p>}
                </div>

                <div className="col-span-3 flex justify-center mt-4">
                    <button type="submit" className="btn btn-primary">Add Event</button>
                </div>
            </form>
        </div>

    );
};

export default AddEvent;