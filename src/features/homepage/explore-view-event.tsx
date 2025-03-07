import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { IoMdArrowForward } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import Invite from "./invite.svg";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { convertDateFormat } from './utils';
import axios from 'axios';
import GoogleMapComponent from './GoogleMapComponent';
import Loader from '../../component/Loader';

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

// Define the AgendaType interface
type AgendaType = {
    id: number;
    uuid: string;
    event_id: number;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    start_time_type: string;
    end_time: string;
    end_time_type: string;
    image_path: string;
    created_at: string;
    updated_at: string;
    start_minute_time: string;
    end_minute_time: string;
    position: number;
    speakers: attendeeType[];
};

const ExploreViewEvent: React.FC = () => {

    const { uuid } = useParams<{ uuid: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const user = useSelector((state: RootState) => state.auth.user);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const startTime = currentEvent?.event_date || "";
    const [agendaData, setAgendaData] = useState<AgendaType[]>([]);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: -3.745,  // Default latitude (you can change it to a default location)
        lng: -38.523, // Default longitude
    });

    useEffect(() => {
        if (uuid) {
            try {
                setIsLoading(true);
                axios.post(`${apiBaseUrl}/api/displayEvent/${uuid}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((res: any) => {
                        setCurrentEvent(res.data.data);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [uuid]);

    useEffect(() => {
        if (currentEvent) {
            try {
                setIsLoading(true);
                axios.get(`${apiBaseUrl}/api/all-agendas/${currentEvent.id}`)
                    .then((res) => {
                        if (res.data) {
                            // Sort the data in descending order to show the highest position at the top
                            const sortedData = res.data.data.sort((a: AgendaType, b: AgendaType) => a.position - b.position);

                            setAgendaData(sortedData);

                            // Extract coordinates from Google Maps link
                            const extractCoordinates = (url: string) => {
                                const regex = /https:\/\/maps\.app\.goo\.gl\/([a-zA-Z0-9]+)/;
                                const match = url.match(regex);
                                if (match) {
                                    const encodedUrl = decodeURIComponent(match[1]);
                                    const coordsRegex = /@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;
                                    const coordsMatch = encodedUrl.match(coordsRegex);
                                    if (coordsMatch) {
                                        const lat = parseFloat(coordsMatch[1]);
                                        const lng = parseFloat(coordsMatch[2]);
                                        console.log(lat, lng);
                                        return { lat, lng };
                                    }
                                }
                                return;
                            };

                            if (currentEvent) {
                                const coords = extractCoordinates(currentEvent?.google_map_link);
                                if (coords) {
                                    setCenter(coords);
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching agendas:", error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                console.error("Error in agenda fetch block:", error);
                setIsLoading(false);
            }
        }
    }, [currentEvent]);

    const allSpeakers = agendaData.flatMap((agenda) =>
        agenda.speakers.map((speaker) => ({
            first_name: speaker.first_name,
            last_name: speaker.last_name,
            company_name: speaker.company_name,
            job_title: speaker.job_title,
            image: speaker.image
        }))
    );

    useEffect(() => {
        // Extract coordinates from Google Maps link
        const extractCoordinates = (url: string) => {
            const regex = /https:\/\/maps\.app\.goo\.gl\/([a-zA-Z0-9]+)/;
            const match = url.match(regex);
            if (match) {
                const encodedUrl = decodeURIComponent(match[1]);
                const coordsRegex = /@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;
                const coordsMatch = encodedUrl.match(coordsRegex);
                if (coordsMatch) {
                    const lat = parseFloat(coordsMatch[1]);
                    const lng = parseFloat(coordsMatch[2]);
                    console.log(lat, lng);
                    return { lat, lng };
                }
            }
            return null;
        };

        if (currentEvent) {
            const coords = extractCoordinates(currentEvent?.google_map_link);
            if (coords) {
                setCenter(coords);
            }
        }
    }, [currentEvent]);

    console.log(agendaData);

    if (isLoading) {
        return <div className='w-full h-screen flex justify-center items-center'>
            <Loader />
        </div>
    }

    return (
        <div className='w-full h-full overflow-auto top-0 absolute left-0 bg-brand-foreground text-black'>
            <div className='!text-black w-full z-30 fixed top-0 left-0'>
                <Navbar />
            </div>

            <div className='max-w-screen-lg flex gap-7 mx-auto mt-20 space-y-4'>
                {/* Left Div */}
                <div className='space-y-4'>
                    <span className='text-gray-700 text-sm'>By {user?.company_name}</span>

                    <h1 className='text-2xl font-semibold !mt-0'>{currentEvent?.title}</h1>

                    {/* Row for Start Date */}
                    <div className='flex gap-2'>
                        <div className='rounded-md grid place-content-center size-10 bg-white'>
                            <p className='uppercase text-orange-500 font-semibold text-xs'>WED</p>
                            <p className='text-2xl leading-none font-semibold text-brand-gray'>30</p>
                        </div>
                        <div>
                            <h4 className='font-semibold'>{convertDateFormat(startTime)}</h4>
                            <p className='text-sm text-brand-gray'>{currentEvent?.start_time}:{currentEvent?.start_minute_time}  {currentEvent?.start_time_type} - {currentEvent?.end_time}:{currentEvent?.end_minute_time} {currentEvent?.end_time_type}</p>
                        </div>
                    </div>

                    {/* Row for Location */}
                    <div className='flex gap-2'>
                        <a href={currentEvent?.google_map_link} className='flex gap-2'>
                            <div className='rounded-md grid place-content-center size-10 bg-white'>
                                <IoLocationSharp size={30} className='text-brand-gray' />
                            </div>

                            <div>
                                <h4 className='font-semibold flex items-center'>{currentEvent?.event_venue_name} <IoMdArrowForward size={20} className='-rotate-45' /></h4>
                                <p className='text-sm text-brand-gray'>{currentEvent?.city}, {currentEvent?.pincode}</p>
                            </div>
                        </a>
                    </div>

                    {/* Row for Registration */}
                    <div className='border border-white rounded-[10px]'>
                        <p className='text-sm p-[10px]'>Registration</p>

                        <div className='bg-white'>

                            <div className='flex gap-2 p-[10px] border-b'>
                                <div className='rounded-md grid place-content-center size-10 bg-white'>
                                    {/* < size={30} className='text-brand-gray' /> */}
                                    <img src={Invite} alt="Invite" />
                                </div>

                                <div className=''>
                                    <h4 className='!font-semibold flex items-center'>Pending Approval</h4>
                                    <p className='text-sm -mt-1'>Your registration requires approval from the host.</p>
                                </div>
                            </div>

                            <div className='p-[10px]'>
                                <p className='text-sm'>Welcome! Register below to request event access.</p>
                                <button className='w-full mt-[10px] p-3 bg-brand-primary rounded-lg text-white'>Get an Invite</button>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Event Details</h3>
                        <hr className='border-t-2 border-white my-[10px]' />

                        <p className='text-brand-gray'>{currentEvent?.description}</p>
                    </div>

                    {/* Agenda Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Agenda Details</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* Single Day Agenda Details */}
                        <div>
                            {/* <div className='p-2 bg-white rounded-lg font-semibold'>
                                Day 1 (Friday, 17th Jan 2025)
                            </div> */}

                            {/* All Rows Wrapper */}
                            <div>
                                {/* Single Row */}
                                {agendaData.map((agenda) => (
                                    <div key={agenda.id} className='!my-4'>
                                        <h5 className='font-semibold'>{agenda?.start_time}:{agenda?.start_minute_time}  {agenda?.start_time_type} - {agenda?.end_time}:{agenda?.end_minute_time} {agenda?.end_time_type}</h5>
                                        <p className='font-light'>{agenda.description}</p>

                                        {/* All Images */}
                                        <div className='flex gap-5 my-3'>
                                            <div className='grid grid-cols-2 gap-5'>
                                                {agenda.speakers.map((speaker) => (
                                                    <div key={speaker.id} className='flex gap-3 max-w-80 text-ellipsis overflow-hidden text-nowrap'>
                                                        <img src={`${apiBaseUrl}/${speaker.image}`} alt="user" className='size-14 rounded-full' />
                                                        <div className='space-y-1'>
                                                            <p className='font-semibold text-lg leading-none'>{speaker.first_name} {speaker.last_name}</p>
                                                            <p className='text-sm leading-none'>{speaker.company_name}</p>
                                                            <p className='text-xs leading-none'>{speaker.job_title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Speakers */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Agenda Speakers</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* All Speakers */}
                        <div className='grid grid-cols-4 gap-5 justify-between'>

                            {/* Single Speaker Deatils */}
                            {allSpeakers.map((speaker, index) => (
                                <div key={index} className='max-w-60 max-h-96 overflow-hidden text-ellipsis text-center'>
                                    <img src={apiBaseUrl + "/" + speaker.image} alt="Speaker" className='rounded-full mx-auto size-24' />
                                    <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.first_name + ' ' + speaker.last_name}</p>
                                    <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.job_title}</p>
                                    <p className='text-sm font-light overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.company_name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Div */}
                <div className='max-w-[300px]'>
                    <img src={apiBaseUrl + "/" + currentEvent?.image} alt="Background Image" className='rounded-lg w-full' />

                    <div className='mt-[5.8rem]'>
                        <h3 className='font-semibold text-lg'>Location</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />
                        <p className='text-brand-gray'><strong className='text-black'>{currentEvent?.event_venue_name}</strong> <br />
                            {currentEvent?.event_venue_address_2}</p>
                        <div className='rounded-lg mt-[10px] w-[300px] h-[300px]'>
                            <GoogleMapComponent center={center} zoom={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExploreViewEvent;
