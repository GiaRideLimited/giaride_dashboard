import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiChevronDown, FiMail, FiPhone } from 'react-icons/fi';


const SelectField = ({ placeholder, options, value, onChange, name }) => (
    <div className="relative flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent appearance-none pr-8 cursor-pointer"
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        <FiChevronDown size={18} className="text-gray-500 absolute right-3.5 pointer-events-none" />
    </div>
);

const InputField = ({ placeholder, icon, type = 'text', value, onChange, name, children, onToggleVisibility, showPassword }) => (
    <div className="flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
        {icon && React.cloneElement(icon, { size: 18, className: 'text-gray-500 mr-2.5 flex-shrink-0' })}
        {children || (
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent"
            />
        )}
        {onToggleVisibility && ( // Render eye icon if onToggleVisibility is provided
            <button type="button" onClick={onToggleVisibility} className="text-gray-400 hover:text-gray-600 ml-2">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        )}
    </div>
);

const ProfileInformationForm = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', age: '', gender: '', email: '', phone: '+234',
    });
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.gender) {
            toast.error('Please select a gender');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            console.log('token being sent:', token); // 👈 add here
            const response = await fetch(`${BASE_URL}/admin/account/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // [3] Attach token from localStorage if your API requires auth
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ gender: formData.gender }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Error ${response.status}`);
            }

            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <InputField placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <InputField placeholder="Age" type="number" name="age" value={formData.age} onChange={handleChange} />

            {/* [4] Gender is the only active field tied to the API */}
            <SelectField placeholder="Gender" options={genderOptions} name="gender" value={formData.gender} onChange={handleChange} />

            <InputField placeholder="Email" type="email" icon={<FiMail />} name="email" value={formData.email} onChange={handleChange} />
            <InputField icon={<FiPhone />}>
                <div className="flex items-center w-full">
                    <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">+234</span>
                    <span className="text-gray-400 mr-2">|</span>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone.startsWith('+234') ? formData.phone.substring(4) : formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: '+234' + e.target.value.replace(/\D/g, '') }))}
                        className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent"
                    />
                </div>
            </InputField>

            {/* [5] Button shows loading state while request is in flight */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Saving...' : 'Save changes'}
            </button>
        </form>
    );
};

export default ProfileInformationForm;