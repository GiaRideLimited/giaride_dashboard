import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import {
  BsLightningChargeFill,
  BsCalendarCheck,
} from 'react-icons/bs';
import {
  RiLayoutGridFill,
  RiArrowLeftRightFill,
  RiMenuFill,
  RiCloseFill,
} from 'react-icons/ri';
import {
  FaUserTie,
  FaUsers,
  FaCarSide,
} from 'react-icons/fa';
import {
  IoMdNotificationsOutline,
  IoMdSettings,
} from 'react-icons/io';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { BiSupport } from 'react-icons/bi';
// import { FiSearch, FiUsers as FiPartnersIcon } from 'react-icons/fi';
import { FiSearch, FiUsers as FiPartnersIcon, FiLogOut } from 'react-icons/fi';


import DashboardContent from './DashboardContent';
import DriversContent from './DriversContent';
import RidersContent from './RidersContent';
import DropContent from './DropContent';
import BookingsContent from './BookingsContent';
import NotificationsContent from './NotificationsContent';
import SettingsContent from './SettingsContent';
import TransactionsContent from './TransactionsContent';
import CarReportContent from './CarReportContent';
import SupportContent from './SupportContent';
import RidesContent from './RidesContent'; 
import PartnersContent from './PartnersContent';
import XendContent from './XendContent';
import CarRentContent from './CarRentContent';
import ErrandContent from './ErrandContent';
import TravelOrgContent from './TravelOrg';


const AdminDashboard = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // Effect to handle window resize for sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(true); // Keep sidebar open on larger screens
      } else {
        // setIsSidebarOpen(false); // Optionally close on resize to mobile if it was forced open
      }
    };
    // Set initial state based on window size
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const mainNavItemsData = [
    { id: 'dashboard', text: 'Dashboard', path: '/', icon: <RiLayoutGridFill size={18} /> },
    { id: 'drivers', text: 'Drivers', path: '/drivers', icon: <FaUserTie size={18} /> },
    { id: 'riders', text: 'Riders', path: '/riders', icon: <FaUsers size={18} /> },
    { id: 'drop', text: 'Drop', path: '/drop', icon: <FaUsers size={18} /> },
    { id: 'xend', text: 'Xend', path: '/xend', icon: <FaUsers size={18} /> },
    { id: 'errand', text: 'Errand', path: '/errand', icon: <FaUsers size={18} /> },
    { id: 'car', text: 'Car Rent', path: '/car-rent', icon: <FaUsers size={18} /> },

    { id: 'rides', text: 'Rides', path: '/rides', icon: <FaCarSide size={18} /> },


    { id: 'bookings', text: 'Bookings', path: '/bookings', icon: <BsCalendarCheck size={18} /> },
    { id: 'transactions', text: 'Transactions', path: '/transactions', icon: <BsCalendarCheck size={18} /> },
    { id: 'partners', text: 'Partners', path: '/partners', icon: <FiPartnersIcon size={18} /> },
    { id: 'travel', text: 'Travel Org', path: '/travel-org', icon: <FiPartnersIcon size={18} /> },
    { id: 'notifications', text: 'Notifications', path: '/notifications', icon: <IoMdNotificationsOutline size={18} /> },
    { id: 'settings', text: 'Settings', path: '/settings', icon: <IoMdSettings size={18} /> },
  ];

  const reportNavItemsData = [
    { id: 'car_report', text: 'Car Report', path: '/car-report', icon: <HiOutlineDocumentReport size={18} /> },
    { id: 'support', text: 'Support', path: '/support', icon: <BiSupport size={18} /> },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }}
      className={({ isActive }) => `flex items-center space-x-3 px-4 py-2.5 my-1 rounded-lg transition-colors duration-150 text-sm
        ${isActive ? 'bg-yellow-400 text-neutral-900 font-semibold' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'}`}
    >
      {item.icon}
      <span>{item.text}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-neutral-100 font-sans overflow-hidden"> {/* Added overflow-hidden to parent */}
      {/* --- Sidebar Start --- */}
      {/* Mobile Overlay for Sidebar */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`bg-neutral-900 flex flex-col h-screen flex-shrink-0 transition-all duration-300 ease-in-out z-40
          md:w-64 md:static md:translate-x-0 
          ${isSidebarOpen ? 'w-64 translate-x-0 fixed md:static' : '-translate-x-full w-64 fixed md:static md:w-64'} 
        `} // w-64 for mobile when open, fixed position
      >
        <div className="p-5 flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <BsLightningChargeFill className="text-yellow-400" size={28} />
            <span className="text-xl font-bold text-white">giaride</span>
          </div>
          {/* Close button for mobile sidebar */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-neutral-400 hover:text-white">
            <RiCloseFill size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <nav className="px-4">
            {mainNavItemsData.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
          <div className="mt-4">
            <hr className="border-neutral-700 mx-4" />
            <div className="mt-5 mb-2 px-4">
              <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Report & Support</h3>
            </div>
            <nav className="pb-4 px-4">
              {reportNavItemsData.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* --- Content Area Start --- */}
      <div className="flex-1 bg-white flex flex-col overflow-y-auto"> {/* Changed bg to white, was neutral-100 */}
        {/* Header for Content Area */}
   

        <div className="flex justify-between items-center p-4 sm:p-6 md:px-8 border-b border-gray-200 md:border-none flex-shrink-0"> 
          {/* Hamburger Menu for Mobile */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-600 hover:text-gray-800 mr-4">
            <RiMenuFill size={24} />
          </button>

          {/* Right Side Icons */}
          <div className="flex items-center ml-auto"> 
            
            {/* Search Bar */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-56 md:w-72 mr-4"> 
              <FiSearch className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search here"
                className="text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none flex-grow"
              />
            </div>

            {/* Notification Icon */}
            <div className="relative cursor-pointer mr-6">
              <IoMdNotificationsOutline className="text-gray-500 hover:text-gray-700" size={24} sm:size={26} />
              <span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border border-white"></span> 
            </div>

            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <FiLogOut size={20} />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>

          </div>
        </div>

        {/* Main Content Display */}
        <div className="flex-grow sm:p-6 md:p-8 md:pt-0">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/drivers/*" element={<DriversContent />} />
            <Route path="/riders/*" element={<RidersContent />} />
            <Route path="/drop" element={<DropContent />} />
            <Route path="/car-rent" element={<CarRentContent />} />
            <Route path="/xend" element={<XendContent />} />
            <Route path="/errand" element={<ErrandContent />} />
            <Route path="/bookings" element={<BookingsContent />} />
            <Route path="/notifications" element={<NotificationsContent />} />
            <Route path="/settings" element={<SettingsContent />} />
            <Route path="/transactions" element={<TransactionsContent />} />
            <Route path="/car-report" element={<CarReportContent />} />
            <Route path="/support" element={<SupportContent />} />
            <Route path="/rides" element={<RidesContent />} />
            <Route path="/partners/*" element={<PartnersContent />} />
            <Route path="/travel-org" element={<TravelOrgContent />} />
            <Route path="*" element={<DashboardContent />} />
          </Routes>
        </div>
      </div>
      {/* --- Content Area End --- */}
    </div>
  );
};

export default AdminDashboard;