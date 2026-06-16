import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiLock,
  FiSettings,
  FiChevronDown,
  FiMail,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiPlus,
  FiFilter,
  FiArrowLeft,
} from 'react-icons/fi';
import MembersList from './settings/MembersList';
import ProfileInformationForm from './settings/ProfileInformationForm';
import PasswordSettingsForm from './settings/PasswordSettingsForm';

const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

// Sidebar Navigation Item Component (remains the same)
const SettingsNavItem = ({ icon, text, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full text-left px-4 py-2.5 my-1 rounded-lg transition-colors duration-150 text-sm relative
      ${isActive
        ? 'bg-gray-100 text-gray-900 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }
    `}
  >
    {isActive && (
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-lg"></span>
    )}
    {React.cloneElement(icon, { size: 20, className: `mr-3 ${isActive ? 'ml-2' : ''}` })}
    <span>{text}</span>
  </button>
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

const ToggleSwitch = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ease-in-out focus:outline-none
        ${enabled ? 'bg-black' : 'bg-gray-300'}
      `}
    >
      <span
        className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform duration-200 ease-in-out
          ${enabled ? 'translate-x-4.5' : 'translate-x-0.5'} 
        `} // translate-x-4.5 is approx for a w-9 parent and w-3.5 child
      />
    </button>
  </div>
);

// const PasswordSettingsForm = () => {
//   const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   return (
//     <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//       <InputField
//         placeholder="Current Password"
//         type={showCurrent ? 'text' : 'password'}
//         name="current"
//         value={passwords.current}
//         onChange={handleChange}
//         onToggleVisibility={() => setShowCurrent(!showCurrent)}
//         showPassword={showCurrent}
//       />
//       <InputField
//         placeholder="New Password"
//         type={showNew ? 'text' : 'password'}
//         name="new"
//         value={passwords.new}
//         onChange={handleChange}
//         onToggleVisibility={() => setShowNew(!showNew)}
//         showPassword={showNew}
//       />
//       <InputField
//         placeholder="Confirm New Password"
//         type={showConfirm ? 'text' : 'password'}
//         name="confirm"
//         value={passwords.confirm}
//         onChange={handleChange}
//         onToggleVisibility={() => setShowConfirm(!showConfirm)}
//         showPassword={showConfirm}
//       />
//       <button
//         type="submit"
//         className="w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-6"
//       >
//         Save changes
//       </button>
//     </form>
//   );
// };

const NewMemberForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || !formData.role || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/admin/account/super-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create member");
      }

      toast.success("Member created successfully!");
      onBack();
    } catch (error) {
      console.error("Create Member Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-black transition-colors text-xs font-medium"
      >
        <FiArrowLeft className="mr-2" /> Back to members
      </button>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            placeholder="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <InputField
            placeholder="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <InputField
          placeholder="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          placeholder="Phone Number"
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          icon={<FiPhone />}
        />
        <SelectField
          placeholder="Role"
          options={roleOptions}
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        <InputField
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          icon={<FiLock />}
          onToggleVisibility={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-bold text-sm py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors duration-150 mt-8 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding member..." : "Add member"}
        </button>
      </form>
    </div>
  );
};

const GeneralSettingsForm = () => {
  const [notifications, setNotifications] = useState({
    sms: false,
    email: true,
    accountLogin: false,
    otp: false,
    verificationCode: false,
    transactions: true,
    profileUpdates: true,
    helpSupport: true,
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="divide-y divide-gray-200">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Notify me via</h3>
        <ToggleSwitch label="SMS" enabled={notifications.sms} onChange={() => handleToggle('sms')} />
        <ToggleSwitch label="Email" enabled={notifications.email} onChange={() => handleToggle('email')} />
      </div>
      <div className="pt-4 mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Allow GiaRide notify me for</h3>
        <ToggleSwitch label="Account Login" enabled={notifications.accountLogin} onChange={() => handleToggle('accountLogin')} />
        <ToggleSwitch label="OTP" enabled={notifications.otp} onChange={() => handleToggle('otp')} />
        <ToggleSwitch label="Verification Code" enabled={notifications.verificationCode} onChange={() => handleToggle('verificationCode')} />
        <ToggleSwitch label="Transactions" enabled={notifications.transactions} onChange={() => handleToggle('transactions')} />
        <ToggleSwitch label="Profile Updates" enabled={notifications.profileUpdates} onChange={() => handleToggle('profileUpdates')} />
        <ToggleSwitch label="Help & Support" enabled={notifications.helpSupport} onChange={() => handleToggle('helpSupport')} />
      </div>
    </div>
  );
};


const SettingsContent = () => {
  const [activeSetting, setActiveSetting] = useState('My Profile');
  const [membersView, setMembersView] = useState('list'); // 'list' or 'add'

  const settingsNav = [
    { text: 'My Profile', icon: <FiUser />, content: <ProfileInformationForm /> },
    { text: 'Password', icon: <FiLock />, content: <PasswordSettingsForm /> },
    { text: 'Settings', icon: <FiSettings />, content: <GeneralSettingsForm /> },
    {
      text: 'Members',
      icon: <FiUsers />,
      content: membersView === 'list' ? (
        <MembersList onAddNew={() => setMembersView('add')} />
      ) : (
        <NewMemberForm onBack={() => setMembersView('list')} />
      )
    },
  ];

  const currentItem = settingsNav.find(nav => nav.text === activeSetting);
  const currentContent = currentItem?.content;

  const getTitle = () => {
    if (activeSetting === "My Profile") return "Profile information";
    if (activeSetting === "Members" && membersView === "add") return "New Member";
    return activeSetting;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-center gap-6 md:gap-8 p-4 sm:p-6 md:p-10 bg-[#F9FAFB] min-h-screen font-sans">
      <div className="w-full md:w-56 lg:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6 lg:pr-8">
        <nav>
          {settingsNav.map((item) => (
            <SettingsNavItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              isActive={activeSetting === item.text}
              onClick={() => {
                setActiveSetting(item.text);
                setMembersView('list'); // Reset sub-view when changing tabs
              }}
            />
          ))}
        </nav>
      </div>

      <div className="w-full md:max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-10">
          {getTitle()}
        </h1>

        {(activeSetting === "My Profile" || activeSetting === "Password" || (activeSetting === "Members" && membersView === "add")) && (
          <h2 className="text-md font-semibold text-gray-800 mb-6">
            Personal Information
          </h2>
        )}
        {activeSetting === "Settings" && (
          <h2 className="text-md font-semibold text-gray-800 mb-6">
            Notifications Management
          </h2>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {currentContent}
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;