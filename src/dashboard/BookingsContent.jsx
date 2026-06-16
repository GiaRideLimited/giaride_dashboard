// src/components/BookingsContent.jsx
import React, { useEffect, useState } from 'react';
import { TbFilter } from 'react-icons/tb';
import { IoMdAdd } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';

const TodayTag = () => (
  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
    Today
  </span>
);

const BookingsContent = () => {
  const [activeTab, setActiveTab] = useState('All bookings');
  const tabs = ['All bookings', 'Pending bookings'];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  useEffect(() => {
    fetch(`${BASE_URL}/admin/bookingstats`)
      .then((res) => { if (!res.ok) throw new Error(`Server responded with ${res.status}`); return res.json(); })
      .then((jsonData) => { setBookingStats(jsonData); setIsLoading(false); })
      .catch((err) => { setError(err.message || 'Unknown error'); setIsLoading(false); });
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/admin/bookings`)
      .then((res) => { if (!res.ok) throw new Error(`Server responded with ${res.status}`); return res.json(); })
      .then((jsonData) => { setData(jsonData); setIsLoading(false); })
      .catch((err) => { setError(err.message || 'Unknown error'); setIsLoading(false); });
  }, []);

  const activeBookings =
    activeTab === 'All bookings'
      ? data?.data?.bookings?.data ?? []
      : data?.data?.pendingBookings ?? [];
  console.log("pending bookings", data)
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '—';

  const formatFare = (amount) =>
    amount != null ? `₦${Number(amount).toLocaleString()}` : '—';

  const getTravelType = (mode) => {
    const map = { road: 'Bus Travel', air: 'Air Travel', rail: 'Train Travel', sea: 'Water Travel' };
    return map[mode] ?? mode;
  };

  return (
    <div className="text-gray-800">
      <div className="bg-[#F8F7F1] p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Bookings</h2>
          <p className="text-xs sm:text-sm text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {bookingStats?.data && Object.entries(bookingStats.data).map(([key, value], index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start border-b border-[#A3A3A333] mb-2 pb-3">
                <h3 className="text-base sm:text-lg font-medium text-gray-700 capitalize">{key}</h3>
                <TodayTag />
              </div>
              <div>
                <p className="text-[28px] font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:max-w-[30%]">
            <TbFilter size={20} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Filter by travel type, Gender, State"
              className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent"
            />
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold px-4 py-2.5 rounded-[48px] flex items-center justify-center w-full sm:w-auto transition-colors">
            <IoMdAdd size={20} className="mr-1.5" />
            Add New Booking
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium
                  ${activeTab === tab
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {isLoading && <p className="text-sm text-gray-500 py-6 text-center">Loading bookings...</p>}
        {error && <p className="text-sm text-red-500 py-6 text-center">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1024px] text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Customer name</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Travel type</th>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Arrival</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Fare</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  activeBookings.map((booking, index) => (
                    <tr key={booking.id} className="bg-white border-b border-[#A3A3A340] hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{String(index + 1).padStart(2, '0')}</td>

                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full mr-2.5 bg-yellow-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                            {booking.Rider?.first_name?.[0] ?? '?'}
                          </div>
                          <span className="font-medium text-gray-900">
                            {booking.Rider?.first_name ?? '—'} {booking.Rider?.last_name ?? ''}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 capitalize">{booking.Rider?.gender ?? '—'}</td>

                      <td className="px-4 py-3">{getTravelType(booking.TravelTrip?.mode)}</td>

                      <td className="px-4 py-3">{booking.TravelTrip?.departure ?? '—'}</td>
                      <td className="px-4 py-3">{booking.TravelTrip?.destination ?? '—'}</td>

                      <td className="px-4 py-3">{formatDate(booking.TravelTrip?.departure_date_time)}</td>

                      <td className="px-4 py-3">{formatFare(booking.total_ticket_amount)}</td>

                      <td className="px-4 py-3 text-center">
                        <button className="text-gray-500 hover:text-gray-700">
                          <BsThreeDotsVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsContent;