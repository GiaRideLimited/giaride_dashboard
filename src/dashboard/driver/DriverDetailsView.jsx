import React, { useState, useEffect } from 'react';
import {
    FiPhone,
    FiMapPin,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight,
    FiArrowLeft,
    FiMail
} from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';
import EditDriverModal from './EditDriverModal';

const tabs = ['Other Details', 'Ride History', 'Earnings History', 'Documents'];

const rideHistoryData = [
    { id: 'R-101', pickup: 'Victoria Island, Lagos', dest: 'Ikeja, Lagos', customer: 'Sarah O.', length: '15km', fare: '₦5,500', status: 'Completed', statusCode: 'completed' },
    { id: 'R-102', pickup: 'Surulere, Lagos', dest: 'Yaba, Lagos', customer: 'John D.', length: '8km', fare: '₦3,200', status: 'Completed', statusCode: 'completed' },
    { id: 'R-103', pickup: 'Lekki Phase 1, Lagos', dest: 'Ajah, Lagos', customer: 'Emma W.', length: '12km', fare: '₦4,800', status: 'In route', statusCode: 'route' },
    { id: 'R-104', pickup: 'Ikoyi, Lagos', dest: 'Marina, Lagos', customer: 'David K.', length: '6km', fare: '₦2,500', status: 'Completed', statusCode: 'completed' },
    { id: 'R-105', pickup: 'Gbagada, Lagos', dest: 'Oshodi, Lagos', customer: 'Bolu T.', length: '10km', fare: '₦4,000', status: 'Completed', statusCode: 'completed' },
];

