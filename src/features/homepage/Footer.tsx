import React from 'react';
import { Heart } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaGooglePlay, FaApple } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import aws from "./aws.svg";
import ssl from "./ssl.svg";

const Footer: React.FC = () => {

    const year = new Date().getFullYear();
    const nextYear = (new Date().getFullYear() + 1) % 100;

    return (
        // <footer className='w-full mt-10 flex justify-between flex-col gap-4 md:flex-row items-center'>
        //     <Link to={"/home"}>
        //         <img src={WhiteLogo} alt="Klout Club" width={96} height={96} className={`${window.location.pathname.includes("/explore-events") ? 'invert' : ''}`}/>
        //     </Link>

        //     <div className='text-xs lg:text-sm font-light'>
        //         <p className='flex gap-1 items-center flex-wrap'>Copyright &copy; {year}-{nextYear} All rights reserved | The Klout Club is made with <Heart size={18} /> Zirclez Innovation</p>
        //         <div className='flex gap-2 mt-2 items-center justify-center'>
        //             <a href="https://www.klout.club/privacypolicy.html" target='_blank' className='underline underline-offset-1'>Privacy Policy</a>
        //             <span>|</span>
        //             <a href="https://www.klout.club/terms-and-condition" target='_blank' className='underline underline-offset-1'>Terms and Conditions</a>
        //             <span>|</span>
        //             <a href="https://www.klout.club/cancellation-policy" target='_blank' className='underline underline-offset-1'>Refund Policy</a>
        //         </div>
        //     </div>

        //     <div className='flex gap-4'>
        //         <a target='_blank' href="https://www.facebook.com/thekloutclub">
        //             <FaFacebookF />
        //         </a>
        //         <a target='_blank' href="https://x.com/TheKloutClub">
        //             <FaXTwitter />
        //         </a>
        //         <a target='_blank' href="https://www.linkedin.com/company/klout-club/">
        //             <FaLinkedinIn />
        //         </a>
        //         <a target='_blank' href="https://www.instagram.com/klout_club/">
        //             <FaInstagram />
        //         </a>
        //     </div>
        // </footer>

        <footer className='w-full p-5 relative top-10 mx-auto h-fit bg-black/10 backdrop-blur-lg rounded-lg'>
            <h3 className='text-center text-lg'>Klout Club: Where every connection counts.</h3>
            <div className='flex justify-center gap-5 flex-wrap md:justify-between items-center md:absolute w-full mx-auto left-0 right-0 top-0 p-5'>
                <div className='flex md:flex-col flex-wrap gap-2'>
                    <img src={aws} alt="AWS" className='size-14' />
                    <img src={ssl} alt="SSL" className='size-16' />
                </div>
                <div className='flex md:flex-col flex-wrap justify-center gap-2'>
                    <a href="https://play.google.com/store/apps/details?id=com.klout.app&pli=1" target='_blank' className='flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg'>
                        <FaGooglePlay className='text-2xl' />
                        <div className='text-left'>
                            <p className='text-xs'>GET IT ON</p>
                            <p className='text-sm font-semibold'>Google Play</p>
                        </div>
                    </a>

                    <a href="https://apps.apple.com/in/app/klout-club/id6475306206" target='_blank' className='flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg'>
                        <FaApple className='text-2xl' />
                        <div className='text-left'>
                            <p className='text-xs'>Download on the</p>
                            <p className='text-sm font-semibold'>App Store</p>
                        </div>
                    </a>
                </div>
            </div>
            <div className='flex gap-3 mt-5 justify-center relative'>
                <a href="https://www.facebook.com/thekloutclub" target='_blank' className='w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-colors duration-300'>
                    <FaFacebookF className='text-xl' />
                </a>
                <a href="https://x.com/TheKloutClub" target='_blank' className='w-10 h-10 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-colors duration-300'>
                    <FaXTwitter className='text-xl' />
                </a>
                <a href="https://www.linkedin.com/company/klout-club/" target='_blank' className='w-10 h-10 rounded-full bg-white/10 hover:bg-[#0A66C2] flex items-center justify-center transition-colors duration-300'>
                    <FaLinkedinIn className='text-xl' />
                </a>
            </div>
            <div className='text-xs lg:text-sm font-light !text-center mt-7 relative'>
                 <p className='flex gap-1 items-center flex-wrap justify-center'>Copyright &copy; {year}-{nextYear} All rights reserved | The Klout Club is made with <Heart size={18} /> Zirclez Innovation Pvt Ltd.</p>
                <div className='flex gap-2 mt-2 flex-wrap sm:flex-nowrap items-center justify-center'>
                    <a href="https://www.klout.club/about-us" target='_blank' className='underline underline-offset-1'>About Us</a>
                    <span>|</span>
                    <a href="https://www.klout.club/privacypolicy.html" target='_blank' className='underline underline-offset-1'>Privacy Policy</a>
                    <span>|</span>
                    <a href="https://www.klout.club/terms-and-condition" target='_blank' className='underline underline-offset-1'>Terms and Conditions</a>
                    <span>|</span>
                    <a href="https://www.klout.club/cancellation-policy" target='_blank' className='underline underline-offset-1'>Refund Policy</a>
                    <span>|</span>
                    <a href="/explore-events/all" target='_blank' className='underline underline-offset-1'>Explore Events</a>
                    <span>|</span>
                    <a href="https://www.klout.club/help" target='_blank' className='underline underline-offset-1'>Help</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;