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

    const { eventAttendee, loading, currentEventUUID, currentEvent } = useSelector((state: RootState) => ({
        eventAttendee: state.events.eventAttendee,
        loading: state.events.attendeeLoader,
        currentEventUUID: state.events.currentEventUUID,
        currentEvent: state.events.currentEvent,
    }));

    useEffect(() => {
        if (currentEventUUID) {
            dispatch(allEventAttendee({ eventuuid: currentEventUUID, token }));
        }
    }, []);

    const [checkedIn, setCheckedIn] = useState<number>(0);
    const [nonCheckedIn, setNonCheckedIn] = useState<number>(0);
    const [dateDifference, setDateDifference] = useState<number>(0);

    // const [startTime, setStartTime] = useState<string>();
    // const [startTimeType, setStartTimeType] = useState<"AM" | "PM">();
    // const [endTime, setEndTime] = useState<string>();
    // const [endTimeType, setEndTimeType] = useState<"AM" | "PM">();
    // const [hours, setHours] = useState<string[]>();


    // Helper function to calculate the difference in days
    const calculateDateDifference = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    };

    // function parseTime(timeString: string): Date {
    //     const [time, period] = timeString.split(' ');
    //     const [hoursStr, minutesStr] = time.split(':');
    //     let hours: number = parseInt(hoursStr, 10);
    //     let minutes: number = minutesStr ? parseInt(minutesStr, 10) : 0;

    //     if (period === "PM" && hours !== 12) {
    //         hours += 12;
    //     } else if (period === "AM" && hours === 12) {
    //         hours = 0;
    //     }

    //     return new Date(2024, 0, 1, hours, minutes);
    // }


    function generateHours(startTime:string, endTime:string) {
        function parseTime(timeStr:string) {
          const [time, period] = timeStr.split(" "); 
          let [hours, minutes] = time.split(":").map(Number); 
          return { hours, minutes, period };
        }
      
        const start = parseTime(startTime);
        const end = parseTime(endTime);
      
        const to24Hour = (hours:number, period:string) =>
          period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours;
      
        let startHour = to24Hour(start.hours, start.period);
        const endHour = to24Hour(end.hours, end.period) + (end.minutes > 0 ? 1 : 0); // Round up for endTime
      
        const timeArray = [];
        while (startHour <= endHour) { // Modified condition here
          let displayHour = startHour % 12 === 0 ? 12 : startHour % 12; // Convert back to 12-hour format
          let displayPeriod = startHour < 12 || startHour === 24 ? "AM" : "PM";
          timeArray.push(`${displayHour} ${displayPeriod}`);
          startHour++;
        }
      
        return timeArray;
      }


    let start_time: string = currentEvent?.start_time + ":" + currentEvent?.start_minute_time + " " + currentEvent?.start_time_type;
    let end_time: string = currentEvent?.end_time + ":" + currentEvent?.end_minute_time + " " + currentEvent?.end_time_type;
    console.log(start_time);
    console.log(end_time);
    // console.log(parseTime(start_time));
    // console.log(parseTime(end_time));
    // console.log(start_time);
    // console.log(end_time);

    // console.log("Current event is: ", currentEvent);

    // let hoursArray: string[] = generateHours(start_time, end_time);
    let hoursArray: string[] = generateHours(start_time, end_time);

    console.log(hoursArray);


    useEffect(() => {
        // Calculate checkedIn and nonCheckedIn counts in one go
        const checkedInCount = eventAttendee.filter((attendee: attendeeType) => attendee.check_in === 1).length;
        const nonCheckedInCount = eventAttendee.length - checkedInCount;

        // Update state only once after calculation
        setCheckedIn(checkedInCount);
        setNonCheckedIn(nonCheckedInCount);

        // Log current event start and end dates
        // console.log("Current Event time is: ", currentEvent?.start_time, currentEvent?.start_time_type, currentEvent?.end_time, currentEvent?.end_time_type);

    }, [eventAttendee, currentEvent, dateDifference]);

    useEffect(() => {

        if (currentEvent) {
            const difference: number = calculateDateDifference(currentEvent?.event_start_date, currentEvent?.event_end_date);
            setDateDifference(difference);
        }

        // console.log("The Date Difference is: ", dateDifference);
    }, [currentEvent, dateDifference]);



    // console.log("Total checked in users are: ", checkedIn);
    // console.log("Total non-checked in users are: ", nonCheckedIn);


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
                <div className='w-1/3'>
                    <DonutChart checkedInUsers={checkedIn} nonCheckedInUsers={nonCheckedIn} />
                </div>

                <div className='w-1/3'>
                    <BarChart hours={hoursArray} />
                </div>
            </div>
        </div>
    );
}

export default ChartsData;
