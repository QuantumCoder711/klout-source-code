import React from 'react';
import { MdDateRange, MdMyLocation  } from "react-icons/md";
import { Link } from 'react-router-dom';
import { eventUUID } from '../features/event/eventSlice';
import { heading } from '../features/heading/headingSlice';
import { useDispatch } from 'react-redux';

type eventCardProps = {
    title : string,
    date: string,
    venue: string,
    imageUrl: string,
    imageAlt: string,
    buttonTitle: string,
    eventuuid: string
}


const EventCard: React.FC<eventCardProps> = ({ title, date, venue, imageUrl, imageAlt, buttonTitle, eventuuid }) => {

    const dispatch = useDispatch();

    const handleClick = (eventuuid: string) => {
        dispatch(heading('View Event'));
        dispatch(eventUUID(eventuuid))
    }
    return (
        <div className="card bg-base-100 shadow-xl rounded-lg">
            <figure>
                <img
                src= { imageUrl }
                alt= { imageAlt }
                style={{height: '200px', width: '100%', objectFit: 'cover'}}
                />
            </figure>
            <div className="card-body p-3 text-black bg-white rounded-bl-lg rounded-br-lg">
                <h2 className="card-title">{ title }</h2>
                <p className="inline-flex gap-2 items-start"><MdMyLocation className="text-2xl" /> { venue }</p>
                <p className="font-semibold inline-flex gap-2 items-center"><MdDateRange className="text-2xl" /> { date }</p>
                <div className="card-actions justify-end">
                <Link to='/events/view-event/' onClick={() => handleClick(eventuuid)} className="underline text-blue-800 hover:text-blue-900">{ buttonTitle }</Link>
                </div>
            </div>
        </div>
    )
}

export default EventCard;