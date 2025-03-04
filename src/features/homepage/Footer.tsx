import React from 'react';
import WhiteLogo from "/white_logo.png";
import { Heart } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {

    const year = new Date().getFullYear();
    const nextYear = (new Date().getFullYear() + 1) % 100;

    return (
        <footer className='w-full mt-10 flex justify-between flex-col gap-4 md:flex-row items-center'>
            <Link to={"/home"}>
                <img src={WhiteLogo} alt="Klout Club" width={96} height={96} />
            </Link>

            <div className='text-xs lg:text-sm font-light'>
                <p className='flex gap-1 items-center flex-wrap'>Copyright &copy; {year}-{nextYear} All rights reserved | The Klout Club is made with <Heart size={18} /></p>
                <div className='flex gap-2 mt-2 items-center justify-center'>
                    <a href="https://www.klout.club/privacypolicy.html" target='_blank' className='underline underline-offset-1'>Privacy Policy</a>
                    <span>|</span>
                    <a href="https://www.klout.club/terms-and-condition" target='_blank' className='underline underline-offset-1'>Terms and Conditions</a>
                    <span>|</span>
                    <a href="https://www.klout.club/cancellation-policy" target='_blank' className='underline underline-offset-1'>Refund Policy</a>
                </div>
            </div>

            <div className='flex gap-4'>
                <a target='_blank' href="https://www.facebook.com/thekloutclub">
                    <FaFacebookF />
                </a>
                <a target='_blank' href="https://www.facebook.com/thekloutclub">
                    <FaXTwitter />
                </a>
                <a target='_blank' href="https://www.linkedin.com/company/klout-club/">
                    <FaLinkedinIn />
                </a>
                <a target='_blank' href="https://www.instagram.com/klout_club/">
                    <FaInstagram />
                </a>
            </div>
        </footer>
    )
}

export default Footer;
