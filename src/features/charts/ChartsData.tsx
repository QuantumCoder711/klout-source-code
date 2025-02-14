import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import HeadingH2 from '../../component/HeadingH2';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { heading } from '../heading/headingSlice';
import DonutChart from './components/DonutChart';
import { allEventAttendee } from '../event/eventSlice';
import Loader from '../../component/Loader';
import BarChart from './components/BarChart';
import CustomBarChart from './components/CustomBarChart';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

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
    industry: string;
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
    const { uuid } = useParams<{ uuid: string }>();
    const chartsWrapperRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const { token } = useSelector((state: RootState) => state.auth);

    const { eventAttendee, loading, events } = useSelector((state: RootState) => ({
        eventAttendee: state.events.eventAttendee,
        loading: state.events.attendeeLoader,
        events: state.events.events
    }));

    const currentEvent = events.find((event) => event.uuid === uuid);

    // console.log(eventAttendee);

    useEffect(() => {
        if (uuid) {
            dispatch(allEventAttendee({ eventuuid: uuid, token }));
        }
    }, [uuid, token]);

    const [checkedIn, setCheckedIn] = useState<number>(0);
    const [, setCheckedInAttendees] = useState<attendeeType[]>([]);
    const [uniqueAttendees, setUniqueAttendees] = useState<string[]>([]);
    const [uniqueDesignations, setUniqueDesignations] = useState<string[]>([]);
    const [uniqueIndustry, setUniqueIndustry] = useState<string[]>([]);
    const [companyCounts, setCompanyCounts] = useState<number[]>([]);
    const [designationCounts, setDesignationCounts] = useState<number[]>([]);
    const [industryCounts, setIndustryCounts] = useState<number[]>([]);
    const [nonCheckedIn, setNonCheckedIn] = useState<number>(0);
    const [dateDifference, setDateDifference] = useState<number>(0);

    // Helper function to calculate the difference in days
    const calculateDateDifference = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    };

    function generateHours(startTime: string, endTime: string) {
        function parseTime(timeStr: string) {
            const [time, period] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            return { hours, minutes, period };
        }

        const start = parseTime(startTime);
        const end = parseTime(endTime);

        const to24Hour = (hours: number, period: string) =>
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

    // let hoursArray: string[] = generateHours(start_time, end_time);
    let hoursArray: string[] = generateHours(start_time, end_time);
    const checkInTimes = eventAttendee.map((attendee: attendeeType) => {
        return attendee.check_in_time;
    });

    const extractHour = (timeStr: string): number => {
        const date = new Date(timeStr); // Parse the datetime string
        return date.getHours();
    };

    // Function to convert '1 AM', '2 AM', etc., into an integer hour (24-hour format)
    const convertTimePeriodToHour = (period: string): number => {
        const [hourStr, periodOfDay] = period.split(' ');
        let hour = parseInt(hourStr);

        // Convert AM/PM to 24-hour format
        if (periodOfDay === 'PM' && hour !== 12) {
            hour += 12; // Convert PM hours (except for 12 PM)
        }
        if (periodOfDay === 'AM' && hour === 12) {
            hour = 0; // Convert 12 AM to 0 hour (midnight)
        }

        return hour;
    };

    // Function to count the number of check-ins in each time period
    const countCheckInsByPeriod = (checkInTimes: string[], timePeriods: string[]): { period: string, count: number }[] => {
        // Initialize counts object
        const checkInCounts: { [key: string]: number } = timePeriods.reduce((counts: { [key: string]: number }, period) => {
            counts[period] = 0;
            return counts;
        }, {});

        // Iterate through check-in times and update counts
        checkInTimes.forEach(checkIn => {
            const checkInHour = extractHour(checkIn);

            // Find the corresponding time period
            timePeriods.forEach(period => {
                const periodHour = convertTimePeriodToHour(period);
                if (checkInHour === periodHour) {
                    checkInCounts[period]++;
                }
            });
        });

        // Create and return sorted count results
        const sortedCounts = timePeriods.map(period => ({
            period,
            count: checkInCounts[period],
        }));

        return sortedCounts;
    };

    const sortedCheckInCounts = countCheckInsByPeriod(checkInTimes, hoursArray);
    const allCounts = sortedCheckInCounts.map((sorted) => {
        return sorted.count;
    })

    useEffect(() => {
        // Calculate checkedIn and nonCheckedIn counts in one go
        const checkedInCount = eventAttendee.filter((attendee: attendeeType) => attendee.check_in === 1).length;
        const attendees = eventAttendee.filter((attendee: attendeeType) => attendee.check_in === 1);
        const checkIn = eventAttendee.filter((attendee: attendeeType) => attendee.check_in === 1);

        // Calculate unique company names
        const uniquesCompanies = [...new Set(checkIn.map((user: attendeeType) => user.company_name))];

        const companyCountsTemp: number[] = [];
        uniquesCompanies.forEach((company: string) => {
            let counter = 0;
            checkIn.forEach((user: attendeeType) => {
                if (user.company_name === company) {
                    counter++;
                }
            });
            companyCountsTemp.push(counter);
        });

        // Calculate unique designations
        const uniquesDesignations = [...new Set(checkIn.map((user: attendeeType) => user.job_title))];

        const designationCountsTemp: number[] = [];
        uniquesDesignations.forEach((designation: string) => {
            let counter = 0;
            checkIn.forEach((user: attendeeType) => {
                if (user.job_title === designation) {
                    counter++;
                }
            });
            designationCountsTemp.push(counter);
        });

        // Calculate unique industries
        const uniqueIndustry = [...new Set(checkIn.map((user: attendeeType) => {
            const industry = user.industry.toLowerCase() === "others" || user.industry === "" ? "Others" : user.industry;
            return industry;
        }))];

        const uniqueIndustryTemp: number[] = [];
        uniqueIndustry.forEach((industry: string) => {
            let counter = 0;
            checkIn.forEach((user: attendeeType) => {
                // Normalize the industry here as well
                if ((user.industry.toLowerCase() === "others" || user.industry === "") && industry === "Others") {
                    counter++;
                } else if (user.industry === industry) {
                    counter++;
                }
            });
            uniqueIndustryTemp.push(counter);
        });


        // Update state only once after calculations
        setCompanyCounts(companyCountsTemp);
        setUniqueAttendees(uniquesCompanies); // Assuming you want to display unique companies

        setUniqueDesignations(uniquesDesignations);
        setDesignationCounts(designationCountsTemp); // Assuming you have a state for designations

        setUniqueIndustry(uniqueIndustry);
        setIndustryCounts(uniqueIndustryTemp);


        const nonCheckedInCount = eventAttendee.length - checkedInCount;

        // Update other states
        setCheckedIn(checkedInCount);
        setCheckedInAttendees(attendees);
        setNonCheckedIn(nonCheckedInCount);

    }, [eventAttendee, currentEvent, dateDifference]);


    useEffect(() => {

        if (currentEvent) {
            const difference: number = calculateDateDifference(currentEvent?.event_start_date, currentEvent?.event_end_date);
            setDateDifference(difference);
        }

    }, [currentEvent, dateDifference]);

    const handleExport = () => {
        if (chartsWrapperRef.current) {
            const element = chartsWrapperRef.current;

            // Use a scale factor to capture high-quality images without too large a file
            html2canvas(element, { scale: 1 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');

                // Create a new jsPDF instance
                const pdf = new jsPDF('p', 'mm', 'a4');

                // A4 page size dimensions
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale the height based on aspect ratio

                // Define page height for A4
                const pageHeight = 295; // A4 page height in mm
                let yPosition = 0;

                // Add the first image to the PDF
                pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);

                // Check if the image height exceeds the page height
                if (imgHeight > pageHeight) {
                    let remainingHeight = imgHeight - pageHeight;
                    let offset = pageHeight;

                    // If the image is larger than the page, split it into multiple pages
                    while (remainingHeight > 0) {
                        // Add the next portion of the image
                        pdf.addPage(); // New page for the next part
                        pdf.addImage(imgData, 'PNG', 0, -offset, imgWidth, imgHeight);
                        offset += pageHeight;
                        remainingHeight -= pageHeight;
                    }
                }

                // Save the final PDF after all content has been added
                pdf.save('charts.pdf');
            });
        }
    };


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

            <div className='flex justify-end'>
                <button className='btn btn-sm btn-primary rounded-b-none' onClick={handleExport}>
                    Export Charts
                </button>
            </div>

            <div className='charts-wrapper' ref={chartsWrapperRef}>
                {/* Total Attendees */}
                <div className='bg-white p-10 rounded shadow-sm'>
                    <h2 className='text-xl font-bold'>Total Attendees</h2>
                    <div className='flex justify-between gap-40 items-baseline'>
                        <div className='w-1/3'>
                            <DonutChart checkedInUsers={checkedIn} nonCheckedInUsers={nonCheckedIn} />
                        </div>

                        <div className='w-2/3'>
                            <BarChart hours={hoursArray} checkedInUsers={checkedIn} allCounts={allCounts} />
                        </div>
                    </div>
                </div>

                {/* CheckedIn Attendees of Companies */}
                <div className='bg-white p-10 rounded shadow-sm'>
                    <h2 className='text-xl font-bold'>Total Attendees by Companies</h2>
                    <div className='flex justify-between gap-40 items-baseline'>
                        <div className='w-full mt-5'>
                            <CustomBarChart labels={uniqueAttendees} color='blue' allCounts={companyCounts} />
                        </div>
                    </div>
                </div>

                {/* CheckedIn Attendees of Designations */}
                <div className='bg-white p-10 rounded shadow-sm'>
                    <h2 className='text-xl font-bold'>Total Attendees by Designations</h2>
                    <div className='flex justify-between gap-40 items-baseline'>
                        <div className='w-full mt-5'>
                            <CustomBarChart labels={uniqueDesignations} color='orange' allCounts={designationCounts} />
                        </div>
                    </div>
                </div>

                {/* CheckedIn Attendees of Industries */}
                <div className='bg-white p-10 rounded shadow-sm'>
                    <h2 className='text-xl font-bold'>Total Attendees by Industry</h2>
                    <div className='flex justify-between gap-40 items-baseline'>
                        <div className='w-full mt-5'>
                            <CustomBarChart labels={uniqueIndustry} color='green' allCounts={industryCounts} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChartsData;
