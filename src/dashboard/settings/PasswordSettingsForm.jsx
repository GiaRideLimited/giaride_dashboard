import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
        {onToggleVisibility && (
            <button type="button" onClick={onToggleVisibility} className="text-gray-400 hover:text-gray-600 ml-2">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        )}
    </div>
);

const PasswordSettingsForm = () => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // [1] Basic validation
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error('Please fill in all fields');
            return;
        }

        // [2] Check new passwords match before hitting the API
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // [3] POST to change-password with the three required fields
            const response = await fetch(`${BASE_URL}/admin/account/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    old_password: passwords.current,
                    new_password: passwords.new,
                    confirm_password: passwords.confirm,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            toast.success(data.message || 'Password updated successfully');

            // [4] Reset form after success
            setPasswords({ current: '', new: '', confirm: '' });

        } catch (err) {
            toast.error(err.message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                placeholder="Current Password"
                type={showCurrent ? 'text' : 'password'}
                name="current"
                value={passwords.current}
                onChange={handleChange}
                onToggleVisibility={() => setShowCurrent(!showCurrent)}
                showPassword={showCurrent}
            />
            <InputField
                placeholder="New Password"
                type={showNew ? 'text' : 'password'}
                name="new"
                value={passwords.new}
                onChange={handleChange}
                onToggleVisibility={() => setShowNew(!showNew)}
                showPassword={showNew}
            />
            <InputField
                placeholder="Confirm New Password"
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                onToggleVisibility={() => setShowConfirm(!showConfirm)}
                showPassword={showConfirm}
            />

            {/* [5] Button shows loading state */}
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

export default PasswordSettingsForm;