import React from 'react';
import { MdDateRange, MdMyLocation } from "react-icons/md";
import { Link } from 'react-router-dom';
import { eventUUID } from '../features/event/eventSlice';
import { heading } from '../features/heading/headingSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

type eventCardProps = {
    title: string,
    date: string,
    venue: string,
    imageUrl: string,
    imageAlt: string,
    eventuuid: string,
    eventId: number,
}


const EventCard: React.FC<eventCardProps> = ({ title, date, venue, imageUrl, imageAlt, eventuuid, eventId }) => {

    const dispatch = useDispatch();
    const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const { token } = useSelector((state: RootState) => (state.auth));
    // const id = useSelector((state: RootState) => state.events.currentEvent?.id);

    const handleClick = (eventuuid: string) => {
        console.log("Hello", eventuuid);
        // dispatch(heading('View Event'));
        dispatch(eventUUID(eventuuid));
    }

    const handleDelete = async (id: number) => {

        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showDenyButton: true,
            text: "You won't be able to revert this!",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                // Delete the event from the server
                await axios.delete(`${apiBaseUrl}/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Show success message
                const successResult = await Swal.fire({
                    title: "Deleted!",
                    text: "Your event has been deleted.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                // Reload the page when the "OK" button is clicked
                if (successResult.isConfirmed) {
                    window.location.reload();
                }

            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "There was an error deleting the event.",
                    icon: "error",
                });
            }
        }
        // https://api.klout.club/api/events/144
    }

    return (
        <div className="card bg-base-100 shadow-xl rounded-lg">
            <figure>
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                />
            </figure>
            <div className="card-body p-3 text-black bg-white rounded-bl-lg rounded-br-lg">
                <h2 className="card-title">{title}</h2>
                <p className="inline-flex gap-2 items-start"><MdMyLocation className="text-2xl" /> {venue}</p>
                <p className="font-semibold inline-flex gap-2 items-center"><MdDateRange className="text-2xl" /> {date}</p>
                <div className="flex gap-3 mt-2 text-xs flex-wrap">
                    <Link to='/events/view-event/' onClick={() => { handleClick(eventuuid); dispatch(heading("View Event")); }} className="underline text-pink-500 hover:text-pink-600">View Event</Link>
                    <Link to='/events/edit-event' onClick={() => { handleClick(eventuuid); dispatch(heading("Edit Event")); }} className="underline text-sky-500 hover:text-sky-600">Edit Event</Link>
                    <Link to='/events/all-attendee/' onClick={() => { handleClick(eventuuid); dispatch(heading("All Attendee")) }} className="underline text-blue-500 hover:text-blue-600">All Attendees</Link>
                    {/* <Link to='/events/view-sponsers/' onClick={() => handleClick(eventuuid)} className="underline text-green-500 hover:text-green-600">View Sponsers</Link> */}
                    <Link to='/events/view-agendas/' onClick={() => { handleClick(eventuuid); dispatch(heading("View Agendas")); }} className="underline text-yellow-500 hover:text-yellow-600">View Agendas</Link>
                    <button onClick={() => {
                        if (eventId !== undefined) {
                            handleDelete(eventId);
                        }
                    }} className="underline text-red-500 hover:text-red-600">Delete Event</button>
                </div>
                {/* <div className="card-actions justify-end">
                    <Link to='/events/view-event/' onClick={() => handleClick(eventuuid)} className="underline text-blue-800 hover:text-blue-900">{buttonTitle}</Link>
                </div> */}
            </div>
        </div>
    )
}

export default EventCard;