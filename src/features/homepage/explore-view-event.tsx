import React from 'react';
import Navbar from './Navbar';
import { BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import Speaker from "./speaker.png"
import Invite from "./invite.svg";

const ExploreViewEvent: React.FC = () => {
    return (
        <div className='w-full h-full overflow-auto top-0 absolute left-0 bg-brand-foreground text-black'>
            <div className='!text-black w-full z-30 fixed top-0 left-0'>
                <Navbar />
            </div>

            <div className='max-w-screen-lg flex gap-7 mx-auto mt-20 space-y-4'>
                {/* Left Div */}
                <div className='space-y-4'>
                    <span className='text-gray-700 text-sm'>By Insightner</span>

                    <h1 className='text-2xl font-semibold !mt-0'>Telecom Powerhouse Summit 2025</h1>

                    {/* Row for Start Date */}
                    <div className='flex gap-2'>
                        <div className='rounded-md grid place-content-center size-10 bg-white'>
                            <p className='uppercase text-orange-500 font-semibold text-xs'>WED</p>
                            <p className='text-2xl leading-none font-semibold text-brand-gray'>30</p>
                        </div>
                        <div>
                            <h4 className='font-semibold'>Wednesday, 30 Feb, 2025</h4>
                            <p className='text-sm text-brand-gray'>08:00 AM - 05:00 PM</p>
                        </div>
                    </div>

                    {/* Row for Location */}
                    <div className='flex gap-2'>
                        <div className='rounded-md grid place-content-center size-10 bg-white'>
                            <IoLocationSharp size={30} className='text-brand-gray' />
                        </div>

                        <div>
                            <h4 className='font-semibold flex items-center'>Hotel holiday Inn, Aerocity <IoMdArrowForward size={20} className='-rotate-45' /></h4>
                            <p className='text-sm text-brand-gray'>New Delhi, 110077</p>
                        </div>
                    </div>

                    {/* Row for Registration */}
                    <div className='border border-white rounded-[10px]'>
                        <p className='text-sm p-[10px]'>Registration</p>

                        <div className='bg-white'>

                            <div className='flex gap-2 p-[10px] border-b'>
                                <div className='rounded-md grid place-content-center size-10 bg-white'>
                                    {/* < size={30} className='text-brand-gray' /> */}
                                    <img src={Invite} alt="Invite" />
                                </div>

                                <div className=''>
                                    <h4 className='!font-semibold flex items-center'>Pending Approval</h4>
                                    <p className='text-sm -mt-1'>Your registration requires approval from the host.</p>
                                </div>
                            </div>

                            <div className='p-[10px]'>
                                <p className='text-sm'>Welcome! Register below to request event access.</p>
                                <button className='w-full mt-[10px] p-3 bg-brand-primary rounded-lg text-white'>Get an Invite</button>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Event Details</h3>
                        <hr className='border-t-2 border-white my-[10px]' />

                        <p className='text-brand-gray'>Lorem ipsum dolor sit amet consectetur. Eu tristique tincidunt convallis facilisi nulla. Id a diam posuere nec. Ac enim venenatis facilisi risus iaculis aliquam senectus. Iaculis lacus tortor donec fusce. Neque sagittis ut ac leo at nisi consectetur quis. Quis turpis in iaculis in vulputate sagittis sagittis adipiscing varius.

                            Quisque feugiat aliquet nibh egestas mauris. Amet arcu nam nunc magna feugiat ipsum nisl fermentum proin. Quam risus consequat hac odio diam. Eros condimentum morbi risus dictum pharetra. Tincidunt suspendisse at eu diam at ut nec facilisi. Varius sollicitudin nisi nunc faucibus venenatis volutpat. Sagittis cras vitae eget id in malesuada. Leo facilisi feugiat pharetra euismod vel. Eros feugiat risus orci eget iaculis feugiat nunc. Massa velit nunc at urna nisl. Elit penatibus mauris scelerisque in pulvinar. Justo accumsan cras habitant sapien semper malesuada. Mi turpis pellentesque velit elit lobortis eu cras.

                            Et eget interdum elit tellus tincidunt nibh. Aliquam etiam vitae vehicula magna proin mauris lorem volutpat porta. Nisl enim libero diam faucibus. At massa urna risus tellus lacus in mi. Dictum ut egestas risus vestibulum enim. Accumsan tincidunt ut nec dignissim felis vulputate venenatis. Pharetra nunc aenean vitae sit elit quis elementum. Nec et tortor vitae nam amet consectetur pharetra. Orci viverra lacus lectus ipsum viverra quis sit vel vel. Viverra vel lacus ac nulla neque in. Id ac vestibulum aenean purus ullamcorper arcu malesuada nunc ultricies. Vivamus eu tempor ut arcu cursus.

                            Sit aliquet accumsan pulvinar fermentum. Tincidunt odio non est commodo euismod. Interdum auctor blandit tincidunt velit elementum commodo. Egestas ut commodo in ipsum sed. Vel fringilla lacus elit in in et at augue. Sed porttitor congue pharetra urna mattis. In eu nulla natoque sed faucibus. Pellentesque aliquam elementum in fusce. Sed dui lectus habitant ac nunc massa eros. Mauris in amet consectetur non cras iaculis amet malesuada aliquet. Facilisis dictum turpis nulla lobortis eu orci nisl elit. Dignissim sit habitant ac rhoncus massa gravida. Feugiat molestie justo sed facilisis turpis congue tincidunt neque bibendum.</p>
                    </div>

                    {/* Agenda Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Event Details</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* Single Day Agenda Details */}
                        <div>
                            <div className='p-2 bg-white rounded-lg font-semibold'>
                                Day 1 (Friday, 17th Jan 2025)
                            </div>

                            {/* All Rows Wrapper */}
                            <div>
                                {/* Single Row */}
                                <div className='!my-4'>
                                    <h5 className='font-semibold'>12:00AM-07:00AM</h5>
                                    <p className='font-light'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                                    {/* All Images */}
                                    <div className='flex gap-5'>
                                        <div className='flex gap-3'>
                                            <img src={Speaker} alt="user" className='size-14 rounded-full' />
                                            <div className='space-y-1'>
                                                <p className='font-semibold text-lg leading-none'>Nikhil Bishnoi</p>
                                                <p className='text-sm leading-none'>Klout Club</p>
                                                <p className='text-xs leading-none'>CEO</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <img src={Speaker} alt="user" className='size-14 rounded-full' />
                                            <div className='space-y-1'>
                                                <p className='font-semibold text-lg leading-none'>Nikhil Bishnoi</p>
                                                <p className='text-sm leading-none'>Klout Club</p>
                                                <p className='text-xs leading-none'>CEO</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <img src={Speaker} alt="user" className='size-14 rounded-full' />
                                            <div className='space-y-1'>
                                                <p className='font-semibold text-lg leading-none'>Nikhil Bishnoi</p>
                                                <p className='text-sm leading-none'>Klout Club</p>
                                                <p className='text-xs leading-none'>CEO</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Speakers */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Agenda Speakers</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* All Speakers */}
                        <div className='flex flex-wrap justify-between'>

                            {/* Single Speaker Deatils */}
                            <div className='max-w-60 text-center border-2 border-red-500'>
                                <img src={Speaker} alt="Speaker" className='rounded-full mx-auto size-24' />
                                <p className='font-semibold'>Udit Tiwari</p>
                                <p className=''>CEO</p>
                                <p className='text-sm font-light'>Tatwa Technologies</p>
                            </div>

                        </div>


                    </div>
                </div>

                {/* Right Div */}
                <div className='max-w-[300px]'>
                    <img src="/background.jpg" alt="Background Image" className='rounded-lg w-full' />

                    <div className='mt-[5.8rem]'>
                        <h3 className='font-semibold text-lg'>Location</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />
                        <p className='text-brand-gray'><strong className='text-black'>Hotel holiday Inn, Aerocity</strong> <br />
                            3rd - 5th floor, Huda City Centre Metro Station, Sector 29, Gurugram, Haryana 122002, India</p>
                        <div className='bg-red-200 rounded-lg mt-[10px] w-[300px] h-[300px]'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExploreViewEvent;