const DriverDetailsView = ({ reference, onBack }) => {
    const [activeTab, setActiveTab] = useState('Other Details');
    const [driver, setDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    const fetchDriverDetails = () => {
        setIsLoading(true);
        const endpoint = `${BASE_URL}/admin/driver/${reference}`;
        fetch(endpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setDriver(jsonData.data || jsonData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err.message || "Unknown error");
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (!reference) return;
        fetchDriverDetails();
    }, [reference]);

    const handleDeactivate = () => {
        if (!window.confirm(`Are you sure you want to deactivate this driver?`)) return;
        
        setIsActionLoading(true);
        const endpoint = `${BASE_URL}/admin/deactivate-driver/${reference}`;
        
        fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to deactivate driver');
            return response.json();
        })
        .then(() => {
            alert('Driver deactivated successfully');
            fetchDriverDetails(); // Refresh data
        })
        .catch(err => {
            console.error("Deactivation error:", err);
            alert(err.message);
        })
        .finally(() => {
            setIsActionLoading(false);
        });
    };

    const StatusBadge = ({ status }) => {
        const isCompleted = status === 'completed' || status === 'Completed';
        return (
            <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-gray-600 text-xs">{status}</span>
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-white min-h-screen font-sans">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <button onClick={onBack} className="text-blue-500 hover:underline cursor-pointer">Go back</button>
            </div>
        );
    }

    if (!driver) return null;

    const fullName = `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'No Name';

    return (
        <div className="bg-white min-h-screen p-6 sm:p-10 font-sans animate-fade-in text-gray-800">
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer group"
            >
                <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Drivers</span>
            </button>

            {/* --- Top Header Profile Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">

                {/* Profile Info */}
                <div className="flex items-center gap-5">
                    <img
                        src={driver.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"}
                        alt={fullName}
                        className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-gray-50"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                        <p className="text-gray-500 text-sm mb-2">{driver.id || 'N/A'}</p>
                        <span className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${driver.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                            {driver.status || 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleDeactivate}
                        disabled={isActionLoading || driver.status !== 'active'}
                        className={`flex-1 md:flex-none px-6 py-2.5 border border-gray-300 rounded-full text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                            ${driver.status === 'active' ? 'text-red-600 border-red-100 hover:bg-red-50' : 'text-gray-400'}
                        `}
                    >
                        {isActionLoading ? 'Processing...' : 'Deactivate Driver'}
                    </button>
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Edit Driver
                    </button>
                </div>
            </div>

            {/* --- Contact / Location Details --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 mb-12 bg-[#F9F9F9] p-8 rounded-2xl">
                <div className="flex items-center text-sm">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 shrink-0">
                        <FiPhone className="text-gray-400" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Phone Number</span>
                        <span className="font-semibold text-gray-900">{driver.phone_number || 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 shrink-0">
                        <FiMail className="text-gray-400" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Email address</span>
                        <span className="font-semibold text-gray-900">{driver.email || 'N/A'}</span>
                    </div>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 shrink-0">
                        <FiMapPin className="text-gray-400" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Location</span>
                        <span className="font-semibold text-gray-900">
                            {[driver.city, driver.state].filter(Boolean).join(', ') || 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-4 shrink-0">
                        <BsCarFront className="text-gray-400" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Car Plate</span>
                        <span className="font-semibold text-gray-900">
                            {driver.car_number_plate || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Main Content Card (Tabs + Table) --- */}
            <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar bg-gray-50/30">
                    <div className="flex space-x-10 px-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-5 text-sm font-semibold transition-all whitespace-nowrap relative
                  ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}
                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                    {activeTab === 'Other Details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <DetailItem label="Onboarding Stage" value={driver.onboarding_stage} />
                            <DetailItem label="Rating" value={`${driver.rating || 0} ★`} />
                            <DetailItem label="Company" value={driver.company_name} />
                            <DetailItem label="Work Address" value={driver.work_address} />
                            <DetailItem label="Occupation" value={driver.occupation} />
                            <DetailItem label="Verified" value={driver.verified ? 'Yes' : 'No'} />
                            <DetailItem label="Joined Date" value={driver.created_at ? new Date(driver.created_at).toLocaleDateString() : 'N/A'} />
                            <DetailItem label="Document Status" value={driver.document_status} capitalize />
                        </div>
                    )}

                    {activeTab === 'Ride History' && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2.5 w-full sm:w-96 border border-gray-100">
                                    <FiSearch className="text-gray-400 mr-2" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search rides..."
                                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 shrink-0">
                                        <FiFilter size={14} /> All
                                    </button>
                                    {['Today', 'Week', 'Month', 'Year'].map(f => (
                                        <button key={f} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 shrink-0">
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                                    <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                        <tr>
                                            <th className="px-4 py-3 first:rounded-l-lg">No.</th>
                                            <th className="px-4 py-3">Pickup</th>
                                            <th className="px-4 py-3">Destination</th>
                                            <th className="px-4 py-3">Customer</th>
                                            <th className="px-4 py-3">Length</th>
                                            <th className="px-4 py-3">Fare</th>
                                            <th className="px-4 py-3 last:rounded-r-lg">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rideHistoryData.map((ride, idx) => (
                                            <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-4 text-gray-900 font-bold border-b border-gray-50 group-last:border-none">{ride.id}</td>
                                                <td className="px-4 py-4 text-gray-500 border-b border-gray-50 group-last:border-none">{ride.pickup}</td>
                                                <td className="px-4 py-4 text-gray-500 border-b border-gray-50 group-last:border-none">{ride.dest}</td>
                                                <td className="px-4 py-4 text-gray-500 border-b border-gray-50 group-last:border-none">{ride.customer}</td>
                                                <td className="px-4 py-4 text-gray-500 border-b border-gray-50 group-last:border-none">{ride.length}</td>
                                                <td className="px-4 py-4 text-gray-900 font-semibold border-b border-gray-50 group-last:border-none">{ride.fare}</td>
                                                <td className="px-4 py-4 border-b border-gray-50 group-last:border-none">
                                                    <StatusBadge status={ride.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <span className="text-xs text-gray-500 font-medium">Page 1 of 1</span>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 border border-gray-200 rounded-md text-gray-400 hover:text-gray-900 transition-colors"><FiChevronsLeft size={16} /></button>
                                    <button className="p-1.5 border border-gray-200 rounded-md text-gray-400 hover:text-gray-900 transition-colors"><FiChevronLeft size={16} /></button>
                                    <button className="p-1.5 border border-gray-200 rounded-md text-gray-400 hover:text-gray-900 transition-colors"><FiChevronRight size={16} /></button>
                                    <button className="p-1.5 border border-gray-200 rounded-md text-gray-400 hover:text-gray-900 transition-colors"><FiChevronsRight size={16} /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'Ride History' && activeTab !== 'Other Details' && (
                        <div className="py-24 text-center">
                            <p className="text-gray-400 font-medium">Content for {activeTab} will be displayed here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <EditDriverModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                driver={driver} 
                onUpdateSuccess={fetchDriverDetails} 
            />
        </div>
    );
};

const DetailItem = ({ label, value, capitalize = false }) => (
    <div className="flex flex-col">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1.5">{label}</h3>
        <p className={`text-sm font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>
            {value !== null && value !== undefined ? value : 'N/A'}
        </p>
    </div>
);

export default DriverDetailsView;
