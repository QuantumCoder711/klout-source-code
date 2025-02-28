import React from 'react';
import Phone from "/frame.png";
import Video from "/video.mp4";
import { Link } from 'react-router-dom';
import EventsBg from "/eventsBg.png";
import Navbar from './Navbar';

const Events: React.FC = () => {
  return (
    <main
      className={`!overflow-x-hidden relative bg-zinc-800 h-screen text-brand-text p-3 flex flex-col lg:p-5 bg-cover bg-center`}
      style={{ background: `url(${EventsBg})` }}
    >
      <Navbar />
      <div className='max-w-screen-lg w-full flex mt-10 sm:mt-0 flex-col-reverse sm:flex-row justify-between gap-5 items-center mx-auto sm:h-full'>
        <div className=''>
          <span className='text-base md:text-xl'>Welcome To</span>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Klout Club <br />
            <span className='curly'>Smarter</span> Event <br />
            <span className='curly'>Smoother</span> Experience!
          </h1>
          <p className='max-w-[500px] text-sm md:text-base'>Effortlessly create, manage, and elevate your events
            All in one place. From hassle-free check-ins to
            AI-powered insights, Make Your event management smarter!</p>

          <div className='mt-16 sm:mt-24'>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold capitalize'><span className='curly'>Ready</span> to host a smarter event<span className='curly'>?</span></h2>
            <Link to="/add-first-event" className='py-2 px-5 inline-block font-semibold mt-6 bg-white text-brand-primary rounded-full '>Create Your First Event</Link>
          </div>
        </div>

        {/* Video in Frame */}
        <div
          // style={{ background: `url(${Phone})` }}
          className='h-[500px] !overflow-hidden min-w-[246px] !bg-cover bg-center relative rounded-[42px] !bg-no-repeat'>
          <video className='absolute top-0 inset-1 left-0 w-full h-full z-10 object-cover py-7 mx-2 !pr-4' src={Video} autoPlay loop playsInline />
          <img src={Phone} alt="IPhone Frame" className='absolute z-10 w-full h-full' />
        </div>

      </div>
    </main>
  )
}

export default Events;