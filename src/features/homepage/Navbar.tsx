import React, { useState, useEffect } from 'react';
import Logo from "./logo.png";
import DarkLogo from "./logo_dark.png";
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { navLinks } from './constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import dummyImage from "/dummyImage.jpg";

const Navbar: React.FC = () => {
    const [active, setActive] = useState<boolean>(false);
    const [isDarkBackground, setIsDarkBackground] = useState<boolean>(false);
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth);
    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Set the text color based on the current path's background color
        if (location.pathname === '/add-first-event' || location.pathname.includes("/explore-events")) {
            setIsDarkBackground(true);
        } else {
            setIsDarkBackground(false);
        }
    }, [location]);

    return (
        <header className={`fixed p-5 left-0 top-0 z-50 w-full ${isDarkBackground ? 'text-black' : 'text-white'} ${location.pathname !== '/' ? 'bg-white/20' : ''} backdrop-blur-sm`}>
            <nav className={`flex justify-between items-center ${isDarkBackground ? 'bg-transparent' : 'bg-transparent'}`}>
                <Link to={"/"}>
                    <img src={!isDarkBackground ? Logo : DarkLogo} alt="Klout Club" className='w-32' />
                </Link>

                <ul className='hidden md:flex gap-5 items-center'>
                    {navLinks.map((link) => (
                        <Link key={link.to} to={link.to}>
                            <li className='capitalize'>
                                {link.name === 'login' && user !== null ?
                                    <span className='flex gap-2 items-center text-sm'>
                                        <img
                                            src={
                                                user?.image === null ? dummyImage : `${imageBaseUrl}/${user?.image}`}
                                            alt="User Avatar"
                                            className="w-10 h-10 object-contain border-2 border-white rounded-full"
                                        />
                                        {user.first_name + " " + user.last_name}
                                    </span>
                                    : link.name}
                            </li>
                        </Link>
                    ))}
                </ul>


                <Menu onClick={() => setActive(prev => !prev)} className='md:hidden cursor-pointer' />
            </nav>

            {/* Mobile Menu */}
            <ul className={`${active ? "right-0" : "-right-full"
                } fixed top-0 h-screen max-w-60 p-3 w-full bg-white !text-black backdrop-blur-2xl md:hidden flex flex-col gap-4 transition-all duration-300 ease-in-out`}>
                <X onClick={() => setActive(false)} className='absolute right-3 cursor-pointer' />
                <div className='mt-10 space-y-5'>
                    {navLinks.map((link) => (
                        <Link onClick={() => setActive(false)} key={link.to} to={link.to} className='block'>
                            {link.name === 'login' && user !== null ?
                                <span className='flex gap-2 items-center text-sm'>
                                    <img
                                        src={
                                            user?.image === null ? dummyImage : `${imageBaseUrl}/${user?.image}`}
                                        alt="User Avatar"
                                        className="w-10 h-10 object-contain border-2 border-white rounded-full"
                                    />
                                    {user.first_name + " " + user.last_name}
                                </span>
                                : link.name}
                        </Link>
                    ))}
                </div>
            </ul>
        </header>
    );
}

export default Navbar;
