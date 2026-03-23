import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditRiderModal = ({ isOpen, onClose, rider, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        username: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    useEffect(() => {
        if (rider) {
            setFormData({
                first_name: rider.first_name || '',
                last_name: rider.last_name || '',
                middle_name: rider.middle_name || '',
                gender: rider.gender || '',
                username: rider.username || ''
            });
        }
    }, [rider, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = localStorage.getItem('token');
        const endpoint = `${BASE_URL}/admin/update-rider/${rider.reference}`;

        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update rider');
            }

            toast.success("Rider profile updated successfully!");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Edit Rider Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Middle Name</label>
                        <input
                            type="text"
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            placeholder="Optional"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium appearance-none"
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-colors shadow-lg shadow-black/10"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRiderModal;
