import React from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import ReportCard from './ReportCard';
// import {messageData} from "../temp/dummyData";

const Reports: React.FC = () => {

  const ids:number[] = [1, 2, 3];

  return (
    <div>

      {/* Heading  */}
      <div className="mb-6 flex justify-between items-center">
        <HeadingH2 title='All Reports' />
      </div>

      {/* For displaying all reports */}
      <div className='flex flex-wrap w-full gap-5'>
        {
          ids.map((id) => (
            <ReportCard
              key={id}
              id={id}
              image='https://img.freepik.com/free-photo/cascade-boat-clean-china-natural-rural_1417-1356.jpg?t=st=1730783905~exp=1730787505~hmac=df20ed75bff729cbd492dc80aced253f1e07251399d3d721a9132c98d8d94789&w=1380' />
          ))
        }
        {/* <ReportCard />
        <ReportCard /> */}
      </div>

    </div>
  )
}

export default Reports;