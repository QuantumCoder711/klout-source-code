// Dashboard.tsx
import React from 'react';
import ScoreCard from '../../../component/ScoreCard';
import HeadingH2 from '../../../component/HeadingH2';
import EventCard from '../../../component/EventCard';
import Button from '../../../component/Button';
import { useSelector } from 'react-redux';
// import { fetchEvents } from '../../event/eventSlice';
// import { fetchAllAttendees } from '../../attendee/attendeeSlice';
import { RootState } from '../../../redux/store';


const Dashboard: React.FC = () => {

  // const dispatch = useAppDispatch();

  const { totalEvents, loading, error } = useSelector((state: RootState) => state.events);
  // const { token } = useSelector((state: RootState) => state.auth);
  const { allAttendees } = useSelector((state: RootState) => state.attendee);


  // useEffect(() => {
  //   dispatch(fetchEvents(token));
  //   dispatch(fetchAllAttendees(token));
  // }, [dispatch]);

  if(loading) return <p>loading...</p>;
  if(error) return <p>Errror:  {error}</p>



  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <ScoreCard
          title="Total Events"
          content={totalEvents}
          cardColor='#347928'
        />
        <ScoreCard
          title="Total Attendees"
          content={allAttendees.length}
          cardColor='#6439FF'
        />
        <ScoreCard
          title="Total Sponsors"
          content={6}
          cardColor='#ED3EF7'
        />
        <ScoreCard
          title="Upcoming Events"
          content={7}
          cardColor='#FF9100'
        />
      </div>

      {/* UPCOMING EVENTS */}

      <div className="mt-4 mb-6 flex justify-between items-center">
          <HeadingH2
            title='Upcoming Events'
          />
          <Button 
            buttonTitle='View All' 
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes one'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='1'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes two'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='2'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes three'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='3'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes four'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='4'
        />
      </div>

      {/* ALL EVENTS */}

      <div className="mt-10 mb-6 flex justify-between items-center">
          <HeadingH2
            title='All Events'
          />
          <Button 
            buttonTitle='View All' 
          />
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes one'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='5'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes two'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='6'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes three'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='7'
        />
        <EventCard
          title='CFO Ignite 2024'
          imageUrl='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'
          imageAlt='Shoes four'
          date='2024-10-31'
          venue='Holiday Inn, Asset Area 12 Hospitality District,'
          buttonTitle='View Detail'
          eventuuid='8'
        />
      </div>


    </>
  );
};

export default Dashboard;
