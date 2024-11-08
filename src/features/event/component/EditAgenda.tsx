import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiArrowRight } from "react-icons/ti";
import { Link } from 'react-router-dom';

type formInputType = {
    title: string,
    description: string,
    Agenda_start_date: string,
    Agenda_end_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    priority: string;
    image: File | null,
};

const EditAgenda: React.FC = () => {
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


    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const priority = Array.from({ length: 100 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    const amPm = ['AM', 'PM'];

    return (

        <div className='p-6 pt-3'>
            <div className='flex justify-between items-center'>
                <h2 className='text-black text-2xl font-semibold'>Edit Agenda</h2>
                <div className='flex items-center gap-3'>
                    <Link to="/events/view-agendas" className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4 mt-10">
                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required' })} />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" className="grow bg-white" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className='flex flex-col gap-3'>
                        {/* Agenda Start Date */}
                        <label htmlFor="Agenda_start_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda Start Date &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="Agenda_start_date" type="date" className="grow bg-white" {...register('Agenda_start_date', { required: 'Start date is required' })} />
                        </label>
                        {errors.Agenda_start_date && <p className="text-red-600">{errors.Agenda_start_date.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Agenda End Date */}
                        <label htmlFor="Agenda_end_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda End Date &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="Agenda_end_date" type="date" className="grow" {...register('Agenda_end_date', { required: 'End date is required' })} />
                        </label>
                        {errors.Agenda_end_date && <p className="text-red-600">{errors.Agenda_end_date.message}</p>}
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
                            <select id="priority" className="grow bg-white" {...register('priority', { required: 'Priority is required' })}>
                                <option value="">Select</option>
                                {priority.map((index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                        </label>
                        {errors.priority && <p className="text-red-600">{errors.priority.message}</p>}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    {/* Image Upload */}
                    <label htmlFor="image" className="input input-bordered bg-white text-black flex items-center gap-2">
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
                    {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                    {/* Display the uploaded image or dummy image */}
                    <div className="mt-3">
                        <img
                            src={selectedImage || dummyImage}
                            alt="Selected Banner"
                            className="w-32 h-32 object-cover"
                        />
                    </div>
                </div>

                <div className="col-span-3 flex justify-center mt-4">
                    <button type="submit" className="btn btn-primary">Edit Agenda</button>
                </div>
            </form>
        </div>

    );
};

export default EditAgenda;