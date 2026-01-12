// src/components/RidesContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { TbFilter } from 'react-icons/tb';
import { BsThreeDotsVertical, BsCheckCircleFill } from 'react-icons/bs';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Helper component for the "Today" tag on stats cards
const TodayTag = () => (
  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
    Today
  </span>
);

// Sample data for the rides table
const ridesTableData = [
  { id: 'r1', no: '01', carNo: '6465', driverName: 'Alex Noman', driverImg: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'online', statusColor: 'bg-green-500', gender: 'Male', type: 'Interstate', location: 'Lagos', earning: '$ 35.44' },
  { id: 'r2', no: '02', carNo: '5665', driverName: 'Razib Rahman', driverImg: 'https://randomuser.me/api/portraits/men/33.jpg', status: 'offline', statusColor: 'bg-neutral-800', gender: 'Male', type: 'Intrastate', location: 'Abuja', earning: '$ 0.00' },
  { id: 'r3', no: '03', carNo: '1755', driverName: 'Luke Norton', driverImg: 'https://randomuser.me/api/portraits/men/34.jpg', status: 'In route', statusColor: 'bg-red-500', gender: 'Female', type: 'Interstate', location: 'Lagos', earning: '$ 23.50' },
  { id: 'r4', no: '01', carNo: '6465', driverName: 'Alex Noman', driverImg: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'online', statusColor: 'bg-green-500', gender: 'Male', type: 'Interstate', location: 'Lagos', earning: '$ 35.44' },
  { id: 'r5', no: '02', carNo: '5665', driverName: 'Razib Rahman', driverImg: 'https://randomuser.me/api/portraits/men/33.jpg', status: 'offline', statusColor: 'bg-neutral-800', gender: 'Male', type: 'Intrastate', location: 'Abuja', earning: '$ 0.00' },
  { id: 'r6', no: '03', carNo: '1755', driverName: 'Luke Norton', driverImg: 'https://randomuser.me/api/portraits/men/34.jpg', status: 'In route', statusColor: 'bg-red-500', gender: 'Female', type: 'Interstate', location: 'Lagos', earning: '$ 23.50' },
  { id: 'r7', no: '01', carNo: '6465', driverName: 'Alex Noman', driverImg: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'online', statusColor: 'bg-green-500', gender: 'Male', type: 'Interstate', location: 'Lagos', earning: '$ 35.44' },
  { id: 'r8', no: '02', carNo: '5665', driverName: 'Razib Rahman', driverImg: 'https://randomuser.me/api/portraits/men/33.jpg', status: 'offline', statusColor: 'bg-neutral-800', gender: 'Male', type: 'Intrastate', location: 'Abuja', earning: '$ 0.00' },
  { id: 'r9', no: '03', carNo: '1755', driverName: 'Luke Norton', driverImg: 'https://randomuser.me/api/portraits/men/34.jpg', status: 'In route', statusColor: 'bg-red-500', gender: 'Female', type: 'Interstate', location: 'Lagos', earning: '$ 23.50' },
];

