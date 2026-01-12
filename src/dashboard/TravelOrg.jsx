import React, { useState } from 'react';
import { TbFilter } from 'react-icons/tb';
import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import AddTravelOrganizationForm from './TravelOrg/AddTravelOrganizationForm ';

const TodayTag = () => (
    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
        Today
    </span>
);

const partnersTableData = Array.from({ length: 10 }, (_, i) => ({
    id: `p${i + 1}`,
    no: `${String(i + 1).padStart(2, '0')}`,
    name: 'ACME Corporation',
    employeeAccount: 120,
    profitsMade: '$ 35.44',
}));


const TravelOrgContent = () => {
    const [showAddOrganizationForm, setShowAddOrganizationForm] = useState(false);

    if (showAddOrganizationForm) {
        return <AddTravelOrganizationForm onBack={() => setShowAddOrganizationForm(false)} />;
    }

    // const [activeTab, setActiveTab] = useState('All'); 

    return (
        <div className="text-gray-800  min-h-screen font-sans">
            <div className='bg-[#F8F7F1] p-6 sm:p-8'>
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Travel Organizations</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white p-5 sm:p-4 rounded-xl shadow-md flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-200">
                            <h3 className="text-base sm:text-[17px] font-medium text-gray-700">Total Organizations</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold text-gray-900">12</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 sm:p-4 rounded-xl shadow-md flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-200">
                            <h3 className="text-base sm:text-[17px] font-medium text-gray-700">Total Registered Employees</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold text-gray-900">30</p>
                        </div>
                    </div>
                    {/* Emails Managed Card */}
                    <div className="bg-white p-5 sm:p-4 rounded-xl shadow-md flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-200">
                            <h3 className="text-base sm:text-[17px] font-medium text-gray-700">Emails Managed</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl sm:text-[28px] font-bold text-gray-900">12</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:max-w-[30%] bg-gray-50">
                        <TbFilter size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Filter by travel type, Gender, State"
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
                        />
                    </div>
                    <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-4 py-2 rounded-[48px] flex items-center justify-center w-full sm:w-auto transition-colors"
                        onClick={() => setShowAddOrganizationForm(true)}
                    >
                        <FiPlus size={18} className="mr-1.5" />
                        Add Organization
                    </button>
                </div>


                <div className="overflow-x-auto">
                    <table className="w-full min-w-[768px] text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-transparent">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">No.</th>
                                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                                <th scope="col" className="px-4 py-3 font-medium">Employee account</th>
                                <th scope="col" className="px-4 py-3 font-medium">Profits made</th>
                                <th scope="col" className="px-4 py-3 font-medium text-center">Actions</th>
                                <th scope="col" className="px-2 py-3 font-medium"></th> {/* For the three-dots menu icon */}
                            </tr>
                        </thead>
                        <tbody>
                            {partnersTableData.map((partner) => (
                                <tr key={partner.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{partner.no}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{partner.name}</td>
                                    <td className="px-4 py-3 text-gray-700">{partner.employeeAccount}</td>
                                    <td className="px-4 py-3 text-gray-700">{partner.profitsMade}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                                                View details
                                            </button>
                                            <button className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                                                Add Employee
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <BsThreeDotsVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TravelOrgContent;