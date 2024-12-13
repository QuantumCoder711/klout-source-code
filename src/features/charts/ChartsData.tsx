import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import HeadingH2 from '../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { heading } from '../heading/headingSlice';
import DonutChart from './components/DonutChart';
import { allEventAttendee } from '../event/eventSlice';
import Loader from '../../component/Loader';
import BarChart from './components/BarChart';

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

const ChartsData: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { token } = useSelector((state: RootState) => state.auth);

    const { eventAttendee, loading, currentEventUUID } = useSelector((state: RootState) => ({
        eventAttendee: state.events.eventAttendee,
        loading: state.events.attendeeLoader,
        currentEventUUID: state.events.currentEventUUID,
        currentEvent: state.events,
    }));

    useEffect(() => {
        if (currentEventUUID) {
            dispatch(allEventAttendee({ eventuuid: currentEventUUID, token }));
        }
    }, []);

    const [checkedIn, setCheckedIn] = useState<number>(0);
    const [nonCheckedIn, setNonCheckedIn] = useState<number>(0);

    console.log(eventAttendee);

    useEffect(() => {
        // Calculate checkedIn and nonCheckedIn counts in one go
        const checkedInCount = eventAttendee.filter((attendee: attendeeType) => attendee.check_in === 1).length;
        const nonCheckedInCount = eventAttendee.length - checkedInCount;

        // Update state only once after calculation
        setCheckedIn(checkedInCount);
        setNonCheckedIn(nonCheckedInCount);

    }, [eventAttendee]);

    console.log("Total checked in users are: ", checkedIn);
    console.log("Total non-checked in users are: ", nonCheckedIn);


    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="flex justify-between items-center w-full mb-6">
                <HeadingH2 title='Charts Data' />
                <Link to="/all-charts" onClick={() => dispatch(heading("All Charts"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex justify-between gap-10 items-baseline'>
                <DonutChart checkedInUsers={checkedIn} nonCheckedInUsers={nonCheckedIn} />
                <BarChart />
            </div>
        </div>
    );
}

export default ChartsData;
