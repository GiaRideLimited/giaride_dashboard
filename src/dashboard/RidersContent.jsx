// src/components/RidersContent.jsx
import React, { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef
import { TbFilter } from 'react-icons/tb';
import { IoMdAdd } from 'react-icons/io';
import { BsThreeDotsVertical, BsCheckCircleFill } from 'react-icons/bs'; // Added for stepper in modal


// Import the modal (assuming it's in the same directory or adjust path)
import AddDriverModal from './AddDriverModal';
import RiderDetailsView from './rider/RiderDetailsView';

// Helper component for the "Today" tag
const TodayTag = () => (
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        Today
    </span>
);

const ridersTableData = [

    { id: 'r1', no: '01', riderId: 'RDR-6465', name: 'Alex Noman', img: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'active', statusColor: 'bg-green-500', gender: 'Male', joinDate: '10-03-2023', totalRides: '150', location: 'Lagos' },
    { id: 'r2', no: '02', riderId: 'RDR-5665', name: 'Bella Hadid', img: 'https://randomuser.me/api/portraits/women/33.jpg', status: 'inactive', statusColor: 'bg-gray-400', gender: 'Female', joinDate: '11-04-2023', totalRides: '80', location: 'Abuja' },
];




const RidersContent = () => {
    const [activeTab, setActiveTab] = useState('All riders');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [ridersData, setRidersData] = useState(ridersTableData);
    const [ridersData, setRidersData] = useState(null);

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ridersStats, setRidersStats] = useState(null);
    const [selectedRiderRef, setSelectedRiderRef] = useState(null);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;


    const fetchRiders = () => {
        setIsLoading(true);
        const endpoint = (`${BASE_URL}/admin/riders`);
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
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    console.log("RidersContent data:", data);

    useEffect(() => {
        const endpoint = (`${BASE_URL}/admin/riders-stats`);
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

    const entityTypeForModal = "Rider";
    const tabs = [`All ${entityTypeForModal.toLowerCase()}s`, 'Pending'];

    const handleAddRiderSubmit = () => {
        fetchRiders();
        setIsModalOpen(false);
    };

    console.log(data)

    if (selectedRiderRef) {
        return <RiderDetailsView reference={selectedRiderRef} onBack={() => setSelectedRiderRef(null)} />;
    }

    return (
        <div className="text-gray-800 relative">
            {/* Statistics Title & Cards */}
            <div className='bg-[#F8F7F1] p-8'>
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold">{entityTypeForModal}s Statistics</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-[#A3A3A333]">
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Total {entityTypeForModal.toLowerCase()}s</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold">{ridersStats?.data?.total ?? "--"}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#A3A3A333]">
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Active {entityTypeForModal.toLowerCase()}s</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold">{ridersStats?.data?.active ?? "--"}</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Table Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto max-w-xs sm:max-w-sm">
                        <TbFilter size={20} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder={`Filter ${entityTypeForModal.toLowerCase()}s by name, ID, status`}
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-[24px] py-[8px] rounded-full flex items-center justify-center w-full sm:w-auto transition-colors cursor-pointer"
                    >
                        <IoMdAdd size={20} className="mr-1.5" />
                        Add {entityTypeForModal}s
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
                                        ? 'border-yellow-500 text-yellow-600' // Or your preferred active tab style
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
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">

                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">No.</th>
                                <th scope="col" className="px-4 py-3 font-medium">Ride no.</th>
                                <th scope="col" className="px-4 py-3 font-medium">Rider Name</th>
                                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                                <th scope="col" className="px-4 py-3 font-medium">Gender</th>
                                {/* <th scope="col" className="px-4 py-3 font-medium">Type</th> */}
                                <th scope="col" className="px-4 py-3 font-medium">Location</th>
                                <th scope="col" className="px-4 py-3 font-medium">Expenditures</th>
                                <th scope="col" className="px-4 py-3 font-medium text-center"></th>
                            </tr>
                        </thead>
                        {data?.data?.data?.length > 0 ? (
                            <tbody>
                                {data?.data?.data?.map((driver, index) => (
                                    <tr
                                        key={driver.id}
                                        className="bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedRiderRef(driver.reference)}
                                    >
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{driver.car_number_plate || 'N/A'}</td>
                                        {/* <td className="px-4 py-2">{driver.reference || 'N/A'}</td> */}
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">

                                                <img className="w-7 h-7 rounded-full mr-2.5 object-cover" src={driver?.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"} alt={driver.first_name} />

                                                {driver.first_name || driver.last_name
                                                    ? `${driver.first_name || ''} ${driver.last_name || ''}`
                                                    : driver.username || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 capitalize">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 capitalize">{driver.gender || 'N/A'}</td>
                                        <td className="px-4 py-2">{driver.city || 'N/A'}</td>
                                        <td className="px-4 py-2">₦ {Number(driver.total_debit || 0).toLocaleString()}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button className="text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                                                <BsThreeDotsVertical size={16} />
                                            </button>                                        </td>
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

                    </table>
                </div>
            </div>

            {/* AddDriverModal is used here, passing "Rider" as entityType */}
            <AddDriverModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddSuccess={handleAddRiderSubmit}
                entityType={entityTypeForModal}
            />
        </div>
    );
};

export default RidersContent;