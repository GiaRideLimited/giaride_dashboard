import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {

    FiChevronDown,

    FiPlus,
    FiFilter,
} from 'react-icons/fi';

const MembersList = ({ onAddNew }) => {
    const members = [
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
        { name: 'John Doe', email: 'johndoe@giaride.com.ng', role: 'Super Admin' },
    ];
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;


    useEffect(() => {
        const endpoint = (`${BASE_URL}/admin/`);
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

    console.log('data for members', data)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <button className="flex items-center text-gray-500 text-xs border border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <FiFilter className="mr-2" size={14} />
                    Filter by travel type, Gender, State
                </button>
                <button
                    onClick={onAddNew}
                    className="bg-[#FFD700] hover:bg-[#FFC700] text-black font-bold py-2.5 px-5 rounded-lg flex items-center text-sm transition-colors duration-200"
                >
                    <FiPlus className="mr-2" size={18} />
                    Add New Admin
                </button>
            </div>

            <div className="bg-white rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">No.</th>
                                <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</th>
                                <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.map((member, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="px-6 py-4 text-xs text-gray-900 font-semibold">{member.name}</td>
                                    <td className="px-6 py-4 text-xs text-gray-600">{member.email}</td>
                                    <td className="px-6 py-4 text-xs text-gray-600">{member.role}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 px-2">
                <span className="text-[10px] text-gray-400 font-medium">Page 1 of 1</span>
                <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-300 hover:text-gray-500"><FiChevronDown className="rotate-90" size={14} /></button>
                    <button className="w-6 h-6 flex items-center justify-center bg-gray-100 text-black text-[10px] rounded font-bold">1</button>
                    <button className="p-1 text-gray-300 hover:text-gray-500"><FiChevronDown className="-rotate-90" size={14} /></button>
                </div>
            </div>
        </div>
    );
};

export default MembersList;