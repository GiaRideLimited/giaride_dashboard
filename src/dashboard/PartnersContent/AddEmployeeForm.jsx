// import React from 'react';
// import { FiChevronRight } from 'react-icons/fi';

// const AddEmployeeForm = ({ onBack, onBackToPartners }) => {
//     return (
//         <div className="bg-white p-6 sm:p-10 min-h-screen animate-fade-in">
//             {/* Breadcrumb Header */}
//             <div className="flex items-center gap-2 mb-8 text-sm">
//                 <button
//                     onClick={onBackToPartners}
//                     className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
//                 >
//                     Partners
//                 </button>
//                 <FiChevronRight className="text-gray-400" />
//                 <button
//                     onClick={onBack}
//                     className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
//                 >
//                     ACME Org.
//                 </button>
//                 <FiChevronRight className="text-gray-400" />
//                 <span className="font-bold text-gray-900">Add Employee</span>
//             </div>

//             {/* Form Container */}
//             <form className="max-w-4xl">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">

//                     {/* Full Name */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm text-gray-500 font-medium">Full Name</label>
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
//                     type="button"
//                     className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm"
//                 >
//                     Create
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddEmployeeForm;


import React, { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const AddEmployeeForm = ({ onBack, onBackToPartners, organizationId = 8 }) => {
    // 1. State for form data matching API structure
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address_1: '',
        city: '',
        state: '',
        country: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    // 2. Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Prepare payload exactly as shown in Postman
        const payload = {
            ...formData,
            organization_id: organizationId // Passed as prop or defaulted to 8 (from screenshot)
        };

        try {
            const response = await fetch(`${BASE_URL}/admin/employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Uncomment if auth is needed
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create employee');
            }

            alert('Employee created successfully!');
            onBack(); // Go back to the details view

        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-10 min-h-screen animate-fade-in">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 mb-8 text-sm">
                <button
                    onClick={onBackToPartners}
                    type="button"
                    className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    Partners
                </button>
                <FiChevronRight className="text-gray-400" />
                <button
                    onClick={onBack}
                    type="button"
                    className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    ACME Org.
                </button>
                <FiChevronRight className="text-gray-400" />
                <span className="font-bold text-gray-900">Add Employee</span>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">

                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-500 font-medium">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
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

                    {/* Phone Number (Added based on JSON) */}
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
                            name="address_1"
                            value={formData.address_1}
                            onChange={handleChange}
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
                    className="w-full bg-black hover:bg-gray-700 text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    );
};

export default AddEmployeeForm;