import React, { useEffect, useState } from 'react';
import { TbFilter } from 'react-icons/tb';
import { FiPlus } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';



// Added onAddPartner prop here
const PartnersListView = ({ onViewDetails, onAddPartner, onAddEmployee }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [partnersStats, setPartnersStats] = useState(null);
    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;




    const partnersTableData = Array.from({ length: 6 }, (_, i) => ({
        id: `p${i + 1}`,
        no: `${String(i + 1).padStart(2, '0')}`,
        name: 'ACME Corporation',
        employeeAccount: 120,
        profitsMade: '$ 35.44',
    }));

    const TodayTag = () => (
        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Today
        </span>
    );


    useEffect(() => {
        const endpoint = (`${BASE_URL}/admin/partner-stat`);
        fetch(endpoint)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setPartnersStats(jsonData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError(err.message || "Unknown error");
                setIsLoading(false);
            });
    }, []);

    console.log("partnersStats", partnersStats)

    return (
        <>
            <div className='bg-[#F8F7F1] p-6 sm:p-8'>
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Partners</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-4xl">
                    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between h-36">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-100">
                            <h3 className="text-base font-medium text-gray-600">Total Partners</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{partnersStats?.data?.partner}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between h-36">
                        <div className="flex justify-between items-start mb-2 pb-3 border-b border-gray-100">
                            <h3 className="text-base font-medium text-gray-600">Total Registered Employees</h3>
                            <TodayTag />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{partnersStats?.data?.employee}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:max-w-[30%] bg-gray-50">
                        <TbFilter size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Filter by travel type, Gender, State"
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
                        />
                    </div>
                    {/* Updated Button with onClick Handler */}
                    <button
                        onClick={onAddPartner}
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-4 py-2 rounded-full flex items-center justify-center w-full sm:w-auto transition-colors"
                    >
                        <FiPlus size={18} className="mr-1.5" />
                        Add Partner
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
                                <th scope="col" className="px-2 py-3 font-medium"></th>
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
                                            <button
                                                onClick={onViewDetails}
                                                className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                                            >
                                                View details
                                            </button>
                                            {/* <button className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                                                Add Employee
                                            </button> */}
                                            <button
                                                onClick={onAddEmployee} // Add this onClick
                                                className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-md..."
                                            >
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
        </>
    );
};

export default PartnersListView;