import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoIosClose, IoMdArrowRoundBack } from 'react-icons/io';
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../redux/store';
import Swal from 'sweetalert2';
import Loader from '../../../component/Loader';
import { useDispatch } from 'react-redux';
import { heading } from '../../heading/headingSlice';

type formInputType = {
    title: string,
    description: string,
    event_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    position: number;
    image_path: string | null,
    event_id: string;
    speakers: attendeeType[];
};

type attendeeType = {
    uuid: string;
    title: string;
    first_name: string;
    job_title: string;
    company_name: string;
    email_id: string;
    alternate_email: string;
    phone_number: string;
    alternate_mobile_number: string;
    status: string;
    last_name: string;
    check_in: number;
    check_in_time: string;
    check_in_second: number;
    check_in_second_time: string;
    check_in_third: number;
    check_in_third_time: string;
    check_in_forth: number;
    check_in_forth_time: string;
    check_in_fifth: number;
    check_in_fifth_time: string;
    event_name: string;
    not_invited: boolean;
    image: string;
    id: number;
};

const EditAgenda: React.FC = () => {
    const { agenda_uuid, id } = useParams<{ agenda_uuid: string, id: string }>();
    const dummyImage = "https://via.placeholder.com/150";
    // const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<formInputType>();
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [agenda, setAgendaData] = useState<formInputType | null>();
    const [image, setImage] = useState<File | null>(null);  // This is where the selected image file will be stored.
    const [agendaImage, setAgendaImage] = useState<string>(dummyImage);

    const { token } = useSelector((state: RootState) => (state.auth));

    // const { currentAgendaUUID } = useSelector((state: RootState) => state.events);
    const { loading } = useSelector((state: RootState) => state.events);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // const currentEvent = events.find((event) => event.uuid === id); // Use find() to directly get the current event

    const [availableSpeakers, setAvailableSpeakers] = useState<attendeeType[]>([]);
    const [taggedSpeakers, setTaggedSpeakers] = useState<attendeeType[]>([]);

    const handleAddSpeaker = (id: number) => {
        const selectedSpeaker = availableSpeakers.find((speaker) => speaker.id === id);
        if (selectedSpeaker) {
            setTaggedSpeakers((prev) => [...prev, selectedSpeaker]);
            setAvailableSpeakers((prev) => prev.filter((speaker) => speaker.id !== id));
        }
    };

    const handleRemoveSpeaker = (id: number) => {
        const removedSpeaker = taggedSpeakers.find((speaker) => speaker.id === id);
        if (removedSpeaker) {
            setAvailableSpeakers((prev) => [...prev, removedSpeaker]);
            setTaggedSpeakers((prev) => prev.filter((speaker) => speaker.id !== id));
        }
    };

    useEffect(() => {
        if (agenda_uuid) {
            // Fetching All Speakers
            axios.post(`${apiBaseUrl}/api/speaker-attendee/${id}`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                const allSpeakers = res.data.data; // All available speakers
                console.log("All speakers: ", allSpeakers);

                // Fetching Agenda Data
                axios.get(`${apiBaseUrl}/api/agendas/${agenda_uuid}`)
                    .then((res) => {
                        if (res.data) {
                            const agendaData: formInputType = res.data.data;

                            // Set tagged speakers
                            if (agendaData.speakers) {
                                setTaggedSpeakers(agendaData.speakers);
                            }

                            setAgendaData(agendaData);

                            // Remove already tagged speakers from available speakers
                            const taggedSpeakerIds = new Set(
                                (agendaData.speakers || []).map(speaker => speaker.id) // Assuming each speaker has a unique 'id'
                            );

                            const filteredAvailableSpeakers = allSpeakers.filter(
                                (speaker: attendeeType) => !taggedSpeakerIds.has(speaker.id)
                            );

                            setAvailableSpeakers(filteredAvailableSpeakers);
                            console.log("Filtered available speakers: ", filteredAvailableSpeakers);

                            // Set the default form values using react-hook-form's setValue
                            setValue('title', agendaData.title);
                            setValue('description', agendaData.description);
                            setValue('event_date', agendaData.event_date);
                            setValue('start_time', agendaData.start_time);
                            setValue('start_minute_time', agendaData.start_minute_time);
                            setValue('start_time_type', agendaData.start_time_type);
                            setValue('end_time', agendaData.end_time);
                            setValue('end_minute_time', agendaData.end_minute_time);
                            setValue('end_time_type', agendaData.end_time_type);
                            setValue('position', agendaData.position);
                            setValue('event_id', agendaData.event_id);

                            // If the agenda has an image path, set it as the selected image
                            if (agendaData.image_path) {
                                setAgendaImage(`${apiBaseUrl}/${agendaData.image_path}`);
                            }
                        }
                    });
            });
        }
    }, [agenda_uuid, setValue]);


    console.log(agenda);

    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file);  // Set the selected file
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);  // Display the image preview
        }
    };

    if (loading) {
        return <Loader />
    }

    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Step 1: Show confirmation dialog to ask if the user wants to update
        const result = await Swal.fire({
            title: 'Are you sure you want to update this agenda?',
            icon: 'warning',
            showDenyButton: true,
            text: "You won't be able to revert this!",
            confirmButtonText: 'Yes, update it!',
            denyButtonText: 'No, cancel',
        });

        // If the user confirms, proceed with the update
        if (result.isConfirmed) {
            // Prepare FormData
            const formData = new FormData();

            // Append form data from other fields
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            // Append the image as 'image_path' only if it exists
            if (image) {
                formData.append('image_path', image);  // Append the actual File object
            }

            formData.append("_method", 'PUT');

            // Append event_id
            if (id) {
                formData.append("event_id", id);
            }

            // Log the FormData for debugging (FormData can't be logged directly, so you will need to inspect it)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (taggedSpeakers) {
                const allIds = taggedSpeakers.map((speaker) => String(speaker.id));
                formData.append("tag_speakers", String(allIds));
            }

            console.log("Form Data is: ", formData);

            // Step 2: Make the API request to update the agenda
            try {
                const res = await axios.post(`${apiBaseUrl}/api/agendas/${agenda_uuid}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`
                    },
                });

                // Step 3: If the update is successful, show success message
                if (res.data.status === 200) {
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Navigate to view agendas page if user clicks "Ok"
                            // navigate('/events/view-agendas');
                            window.history.back();
                        }
                    });
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong while updating the agenda.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const priority = Array.from({ length: 100 }, (_, i) => (i + 1));
    const amPm = ['AM', 'PM'];

    return (
        <div className='p-6 pt-3'>
            <div className='flex justify-between items-center'>
                <h2 className='text-black text-2xl font-semibold'>Edit Agenda</h2>
                <div className='flex items-center gap-3'>
                    <Link
                        to="#"
                        onClick={() => {
                            window.history.back(); // Go back to the previous page
                            dispatch(heading("View Agendas")); // Optional: You can still dispatch the action if needed
                        }}
                        className="btn btn-error text-white btn-sm"
                    >
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="gap-4 mt-10">
                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required' })} />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>

                <div className='flex items-center gap-3'>
                    {/* Image Upload */}
                    <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                        <span className="font-semibold text-green-700 flex justify-between items-center">
                            Banner Image &nbsp; <TiArrowRight className='mt-1' />
                        </span>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="grow"
                            onChange={handleImageUpload}
                        />
                    </label>

                    {/* Display the uploaded image or dummy image */}
                    <div className="w-full">
                        <img
                            src={selectedImage || agendaImage}
                            alt="Selected Banner"
                            className="w-full h-60 object-contain"
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    {/* <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" className="grow bg-white" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>} */}


                    <div className='flex flex-col gap-3 my-4 bg-white rounded-lg p-4'>
                        {/* Description */}
                        <label htmlFor='description' className="font-semibold text-green-700 flex">Description <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </label>
                        <textarea id="description" className="grow bg-white input-bordered input h-auto p-2" rows={4} {...register('description', { required: 'Description is required' })}>{agenda?.description}</textarea>
                        {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                    </div>

                    {/* Tag Speakers */}
                    <div className="flex gap-3">
                        <div className="w-full">
                            <div
                                id="tag_speaker"
                                className="grow bg-white rounded-md border h-full flex flex-wrap gap-2 p-2"
                            >
                                <label
                                    htmlFor="tag_speaker"
                                    className=""
                                >
                                    <span className="font-semibold text-green-700 flex items-center">
                                        Tag Speaker &nbsp; <TiArrowRight className="mt-1" />
                                    </span>
                                </label>
                                {taggedSpeakers.map((speaker) => (
                                    <span
                                        key={speaker.id}
                                        className="bg-green-200 inline-block relative text-green-900 p-2 rounded cursor-pointer"
                                        onClick={() => handleRemoveSpeaker(speaker.id)}
                                    >
                                        <IoIosClose className='absolute top-0 right-0' />
                                        {speaker.first_name} {speaker.last_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 max-w-fit">
                            <div>
                                <label className="input w-fit overflow-hidden input-bordered bg-white outline-none text-black flex items-center gap-2">
                                    <span className="font-semibold text-green-700 flex justify-between items-center min-w-fit">
                                        Speakers List &nbsp; <TiArrowRight className="mt-1" />
                                    </span>
                                    <select
                                        id="speakers"
                                        className="grow h-full bg-white w-fit min-w-40 outline-none"
                                        onChange={(e) => {
                                            const id = parseInt(e.target.value, 10);
                                            if (id) handleAddSpeaker(id);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {availableSpeakers.map((speaker) => (
                                            <option key={speaker.id} value={speaker.id}>
                                                {speaker.first_name + ' ' + speaker.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className='flex flex-col gap-3'>
                        {/* Agenda Start Date */}
                        <label htmlFor="event_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda Start Date &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_date" type="date" className="grow bg-white" {...register('event_date', { required: 'Start date is required' })} />
                        </label>
                        {errors.event_date && <p className="text-red-600">{errors.event_date.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Start Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time &nbsp; <TiArrowRight className='mt-1' /> </span>
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
                            <span className=" font-semibold text-green-700 flex justify-between items-center">End Time &nbsp; <TiArrowRight className='mt-1' /> </span>
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

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Priority */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Priority &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="position" className="grow bg-white" {...register('position', { required: 'Priority is required' })}>
                                <option value="">Select</option>
                                {priority.map((index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                        </label>
                        {errors.position && <p className="text-red-600">{errors.position.message}</p>}
                    </div>
                </div>

                <div className="col-span-3 flex justify-center mt-4">
                    <button type="submit" className="px-4 py-2 rounded-md bg-klt_primary-900 text-white mx-auto w-fit mt-3">Edit Agenda</button>
                </div>
            </form>
        </div>
    );
};

export default EditAgenda;
