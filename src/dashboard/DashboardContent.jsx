import React, { useEffect, useState } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TbFilter } from 'react-icons/tb';

const TodayTag = () => (
  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
    Today
  </span>
);

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercentage = 0;
  const radius = 45;
  const strokeWidth = 10;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className="mx-auto">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const offsetPercentage = accumulatedPercentage;
        const strokeDashoffset = circumference - (offsetPercentage / 100) * circumference;
        const segmentLength = (percentage / 100) * circumference;
        const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
        accumulatedPercentage += percentage;
        return (
          <circle
            key={index}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        );
      })}
      <circle cx="50" cy="50" r={innerRadius} fill="white" />
    </svg>
  );
};

const activeRidesData = [
  {
    id: '1',
    no: '01',
    carNo: '6465',
    driver: { name: 'Alex Noman', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    status: { text: 'online', color: 'bg-green-500' },
    gender1: 'Male',
    gender2: 'Male',
    location: 'Lagos',
    cost: '$ 35.44',
  },
  {
    id: '2',
    no: '02',
    carNo: '5665',
    driver: { name: 'Razib Rahman', img: 'https://randomuser.me/api/portraits/men/33.jpg' },
    status: { text: 'offline', color: 'bg-gray-700' },
    gender1: 'Male',
    gender2: 'Male',
    location: 'Abuja',
    cost: '$ 0.00',
  },
  {
    id: '3',
    no: '03',
    carNo: '1755',
    driver: { name: 'Luke Norton', img: 'https://randomuser.me/api/portraits/men/34.jpg' },
    status: { text: 'In route', color: 'bg-red-500' },
    gender1: 'Female',
    gender2: 'Female',
    location: 'Lagos',
    cost: '$ 23.50',
  },
];


const DashboardContent = () => {
  const chartData = [
    { label: 'Hired', value: 54, color: '#3B82F6', change: 'up' },    // Tailwind blue-500
    { label: 'Canceled', value: 20, color: '#10B981', change: 'up' }, // Tailwind green-500 (color of dot in image)
    { label: 'Pending', value: 26, color: '#EF4444', change: 'down' }, // Tailwind red-500
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  useEffect(() => {
    const endpoint = (`${BASE_URL}/admin/active-rides?from=2025-06-19&status=start-trip`);
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
        setDashboardStats(jsonData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
        setIsLoading(false);
      });
  }, []);

  console.log('data', data)


  return (
    <div>
      {/* Todays Statistics Title */}
      <div className="bg-[#F8F7F1] p-8">

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Today's Statistics</h2>
          <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Income Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Income</h3>
              <TodayTag />
            </div>
            <div className="flex items-center mb-1">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mr-2 sm:mr-3">
                $ {dashboardStats?.data?.income ?? "--"}
              </p>

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
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Withdrawals</h3>
              <TodayTag />
            </div>
            <div className="flex items-center mb-1">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mr-2 sm:mr-3">
                $ {dashboardStats?.data?.withdrawal ?? "--"}</p>
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

          {/* Hired vs Cancel Rides Card */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Hired vs Cancel Rides</h3>
              <TodayTag />
            </div>
            <div className="mb-3 sm:mb-4">
              <DonutChart data={chartData} />
            </div>
            {/* MODIFIED LEGEND SECTION START */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 sm:gap-x-5 gap-y-1 text-xs text-gray-700">
              {chartData.map((item) => (
                <div key={item.label} className="flex items-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full mr-1.5"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="mr-1 text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800 mr-0.5">{item.value}%</span>
                  {item.change === 'up' ? (
                    <FiArrowUp className="text-green-500" size={14} strokeWidth={2.5} />
                  ) : (
                    <FiArrowDown className="text-red-500" size={14} strokeWidth={2.5} />
                  )}
                </div>
              ))}
            </div>
            {/* MODIFIED LEGEND SECTION END */}
          </div>
        </div>
      </div>

      {/* --- Active Rides Table Section START --- */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Active Rides</h3>
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
            <TbFilter size={18} className="mr-1.5" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">No.</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Car no.</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Driver</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Status</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Gender</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Location</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Cost</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.data?.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-[#A3A3A340] hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {item.carNo ?? "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <img className="w-7 h-7 rounded-full mr-2 object-cover" src={item.driver.img } alt={item.driverName ?? ""} /> */}
                      <img className="w-7 h-7 rounded-full mr-2 object-cover" src="https://randomuser.me/api/portraits/men/32.jpg" alt={item.driverName ?? ""} />
                      {item.driverName}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* <span className={`w-2.5 h-2.5 rounded-full mr-2 ${item.status.color}`}></span> */}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.gender}</td>
                  {/* <td className="px-4 py-3 whitespace-nowrap">{item.gender2}</td> */}
                  <td className="px-4 py-3 whitespace-nowrap">{item.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.cost}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {/* {activeRidesData.map((ride) => (
                <tr key={ride.id} className="bg-white border-b border-[#A3A3A340] hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{ride.no}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {ride.carNo}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="w-7 h-7 rounded-full mr-2 object-cover" src={ride.driver.img} alt={ride.driver.name} />
                      {ride.driver.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${ride.status.color}`}></span>
                      {ride.status.text}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.gender1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.gender2}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.cost}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors">
                      Details
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
      {/* --- Active Rides Table Section END --- */}

    </div>
  );
};

export default DashboardContent;