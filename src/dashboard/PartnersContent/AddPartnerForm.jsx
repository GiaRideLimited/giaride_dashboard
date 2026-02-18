// import React from 'react';
// import { FiChevronRight } from 'react-icons/fi';

// const AddPartnerForm = ({ onBack }) => {
//     return (
//         <div className="bg-white p-6 sm:p-10 min-h-screen animate-fade-in">
//             {/* Breadcrumb Header */}
//             <div className="flex items-center gap-2 mb-8 text-sm">
//                 <button
//                     onClick={onBack}
//                     className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
//                 >
//                     Partners
//                 </button>
//                 <FiChevronRight className="text-gray-400" />
//                 <span className="font-bold text-gray-900">Add partner</span>
//             </div>

//             {/* Form Container */}
//             <form className="max-w-4xl">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">

//                     {/* Name of Organization */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">Name of Organization</label>
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>

//                     {/* Email Address */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">Email Address</label>
//                         <input
//                             type="email"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>

//                     {/* Address */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">Address</label>
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>

//                     {/* City */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">City</label>
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>

//                     {/* State */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">State</label>
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>

//                     {/* Country */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">Country</label>
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
//                         />
//                     </div>
//                 </div>

//                 {/* Create Button */}
//                 <button
//                     type="button" // Change to submit if handling form submission
//                     className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm"
//                 >
//                     Create
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddPartnerForm;

import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast'; 

const AddPartnerForm = ({ onBack }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        phone_number: '',
        company_address: '',
        city: '',
        state: '',
        country: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            type: "partner"
        };

        const apiPromise = fetch(`${BASE_URL}/admin/add-partner-organization`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create partner');
            }
            return response.json();
        });

        toast.promise(apiPromise, {
            loading: 'Creating partner...',
            success: 'Partner Organization created successfully!',
            error: (err) => `Error: ${err.message}`
        })
            .then(() => {
                setTimeout(() => {
                    onBack();
                }, 1500);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="bg-white p-6 sm:p-10 min-h-screen animate-fade-in relative">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 mb-8 text-sm">
                <button
                    onClick={onBack}
                    type="button"
                    className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    Partners
                </button>
                <FiChevronRight className="text-gray-400" />
                <span className="font-bold text-gray-900">Add partner</span>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">

                    {/* Name of Organization */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Name of Organization</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Address</label>
                        <input
                            type="text"
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* City */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>
                </div>

                {/* Create Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    );
};

export default AddPartnerForm;