// Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import { GlobalProvider } from "../GlobalContext";
import WhiteLogo from "/white_logo.png";
import { Heart } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from "react-router-dom";

const Layout: React.FC<React.PropsWithChildren<{}>> = () => {

  const year = new Date().getFullYear();
  const nextYear = (new Date().getFullYear() + 1) % 100;

  return (
    <GlobalProvider> {/* Wrap the layout with the provider */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="flex-1 relative flex flex-col justify-between bg-gray-100 p-6 overflow-auto">
            <Outlet />
            <footer className='w-full mt-10 flex justify-between flex-col gap-4 md:flex-row items-center'>
              <Link to={"/home"}>
                <img src={WhiteLogo} alt="Klout Club" width={96} height={96} className="filter invert"/>
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
          </main>

        </div>
      </div>
    </GlobalProvider>
  );
};

export default Layout;
