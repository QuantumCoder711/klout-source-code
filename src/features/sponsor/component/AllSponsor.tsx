import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { heading } from '../../../features/heading/headingSlice';
import { eventUUID } from '../../../features/event/eventSlice';
import Loader from '../../../component/Loader';
import { MdDateRange, MdMyLocation } from "react-icons/md";

interface Event {
    id: number;
    uuid: string;
    user_id: number;
    title: string;
    image: string;
    description: string;
    event_start_date: string;
    event_venue_name: string;
    start_time: string;
    start_minute_time: string;
    start_time_type: string;
    end_time: string;
    end_minute_time: string;
    end_time_type: string;
}

export default function AllSponsor() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    const { events, loading, error } = useSelector((state: RootState) => state.events);

    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter past and upcoming events
    const pastEvents = events.filter((event) => {
        const eventDate = new Date(event.event_start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
    });

    const upcomingEvents = events.filter((event) => {
        const eventDate = new Date(event.event_start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
    });

    const handleTabChange = (tab: 'upcoming' | 'past') => {
        setActiveTab(tab);
    };

    const handleAddSponsor = (uuid: string) => {
        dispatch(eventUUID(uuid));
        dispatch(heading('Add Sponsor'));
        navigate(`/events/add-sponsor/${uuid}`);
    };

    const isEventLive = (event: Event) => {
        const eventStartTime = `${event.start_time}:${event.start_minute_time} ${event.start_time_type}`;
        const eventEndTime = `${event.end_time}:${event.end_minute_time} ${event.end_time_type}`;
        
        const parseEventTime = (time: string, date: string) => {
            const [timeStr, period] = time.split(' ');
            const [hours, minutes] = timeStr.split(':').map(Number);
            let adjustedHours = hours;
    
            if (period === 'PM' && hours !== 12) adjustedHours += 12;
            if (period === 'AM' && hours === 12) adjustedHours = 0;
    
            return new Date(`${date}T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
        };

        const startDate = parseEventTime(eventStartTime, event.event_start_date);
        const endDate = parseEventTime(eventEndTime, event.event_start_date);
        const currentDate = new Date();

        return currentDate >= startDate && currentDate <= endDate;
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="px-6">
            {/* Heading */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    {/* Tab Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleTabChange('upcoming')}
                            className={`px-3 py-2 text-sm rounded ${activeTab === 'upcoming' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => handleTabChange('past')}
                            className={`px-3 py-2 text-sm rounded ${activeTab === 'past' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            Past Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mb-8">
                {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).length > 0 ? (
                    (activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
                        <div key={event.uuid} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9">
                                <img 
                                    src={`${imageBaseUrl}/${event.image}`}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            <div className="p-4">
                                {isEventLive(event) && (
                                    <span className='text-xs font-bold absolute right-2 top-2 px-2 py-1 rounded border text-red-600 border-red-600 flex items-center gap-1 bg-white'>
                                        Live <span className='w-2 h-2 rounded-full bg-red-600 animate-pulse' />
                                    </span>
                                )}
                                <h3 className="text-lg font-semibold mb-3 truncate">
                                    {event.title}
                                </h3>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <MdMyLocation className="text-lg mr-2" />
                                        <span className="text-sm truncate">{event.event_venue_name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MdDateRange className="text-lg mr-2" />
                                        <span className="text-sm">{new Date(event.event_start_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddSponsor(event.uuid)}
                                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Add Sponsor
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h3 className="text-2xl text-red-500 font-semibold pt-2 pb-3 px-4 bg-slate-300 rounded-md col-span-full">
                        No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events
                    </h3>
                )}
            </div>
        </div>
    );
}
