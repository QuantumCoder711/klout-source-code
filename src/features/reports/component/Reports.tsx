import React from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import ReportCard from './ReportCard';
// import {messageData} from "../temp/dummyData";
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Loader from '../../../component/Loader';

const Reports: React.FC = () => {


  const { events, loading } = useSelector((state: RootState) => state.events);
  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

  if(loading) {
    return <Loader />
  }

  return (
    <div>

      {/* Heading  */}
      <div className="mb-6 flex justify-between items-center">
        <HeadingH2 title='All Reports' />
      </div>

      {/* For displaying all reports */}
      <div className='grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
        {
          events.map((event) => (
            <ReportCard
              key={event.uuid}
              uuid={event.uuid}
              title={event.title}
              venue={event.event_venue_name}
              date={event.event_date}
              image={`${imageBaseUrl}/${event.image}`} />
          ))
        }
      </div>

    </div>
  )
}

export default Reports;