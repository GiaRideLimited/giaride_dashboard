// src/components/NotificationsContent.jsx
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TbFilter } from 'react-icons/tb';
import { IoMdAdd, IoMdClose } from 'react-icons/io'; // Added IoMdClose
import { BsThreeDotsVertical, BsCheckCircleFill } from 'react-icons/bs'; // Added BsCheckCircleFill
import { FiChevronDown, FiCheck } from 'react-icons/fi'; // Added FiCheck
import { formatDate } from '../utils/formatDate';

const notificationsTableData = Array.from({ length: 10 }, (_, i) => ({
  id: `n${i + 1}`,
  no: `${String(i + 1).padStart(2, '0')}`,
  title: 'New account created',
  preview: 'Dear User...',
  targetAudience: 'All users',
  status: 'Sent',
  date: '12-05-2024',
}));

const NewNotificationModal = ({ isOpen, onClose, onSubmitNotification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('RIDER');
  const [reference, setReference] = useState('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalContentRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const MAX_MESSAGE_LENGTH = 240;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
      if (sendToDropdownRef.current && !sendToDropdownRef.current.contains(event.target)) {
        setShowSendToDropdown(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTitle('');
      setMessage('');
      setUserType('RIDER');
      setReference('all');
      setShowTypeDropdown(false);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message || !userType || !reference) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitNotification({ title, message, userType, reference });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userTypeOptions = [
    { value: 'RIDER', label: 'Riders' },
    { value: 'DRIVER', label: 'Drivers' },
    { value: 'ALL', label: 'All Users' },
  ];

  const displayTypeLabel = userTypeOptions.find(opt => opt.value === userType)?.label || 'Select Audience';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-sans">
      <div ref={modalContentRef} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">New Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div className="relative">
            <input
              type="text" id="notificationTitle" value={title} onChange={(e) => setTitle(e.target.value)}
              className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black peer"
              placeholder=" " required
            />
            <label htmlFor="notificationTitle" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-3.5 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-3.5 left-1.5">Title</label>
          </div>
          {/* Message Textarea */}
          <div className="relative">
            <textarea
              id="notificationMessage" rows="4" value={message} onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black peer resize-none"
              placeholder=" " required
            ></textarea>
            <label htmlFor="notificationMessage" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-3.5 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-3.5 left-1.5">Message</label>
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">{message.length}/{MAX_MESSAGE_LENGTH}</div>
          </div>
          {/* User Type Dropdown */}
          <div className="relative" ref={typeDropdownRef}>
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center justify-between w-full px-3.5 py-3 text-sm text-left bg-transparent rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <span className="text-gray-900">{displayTypeLabel}</span>
              <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${showTypeDropdown ? 'rotate-180' : ''}`} size={20} />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1">
                {userTypeOptions.map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => { setUserType(opt.value); setShowTypeDropdown(false); if (opt.value === 'ALL') setReference('all'); }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  >
                    {opt.label}
                    {userType === opt.value && <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>}
                    {userType !== opt.value && <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reference Input */}
          <div className="relative">
            <input
              type="text" id="notificationReference" value={reference} onChange={(e) => setReference(e.target.value)}
              className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black peer"
              placeholder=" " required
            />
            <label htmlFor="notificationReference" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3.5 scale-75 top-3.5 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-3.5 left-1.5">Reference (e.g. 'all' or specific ID)</label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-3 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : 'Send notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, message }) => {
  const modalContentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (modalContentRef.current && !modalContentRef.current.contains(event.target)) { onClose(); } };
    if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div ref={modalContentRef} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"> <IoMdClose size={20} /> </button>
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-5">
          <FiCheck className="h-8 w-8 text-green-600" strokeWidth={3} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification sent</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors"
        >
          Okay
        </button>
      </div>
    </div>
  );
};


const NotificationsContent = () => {
  const [activeTab, setActiveTab] = useState('All Notifications');
  const [isNewNotificationModalOpen, setIsNewNotificationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');



  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;


  useEffect(() => {
    const endpoint = (`${BASE_URL}/admin/notification`);
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


  const tabs = ['All Notifications', 'Account activation', 'Ride assignment', 'Document verification'];

  const handleNewNotificationSubmit = async (notificationData) => {
    const token = localStorage.getItem('token');
    const payload = {
      userType: notificationData.userType,
      reference: notificationData.reference,
      title: notificationData.title,
      content: notificationData.message,
    };

    try {
      const endpoint = `${BASE_URL}/admin/notification`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send notification');
      }

      const audienceLabel = notificationData.reference === 'all'
        ? (notificationData.userType === 'ALL' ? 'all users' : `all ${notificationData.userType.toLowerCase()}s`)
        : `user ${notificationData.reference}`;

      setSuccessMessage(`You have successfully sent a notification to ${audienceLabel}`);
      setIsNewNotificationModalOpen(false);
      setIsSuccessModalOpen(true);
      // Refresh by reloading or just skip since GET logic shouldn't change
      // window.location.reload(); 
      toast.success("Notification sent successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to send notification");
    }
  };

  console.log('data', data)

  return (
    <div className="text-gray-800">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto max-w-xs sm:max-w-sm"> {/* Adjusted width */}
            <TbFilter size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Filter by type, recipient, or status"
              className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
            />
          </div>
          <button
            onClick={() => setIsNewNotificationModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-4 py-2.5 rounded-full flex items-center justify-center w-full sm:w-auto transition-colors" /* rounded-full as per image */
          >
            <IoMdAdd size={20} className="mr-1.5" />
            New notification
          </button>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-6 -mb-px overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium ${activeTab === tab ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}> {tab} </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr> <th scope="col" className="px-4 py-3">No.</th> <th scope="col" className="px-4 py-3">Title</th> <th scope="col" className="px-4 py-3">Preview</th> <th scope="col" className="px-4 py-3">Target/Audience</th> <th scope="col" className="px-4 py-3">Status</th> <th scope="col" className="px-4 py-3">Date</th> <th scope="col" className="px-4 py-3 text-center">Action</th> </tr>
            </thead>
            <tbody>
              {data?.data?.data?.data.map((notification, index) => (
                <tr key={notification.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{notification.title ?? "--"}</td>
                  <td className="px-4 py-3">{notification.content ?? "--"}</td>
                  <td className="px-4 py-3">{notification.targetAudience ?? "--"}</td>
                  <td className="px-4 py-3">{notification.status ?? "--"}</td>
                  <td className="px-4 py-3">{formatDate(notification.created_at)}</td>
                  <td className="px-4 py-3 text-center"> <button className="text-gray-500 hover:text-gray-700"> <BsThreeDotsVertical size={18} /> </button> </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      <NewNotificationModal
        isOpen={isNewNotificationModalOpen}
        onClose={() => setIsNewNotificationModalOpen(false)}
        onSubmitNotification={handleNewNotificationSubmit}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default NotificationsContent;