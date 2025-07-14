// src/components/DriversContent.jsx
import React, { useState, useEffect } from 'react';
import { TbFilter } from 'react-icons/tb';
import { IoMdAdd } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';

// Import the modal
import AddDriverModal from './AddDriverModal'; // Assuming it's in the same directory or adjust path

// Helper component for the "Today" tag
const TodayTag = () => (
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        Today
    </span>
);



const DriversContent = () => {
    const [activeTab, setActiveTab] = useState('All drivers');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ridersStats, setRidersStats] = useState(null);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;


    useEffect(() => {
        const endpoint = (`${BASE_URL}/admin/drivers`);
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
    }, []);

    useEffect(() => {
        const endpoint = (`${BASE_URL}/admin/drivers-stats`);
        fetch(endpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setRidersStats(jsonData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err.message || "Unknown error");
                setIsLoading(false);
            });
    }, []);




    const entityTypeForModal = "Driver";
    const tabs = [`All ${entityTypeForModal.toLowerCase()}s`, 'Pending'];

    return (
        <div className="text-gray-800 relative">
            <div className='bg-[#F8F7F1] p-8'>
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold">Drivers Statistics</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-[#A3A3A333]">
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Total {entityTypeForModal.toLowerCase()}s</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold">{ridersStats?.data?.total || "--"}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#A3A3A333]">
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Active {entityTypeForModal.toLowerCase()}s</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold">{ridersStats?.data?.active || "--"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[26%]"> {/* Adjusted width */}
                        <TbFilter size={20} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder={`Filter ${entityTypeForModal.toLowerCase()}s by name, ID, status`}
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-[24px] py-[8px] rounded-[48px] flex items-center justify-center w-full sm:w-auto transition-colors cursor-pointer" // Rounded-md to match image
                    >
                        <IoMdAdd size={20} className="mr-1.5" />
                        Add {entityTypeForModal}
                    </button>
                </div>

                <div className=" border-b border-gray-200">
                    <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium
                                    ${activeTab === tab
                                        ? 'border-neutral-800 text-neutral-900' // Darker underline for active tab as per image
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-sm text-left text-gray-600">
                        {/* UPDATED THEAD TO MATCH IMAGE */}
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">No.</th>
                                <th scope="col" className="px-4 py-3 font-medium">Car no.</th>
                                <th scope="col" className="px-4 py-3 font-medium">Driver Name</th>
                                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                                <th scope="col" className="px-4 py-3 font-medium">Gender</th>
                                <th scope="col" className="px-4 py-3 font-medium">Type</th>
                                <th scope="col" className="px-4 py-3 font-medium">Location</th>
                                <th scope="col" className="px-4 py-3 font-medium">Earning</th>
                                <th scope="col" className="px-4 py-3 font-medium text-center"></th>
                            </tr>
                        </thead>
                        {data?.data?.data?.length > 0 ? (
                            <tbody>
                                {data?.data?.data?.map((driver, index) => (
                                    <tr key={driver.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{driver.car_number_plate || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">

                                                <img className="w-7 h-7 rounded-full mr-2.5 object-cover" src={driver?.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"} alt={driver.first_name} />

                                                {driver.first_name || driver.last_name
                                                    ? `${driver.first_name || ''} ${driver.last_name || ''}`
                                                    : driver.username || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 capitalize">{driver.status}</td>
                                        <td className="px-4 py-2 capitalize">{driver.gender || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            {driver.premium_class || "--"}
                                        </td>
                                        <td className="px-4 py-2">{driver.city || 'N/A'}</td>
                                        <td className="px-4 py-2">₦{driver.total_credits || 0}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <BsThreeDotsVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="9" className="text-center py-4 text-gray-500">No drivers found</td>
                                </tr>
                            </tbody>
                        )}
                        {/* <tbody> */}


                        {/* {driversTableData.map((driver) => (
                                <tr key={driver.id} className="bg-white border-b border-gray-100 hover:bg-gray-50"> 
                                    <td className="px-4 py-3 text-gray-700">{driver.no}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                            {driver.carNo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <img className="w-6 h-6 rounded-full mr-2 object-cover" src={driver.driverImg} alt={driver.driverName} /> 
                                            <span className="font-medium text-gray-800">{driver.driverName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${driver.statusColor}`}></span> 
                                            <span className="text-gray-700">{driver.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{driver.gender}</td>
                                    <td className="px-4 py-3 text-gray-700">{driver.type}</td>
                                    <td className="px-4 py-3 text-gray-700">{driver.location}</td>
                                    <td className="px-4 py-3 text-gray-700">{driver.earning}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <BsThreeDotsVertical size={16} /> 
                                        </button>
                                    </td>
                                </tr>
                            ))} */}
                        {/* </tbody> */}
                    </table>
                </div>
            </div>

            <AddDriverModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                entityType={entityTypeForModal}
            />
        </div>
    );
};

export default DriversContent;