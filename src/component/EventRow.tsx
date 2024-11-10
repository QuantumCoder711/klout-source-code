import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventUUID } from '../features/event/eventSlice';
import { useDispatch } from 'react-redux';
import { heading } from '../features/heading/headingSlice';

interface EventRowProps {
    title?: string,
    image?: string,
    event_start_date?: string,
    uuid: string,
    event_venue_name?: string,
    total_checkedin?: number,
    total_attendee?: number,
    total_checkedin_speaker?: number,
    total_checkedin_sponsor?: number,
    total_pending_delegate?: number,
    start_time?: string,
    start_minute_time?: string,
    start_time_type?: string,
    id?: number
}

const EventRow: React.FC<EventRowProps> = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className='p-5 border-b flex items-center justify-between gap-5 rounded-lg'>
            {/* Displaying Image */}
            <img src={props.image} alt={props.title} className='w-96 h-60 object-cover object-center rounded-lg' />

            {/* Title */}
            <h3 className='text-lg font-semibold'>{props.title}</h3>

            {/* Date, Time and Venue */}
            <div className='flex flex-col gap-2'>
                <div>
                    <span className="font-semibold text-black">Date</span> - {props.event_start_date}
                </div>
                <div>
                    <span className="font-semibold text-black">Time</span> - {props.start_time + ':' + props.start_minute_time + ' ' + props.start_time_type}
                </div>
                <div>
                    <span className="font-semibold text-black">Venue</span> - {props.event_venue_name}
                </div>
            </div>

            {/* Event Joiners Info */}
            <div className='h-full flex flex-col gap-y-2 min-w-48'>
                <div className='flex items-center gap-2 font-semibold'>Total Registrations: <p className='font-medium'>{props.total_attendee}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Total Attendees: <p className='font-medium'>{props.total_checkedin}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Speakers: <p className='font-medium'>{props.total_checkedin_speaker}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Sponsors: <p className='font-medium'>{props.total_checkedin_sponsor}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Pending Delegates: <p className='font-medium'>{props.total_pending_delegate}</p></div>
            </div>

            {/* Links */}
            <div className='min-w-[110px]'>

                <Link to='/events/view-event/' className="text-pink-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('Events')); dispatch(heading('Edit Event')); setTimeout(() => {
                    }, 500);
                }}>View Event</Link> <br />
                <button className="text-sky-500 hover:underline px-3 py-1 inline-block mb-1 rounded-md text-xs font-semibold" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('Edit Event')); setTimeout(() => {
                        navigate('/events/edit-event')
                    }, 500);
                }} >Edit Event</button> <br />
                <Link to='/events/all-attendee' className="text-blue-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('All Attendee')); setTimeout(() => {
                    }, 500);
                }}>All Attendees</Link> <br />
                <button className="text-green-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1">View Sponsors</button> <br />
                <Link to={"/events/view-agendas"} className="text-yellow-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1" onClick={() => {
                    dispatch(heading('View Agendas')); setTimeout(() => {
                    }, 500);
                }} >View Agendas</Link> <br />
                <button className="text-red-500 hover:underline px-3 py-1 rounded-md text-xs font-semibold inline-block mb-1"
                // onClick={(e) => deleteEvent(e, props.id)}
                >Delete Event</button>
            </div>
        </div >
    )
}

export default EventRow;