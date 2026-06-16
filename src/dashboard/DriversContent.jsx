import React, { useState, useEffect, useCallback } from 'react';
import { TbFilter } from 'react-icons/tb';
import { IoMdAdd } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight, FiEye, FiPauseCircle, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

import AddDriverModal from './AddDriverModal';
import DriverDetailsView from './driver/DriverDetailsView';

const TodayTag = () => (
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        Today
    </span>
);

const DriversContent = () => {
    const [activeTab, setActiveTab] = useState('All drivers');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [driversList, setDriversList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDrivers, setTotalDrivers] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [driversStats, setDriversStats] = useState(null);
    const [selectedDriverRef, setSelectedDriverRef] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        if (openDropdownId) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [openDropdownId]);

    // --- Fetch Drivers with Pagination ---
    const fetchDrivers = useCallback((page = 1) => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        const endpoint = `${BASE_URL}/admin/drivers?page=${page}`;

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                const extractedDriversArray = jsonData?.data?.data || [];
                setDriversList(extractedDriversArray);

                setTotalPages(jsonData?.data?.totalPages || 1);
                setCurrentPage(jsonData?.data?.currentPage || 1);
                setTotalDrivers(jsonData?.data?.total || 0);

                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err.message || "Unknown error");
                setIsLoading(false);
            });
    }, [BASE_URL]);

    useEffect(() => {
        fetchDrivers(currentPage);
    }, [currentPage, fetchDrivers]);

    // --- Fetch Drivers Stats ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const endpoint = `${BASE_URL}/admin/drivers-stats`;

        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setDriversStats(jsonData);
            })
            .catch((err) => {
                console.error("Fetch stats error:", err);
            });
    }, [BASE_URL]);

    const entityTypeForModal = "Driver";
    const tabs = [`All ${entityTypeForModal.toLowerCase()}s`, 'Pending'];

    const handleAddDriverSubmit = () => {
        fetchDrivers(currentPage);
        setIsModalOpen(false);
        toast.success("Driver added successfully!");
    };

    const handleStatusUpdate = (reference, currentStatus, firstName) => {
        const isActive = currentStatus === 'active';
        const action = isActive ? 'deactivate' : 'activate';
        if (!window.confirm(`Are you sure you want to ${action} ${firstName}'s account?`)) return;

        const token = localStorage.getItem('token');
        const endpoint = `${BASE_URL}/admin/update-driver-status/${reference}`;

        toast.promise(
            fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: !isActive })
            }).then(response => {
                if (!response.ok) throw new Error(`Failed to ${action} driver`);
                return response.json();
            }).then(() => {
                fetchDrivers(currentPage);
            }),
            {
                loading: `${action === 'activate' ? 'Activating' : 'Deactivating'} driver...`,
                success: `Driver ${action}d successfully!`,
                error: (err) => err.message
            }
        );
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    if (selectedDriverRef) {
        return <DriverDetailsView reference={selectedDriverRef} onBack={() => setSelectedDriverRef(null)} />;
    }

    return (
        <div className="text-gray-800 relative animate-fade-in">
            {/* Stats Header */}
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
                            <p className="text-3xl sm:text-[28px] font-bold">{driversStats?.data?.total || "--"}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-[#A3A3A333]">
                            <h3 className="text-base sm:text-lg font-medium text-gray-700">Active {entityTypeForModal.toLowerCase()}s</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold">{driversStats?.data?.active || "--"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mt-8 min-h-screen flex flex-col">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-[26%] bg-gray-50">
                        <TbFilter size={20} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder={`Filter ${entityTypeForModal.toLowerCase()}s by name, ID, status`}
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-[24px] py-[8px] rounded-[48px] flex items-center justify-center w-full sm:w-auto transition-colors cursor-pointer shadow-sm"
                    >
                        <IoMdAdd size={20} className="mr-1.5" />
                        Add {entityTypeForModal}
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium transition-colors
                                    ${activeTab === tab
                                        ? 'border-neutral-800 text-neutral-900'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full min-w-[900px] text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-4 py-4 font-medium">No.</th>
                                <th scope="col" className="px-4 py-4 font-medium">Car no.</th>
                                <th scope="col" className="px-4 py-4 font-medium">Driver Name</th>
                                <th scope="col" className="px-4 py-4 font-medium">Status</th>
                                <th scope="col" className="px-4 py-4 font-medium">Gender</th>
                                <th scope="col" className="px-4 py-4 font-medium">Location</th>
                                <th scope="col" className="px-4 py-4 font-medium text-right">Earning</th>
                                <th scope="col" className="px-4 py-4 font-medium text-center"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                                            Loading drivers...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-red-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : (() => {
                                const filteredDrivers = driversList.filter(driver => {
                                    // Filter by Tab
                                    if (activeTab === 'Pending' && driver.status !== 'pending') return false;

                                    // Filter by Search Term
                                    if (!searchTerm) return true;
                                    const searchLower = searchTerm.toLowerCase();
                                    const fullName = `${driver.first_name || ''} ${driver.last_name || ''}`.toLowerCase();
                                    return (
                                        fullName.includes(searchLower) ||
                                        (driver.reference && driver.reference.toLowerCase().includes(searchLower)) ||
                                        (driver.status && driver.status.toLowerCase().includes(searchLower)) ||
                                        (driver.car_number_plate && driver.car_number_plate.toLowerCase().includes(searchLower)) ||
                                        (driver.city && driver.city.toLowerCase().includes(searchLower)) ||
                                        (driver.gender && driver.gender.toLowerCase().includes(searchLower))
                                    );
                                });

                                if (filteredDrivers.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan="8" className="text-center py-10 text-gray-500">
                                                No drivers found.
                                            </td>
                                        </tr>
                                    );
                                }

                                return filteredDrivers.map((driver, index) => {
                                    const itemNumber = (currentPage - 1) * 10 + index + 1;

                                    return (
                                        <tr
                                            key={driver.id}
                                            className="bg-white border-b border-gray-50 hover:bg-gray-50/80 cursor-pointer transition-colors"
                                            onClick={() => setSelectedDriverRef(driver.reference)}
                                        >
                                            <td className="px-4 py-4 font-medium text-gray-500">
                                                {String(itemNumber).padStart(2, '0')}
                                            </td>
                                            <td className="px-4 py-4 font-medium text-gray-700">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                    {driver.car_number_plate || '--'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        className="w-8 h-8 rounded-full mr-3 object-cover shadow-sm"
                                                        src={driver?.selfie_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"}
                                                        alt="driver"
                                                    />
                                                    <span className="font-medium text-gray-900">
                                                        {driver.first_name || driver.last_name
                                                            ? `${driver.first_name || ''} ${driver.last_name || ''}`
                                                            : driver.username || '--'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 capitalize">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {driver.status || 'unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 capitalize text-gray-600">{driver.gender || '--'}</td>
                                            <td className="px-4 py-4 text-gray-600">{driver.city || '--'}</td>
                                            <td className="px-4 py-4 font-medium text-gray-900 text-right">
                                                ₦{Number(driver.total_credits || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 text-center relative">
                                                <button
                                                    className="text-gray-400 hover:text-gray-900 p-1 transition-colors relative z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === driver.id ? null : driver.id);
                                                    }}
                                                >
                                                    <BsThreeDotsVertical size={18} />
                                                </button>

                                                {openDropdownId === driver.id && (
                                                    <div
                                                        className="absolute right-4 top-13 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-fade-in"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={() => {
                                                                setSelectedDriverRef(driver.reference);
                                                                setOpenDropdownId(null);
                                                            }}
                                                        >
                                                            <FiEye size={16} className="text-gray-400" />
                                                            View Profile
                                                        </button>
                                                        <button
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={() => {
                                                                handleStatusUpdate(driver.reference, driver.status, driver.first_name);
                                                                setOpenDropdownId(null);
                                                            }}
                                                        >
                                                            <FiPauseCircle size={16} className={driver.status === 'active' ? "text-red-400" : "text-green-400"} />
                                                            {driver.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                                                        </button>
                                                        <div className="border-t border-gray-50 my-1"></div>
                                                        <button
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                            onClick={() => {
                                                                toast.success(`Sending notification to ${driver.first_name}`);
                                                                setOpenDropdownId(null);
                                                            }}
                                                        >
                                                            <FiBell size={16} className="text-gray-400" />
                                                            Send Notifications
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 gap-4">
                        <span className="text-sm text-gray-500">
                            Showing page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                            {' '}({totalDrivers} total drivers)
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-600 shadow-sm"
                            >
                                <FiChevronLeft size={16} />
                                {/* Previous */}
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-600 shadow-sm"
                            >
                                {/* Next */}
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AddDriverModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddSuccess={handleAddDriverSubmit}
                entityType={entityTypeForModal}
            />
        </div>
    );
};

export default DriversContent;