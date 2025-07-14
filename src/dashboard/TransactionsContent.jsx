// src/components/TransactionsContent.jsx
import React, { useState, useEffect } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'; // For stats cards
import { TbFilter } from 'react-icons/tb'; // For table filter
import { BsThreeDotsVertical } from 'react-icons/bs'; // For table action menu

// Helper component for the "Today" tag on stats cards
const TodayTag = () => (
  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
    Today
  </span>
);




const transactionsTableData = [
  { id: 't1', no: '01', reference: '6465', user: 'Alex Noman', userImg: 'https://randomuser.me/api/portraits/men/32.jpg', userType: 'Driver', amount: '$40', type: 'Fund', charges: '$1.44', date: '12-09-2024', time: '12:00pm' },
  { id: 't2', no: '02', reference: '5665', user: 'Razib Rahman', userImg: 'https://randomuser.me/api/portraits/men/33.jpg', userType: 'Rider', amount: '$50', type: 'Drop', charges: '$0.99', date: '12-09-2024', time: '1:00pm' },
  { id: 't3', no: '01', reference: '6465', user: 'Alex Noman', userImg: 'https://randomuser.me/api/portraits/men/32.jpg', userType: 'Driver', amount: '$40', type: 'Fund', charges: '$1.44', date: '12-09-2024', time: '12:00pm' },
  { id: 't4', no: '02', reference: '5665', user: 'Razib Rahman', userImg: 'https://randomuser.me/api/portraits/men/33.jpg', userType: 'Rider', amount: '$50', type: 'Drop', charges: '$0.99', date: '12-09-2024', time: '1:00pm' },
  { id: 't5', no: '01', reference: '6465', user: 'Alex Noman', userImg: 'https://randomuser.me/api/portraits/men/32.jpg', userType: 'Driver', amount: '$40', type: 'Fund', charges: '$1.44', date: '12-09-2024', time: '12:00pm' },
  { id: 't6', no: '02', reference: '5665', user: 'Razib Rahman', userImg: 'https://randomuser.me/api/portraits/men/33.jpg', userType: 'Rider', amount: '$50', type: 'Drop', charges: '$0.99', date: '12-09-2024', time: '1:00pm' },
  { id: 't7', no: '01', reference: '6465', user: 'Alex Noman', userImg: 'https://randomuser.me/api/portraits/men/32.jpg', userType: 'Driver', amount: '$40', type: 'Fund', charges: '$1.44', date: '12-09-2024', time: '12:00pm' },
  { id: 't8', no: '02', reference: '5665', user: 'Razib Rahman', userImg: 'https://randomuser.me/api/portraits/men/33.jpg', userType: 'Rider', amount: '$50', type: 'Drop', charges: '$0.99', date: '12-09-2024', time: '1:00pm' },
];




const TransactionsContent = () => {
  const [activeTab, setActiveTab] = useState('Income');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionStats, setTransactionStats] = useState(null);

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  useEffect(() => {
    const endpoint = 
    activeTab === "Income" ? (`${BASE_URL}/admin/transactions/earnings`) :(`${BASE_URL}/admin/transactions/withdrawals`);
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
  }, [activeTab]);


  useEffect(() => {
    const endpoint = (`${BASE_URL}/admin/transactions/statistics`);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setTransactionStats(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setIsLoading(false);
      });
  }, []);

console.log(data)
  const tableTabs = ['Income', 'Withdrawals'];

  return (
    <div className="text-gray-800">
      {/* Todays Statistics Title & Cards */}
      <div className="bg-[#F8F7F1] p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Today's Statistics</h2>
          <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Income</h3>
              <TodayTag />
            </div>
            <div className="flex items-center mb-1">
              <p className="text-2xl sm:text-3xl font-bold mr-2 sm:mr-3">$ {transactionStats?.data?.income || "0"}</p>
              <span className="flex items-center text-xs sm:text-sm text-red-500 font-semibold">
                <FiArrowDown className="mr-0.5 sm:mr-1" /> 1.5%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2 sm:mb-3">Compared to $9940 yesterday</p>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Last week Income</span>
              <span className="font-medium">$25658.00</span>
            </div>
          </div>
          {/* Withdrawals Card */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Withdrawals</h3>
              <TodayTag />
            </div>
            <div className="flex items-center mb-1">
              <p className="text-2xl sm:text-3xl font-bold mr-2 sm:mr-3">$ {transactionStats?.data?.withdrawal || "0"}</p>
              <span className="flex items-center text-xs sm:text-sm text-green-500 font-semibold">
                <FiArrowUp className="mr-0.5 sm:mr-1" /> 2.5%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2 sm:mb-3">Compared to $5240 yesterday</p>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Last week expences</span>
              <span className="font-medium">$22658.00</span>
            </div>
          </div>
        </div>
      </div>


      {/* Transactions Table Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        {/* Top Bar: Filter */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:max-w-[30%]">
            <TbFilter size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Filter drivers by name, ID, status" // Placeholder text from image seems generic
              className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
            />
          </div>
        </div>

        {/* Tabs for Table */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
            {tableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium cursor-pointer
                  ${activeTab === tab
                    ? 'border-gray-800 text-gray-900' // Active tab style from image (darker underline)
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* { isLoading &&  <p>Loading…</p>} */}
          <table className="w-full min-w-[1024px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3">No.</th>
                <th scope="col" className="px-4 py-3">Reference</th>
                <th scope="col" className="px-4 py-3">User (Driver/Rider)</th>
                <th scope="col" className="px-4 py-3">User Type</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Charges</th>
                <th scope="col" className="px-4 py-3">Date</th>
                <th scope="col" className="px-4 py-3">Time</th>
                <th scope="col" className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.data?.map((transaction) => (
                <tr key={transaction?.id} className="bg-white border-b border-[#A3A3A340] hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{transaction.id || "--"}</td>
                  <td className="px-4 py-3 truncate max-w-[160px]">
                    <span className=" bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {transaction?.reference || "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img className="w-7 h-7 rounded-full mr-2.5 object-cover" src={transaction?.userImg || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7csvPWMdfAHEAnhIRTdJKCK5SPK4cHfskow&s"} alt={transaction?.user.first_name || "--"} />
                      <span className="font-medium text-gray-900">{transaction?.user.first_name || "--"} {transaction?.user.last_name || "--"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{transaction?.user.type || "--"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{transaction?.amount || "--"}</td>
                  <td className="px-4 py-3">{transaction?.payment_type || "--"}</td>
                  <td className="px-4 py-3">{transaction?.charges}</td>
                  <td className="px-4 py-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(transaction.created_at).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-gray-500 hover:text-gray-700">
                      <BsThreeDotsVertical size={18} />
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

export default TransactionsContent;