// --- Filter Dropdown Component ---
const FilterDropdown = ({ isOpen, setIsOpen, filters, setFilters, filterButtonRef }) => {
  const dropdownRef = useRef(null);
  const [isStatusOpen, setIsStatusOpen] = useState(true);



  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close if click is outside of dropdown AND outside of the filter button
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        filterButtonRef.current && !filterButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, filterButtonRef]); // Added filterButtonRef to dependency array

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'status') {
      // For status, only one can be active, or toggle off
      setFilters(prev => ({
        ...prev,
        statusOnline: value === 'Online' ? !prev.statusOnline : false,
        statusOffline: value === 'Offline' ? !prev.statusOffline : false,
        statusInRoute: value === 'In route' ? !prev.statusInRoute : false,
      }));
    } else {
      // For other filters, toggle their boolean state
      setFilters(prev => ({
        ...prev,
        [filterName]: !prev[filterName],
      }));
    }
  };

  const filterOptions = [
    { name: 'Driver name', key: 'driverName' },
    { name: 'Riders name', key: 'riderName' },
    { name: 'User ID', key: 'userId' },
  ];

  const statusOptions = ['Online', 'Offline', 'In route'];

  if (!isOpen) return null; // Don't render if not open



  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-2 transition-opacity duration-150 ease-in-out"
      style={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }} // Smooth transition (optional)
    >
      {filterOptions.map(option => (
        <div key={option.key} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
          onClick={() => handleFilterChange(option.key)}
        >
          <span className="text-sm text-gray-700">{option.name}</span>
          <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors
            ${filters[option.key] ? 'bg-black border-black' : 'border-gray-300'}
          `}>
            {filters[option.key] && <BsCheckCircleFill className="text-white w-2.5 h-2.5" />}
          </div>
        </div>
      ))}

      <div>
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-t border-gray-200"
        >
          <span className="text-sm text-gray-700">Status</span>
          {isStatusOpen ? <FiChevronUp size={18} className="text-gray-400" /> : <FiChevronDown size={18} className="text-gray-400" />}
        </button>
        {isStatusOpen && (
          <div className="pl-4 border-t border-gray-100">
            {statusOptions.map(status => (
              <div key={status} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFilterChange('status', status)}
              >
                <span className="text-sm text-gray-700">{status}</span>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                  ${(status === 'Online' && filters.statusOnline) || (status === 'Offline' && filters.statusOffline) || (status === 'In route' && filters.statusInRoute)
                    ? 'border-black'
                    : 'border-gray-300'}
                `}>
                  {((status === 'Online' && filters.statusOnline) || (status === 'Offline' && filters.statusOffline) || (status === 'In route' && filters.statusInRoute)) &&
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
// --- End Filter Dropdown Component ---


const RidesContent = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    driverName: true,
    riderName: false,
    userId: false,
    statusOnline: false,
    statusOffline: false,
    statusInRoute: false,
  });
  const tableTabs = ['All', 'Ongoing', 'Completed', 'Canceled'];
  const filterButtonRef = useRef(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rideStats, setRideStats] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  useEffect(() => {
  const endpoint =
  activeTab === "All"
    ? `${BASE_URL}/admin/rides`
    : activeTab === "Completed"
      ? `${BASE_URL}/admin/completed-ride?from=2025-06-24`
      : activeTab === "Canceled"
        ? `${BASE_URL}/admin/cancelled-ride`
        : "";

      
    // const endpoint = (`${BASE_URL}/admin/rides`);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setIsLoading(false);
      });
  }, [activeTab]);


  useEffect(() => {
    const endpoint = (`${BASE_URL}/admin/total-rides-stats`);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setRideStats(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setIsLoading(false);
      });
  }, []);



  const toggleFilterDropdown = () => {
    setIsFilterOpen(prev => !prev);
  };

  console.log("setRideStats", rideStats)

  return (
    <div className="text-gray-800 min-h-screen font-sans">
      {/* Todays Statistics Title & Cards */}
      <div className="bg-[#F8F7F1] p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Todays Statistics</h2>
          <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-200"> <h3 className="text-base sm:text-lg font-medium text-gray-700">Total Rides</h3> <TodayTag /> </div>
            <div> <p className="text-3xl sm:text-4xl font-bold text-gray-900">{rideStats?.data?.totalRides}</p> </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-200"> <h3 className="text-base sm:text-lg font-medium text-gray-700">Active Rides</h3> <TodayTag /> </div>
            <div> <p className="text-3xl sm:text-4xl font-bold text-gray-900">{rideStats?.data?.activeRides}</p> </div>
          </div>
        </div>
      </div>

      {/* Rides Table Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="relative" ref={filterButtonRef}> {/* Attach ref to the button's container */}
            <button
              onClick={toggleFilterDropdown} // Use toggle function
              className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto max-w-xs sm:max-w-sm bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <TbFilter size={18} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 placeholder-gray-400">
                Filter drivers by name, ID, status
              </span>
            </button>
            {/* Pass filterButtonRef to the dropdown */}
            <FilterDropdown
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
              filters={filters}
              setFilters={setFilters}
              filterButtonRef={filterButtonRef}
            />
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
            {tableTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium ${activeTab === tab ? 'border-neutral-800 text-neutral-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}> {tab} </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-transparent">
              <tr> <th scope="col" className="px-4 py-3 font-medium">No.</th> <th scope="col" className="px-4 py-3 font-medium">Car no.</th> <th scope="col" className="px-4 py-3 font-medium">Driver Name</th> <th scope="col" className="px-4 py-3 font-medium">Status</th> <th scope="col" className="px-4 py-3 font-medium">Gender</th> <th scope="col" className="px-4 py-3 font-medium">Type</th> <th scope="col" className="px-4 py-3 font-medium">Location</th> <th scope="col" className="px-4 py-3 font-medium">Earning</th> <th scope="col" className="px-4 py-3 font-medium text-center">...</th> </tr>
            </thead>
            <tbody>
              {data?.data?.data.map((ride, index) => (
                <tr key={ride.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{ride.carNo || "N/A"}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center">
                    <img className="w-6 h-6 rounded-full mr-2 object-cover" src={ride.picture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"} alt={ride.driverNam|| "N/A"} />
                    <span className="font-medium text-gray-800">{ride.driverName !== " " ? ride.driverName : "N/A"}</span>
                  </div></td>
                  <td className="px-4 py-3"><div className="flex items-center">
                    {/* <span className={`w-2 h-2 rounded-full mr-2 ${ride.statusColor}`}></span> */}
                  <span className="text-gray-700">{ride.status || "N/A"}</span></div></td>
                  <td className="px-4 py-3 text-gray-700">{ride.gender || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-700">{ride.type || "Driver"}</td>
                  <td className="px-4 py-3 text-gray-700">{ride.location || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-700">₦{activeTab === "All" ? ride.earnings : activeTab === "Completed" ? ride.earning : "0.00"}</td>
                  <td className="px-4 py-3 text-center"><button className="text-gray-400 hover:text-gray-600"><BsThreeDotsVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RidesContent;