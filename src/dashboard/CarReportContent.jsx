// // src/components/CarReportContent.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import { TbFilter } from 'react-icons/tb';
// import {
//   BsThreeDotsVertical,
//   BsEye,
//   BsTools,
//   BsCheckCircle,
//   BsTrash,
// } from 'react-icons/bs';
// import { FiCommand, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi'; // Added FiArrowLeft

// // Helper component for the "Today" tag on stats cards
// const TodayTag = () => (
//   <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded"> {/* Adjusted padding */}
//     Today
//   </span>
// );

// // Sample data for the reports table
// const carReportsTableData = Array.from({ length: 8 }, (_, i) => ({
//   id: `cr${i + 1}`,
//   no: '01',
//   user: 'Alex Noman',
//   userImg: 'https://randomuser.me/api/portraits/men/32.jpg',
//   carDetails: 'Toyota Corolla 06',
//   carReg: '646567fg',
//   issueType: 'Oil leak',
//   reportedDate: '12-01-2025,',
//   reportedTime: '10:00am',
//   status: i < 3 ? 'Reported' : 'Resolved',
//   statusColor: i < 3 ? 'bg-red-500' : 'bg-green-500',
//   locationOfIncident: 'Lekki Phase 1',
//   previousReports: 'None',
//   userDescription: 'The car has engine problems, it kept dying and I had to push it off the bridge',
//   images: [
//     'https://img.freepik.com/free-photo/silver-color-sedan-road_114579-5340.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//     'https://img.freepik.com/free-photo/white-modern-sefety-sedan-road_114579-4085.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//     'https://img.freepik.com/free-photo/white-car-front-view_1303-11730.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//     'https://img.freepik.com/free-photo/silver-metallic-color-sport-sedan-road_114579-5034.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//     'https://img.freepik.com/free-photo/silver-color-sedan-road_114579-5340.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//     'https://img.freepik.com/free-photo/white-car-parking-lot_1303-10056.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1720656000&semt=ais_hybrid',
//   ]
// }));

// // --- Action Dropdown Component (remains the same) ---
// const ActionDropdown = ({ reportId, onAction }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } };
//     if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen]);
//   const handleItemClick = (action) => { onAction(reportId, action); setIsOpen(false); };
//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"> <BsThreeDotsVertical size={18} /> </button>
//       {isOpen && (
//         <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl z-20 border border-gray-100 py-1.5">
//           <button onClick={() => handleItemClick('view')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"> <BsEye size={16} className="mr-3 text-gray-500" /> View </button>
//           <button onClick={() => handleItemClick('assign_mechanic')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"> <BsTools size={16} className="mr-3 text-gray-500" /> Assign Mechanic </button>
//           <button onClick={() => handleItemClick('mark_resolved')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"> <BsCheckCircle size={16} className="mr-3 text-gray-500" /> Mark as Resolved </button>
//           <div className="my-1.5 mx-2 border-t border-gray-200"></div>
//           <button onClick={() => handleItemClick('delete')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-between transition-colors">
//             <div className="flex items-center"> <BsTrash size={16} className="mr-3" /> Delete </div>
//             <div className="flex items-center text-xs text-gray-400 border border-gray-300 rounded px-1 py-0.5"> <FiCommand size={10} className="mr-0.5" /> X </div>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
// // --- End Action Dropdown Component ---


// // --- View Car Report Detail Page Component ---
// const ViewCarReportDetail = ({ reportData, onBack }) => {
//   if (!reportData) return null;

//   return (
//     <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg font-sans w-full"> {/* Added w-full */}
//       {/* Header with Breadcrumbs and Back Button */}
//       <div className="mb-4 sm:mb-6 flex items-center justify-between">
//         <div className="text-xs text-gray-500 flex items-center space-x-1.5">
//           <button onClick={onBack} className="hover:underline flex items-center">
//             <FiArrowLeft size={14} className="mr-1" /> Car report
//           </button>
//           <FiChevronRight size={12} />
//           <span className="text-gray-700 font-medium">{reportData.user}'s Issue</span>
//         </div>
//       </div>

//       <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{reportData.carDetails}</h2>

//       {/* Image Gallery */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
//         {(reportData.images || []).slice(0, 6).map((imgSrc, index) => (
//           <div key={index} className="aspect-w-3 aspect-h-2 bg-gray-100 rounded-lg overflow-hidden">
//             <img
//               src={imgSrc}
//               alt={`Reported car image ${index + 1}`}
//               className="object-cover w-full h-full"
//             />
//           </div>
//         ))}
//       </div>

//       {/* Details Section */}
//       <div className="space-y-2.5 text-sm mb-8"> {/* Reduced space-y */}
//         <div className="flex">
//           <span className="text-gray-500 w-40 shrink-0">Location of Incident</span>
//           <span className="text-gray-800 font-medium">{reportData.locationOfIncident}</span>
//         </div>
//         <div className="flex">
//           <span className="text-gray-500 w-40 shrink-0">Previous Reports on the Car</span>
//           <span className="text-gray-800 font-medium">{reportData.previousReports}</span>
//         </div>
//         <div className="flex">
//           <span className="text-gray-500 w-40 shrink-0">User's Description</span>
//           <span className="text-gray-800 font-medium leading-relaxed">{reportData.userDescription}</span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
//         <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
//           Send Mechanic
//         </button>
//         <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
//           Mark as resolved
//         </button>
//         <button className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors">
//           Contact user
//         </button>
//       </div>
//     </div>
//   );
// };
// // --- End View Car Report Detail Page Component ---


// const CarReportContent = () => {
//   const [activeTab, setActiveTab] = useState('All');
//   const [viewingReport, setViewingReport] = useState(null); // Stores the report data if viewing details
//   const tableTabs = ['All', 'Pending', 'Resolved'];

//   const handleTableAction = (reportId, action) => {
//     const report = carReportsTableData.find(r => r.id === reportId);
//     if (action === 'view' && report) {
//       setViewingReport(report);
//     } else {
//       console.log(`Action: ${action} on report ID: ${reportId}`);
//     }
//   };

//   if (viewingReport) {
//     return <ViewCarReportDetail reportData={viewingReport} onBack={() => setViewingReport(null)} />;
//   }

//   return (
//     <div className="text-gray-800">
//       {/* Todays Statistics Title & Cards */}
//       <div className='bg-[#F8F7F1] p-4 sm:p-6 md:p-8 '> {/* Reduced padding */}

//         <div className="mb-4 sm:mb-6"> {/* Reduced bottom margin */}
//           <h2 className="text-lg sm:text-xl font-semibold">Today's Statistics</h2> {/* Reduced text size */}
//           <p className="text-xs text-gray-500">Tue, 14 Nov, 2022, 11.30 AM</p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6"> {/* Reduced gap and bottom margin */}
//           <div className="sm:col-span-2 lg:col-span-2 bg-neutral-800 text-white p-4 sm:p-5 rounded-xl shadow-lg flex flex-col justify-between"> {/* Reduced padding */}
//             <div className="flex justify-between items-start mb-2 sm:mb-3"> {/* Reduced bottom margin */}
//               <h3 className="text-sm sm:text-base font-medium">Total reports received</h3> {/* Reduced text size */}
//               <TodayTag />
//             </div>
//             <div>
//               <p className="text-2xl sm:text-3xl font-bold">1,000</p> {/* Reduced text size */}
//             </div>
//           </div>
//           <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-xl shadow-lg flex flex-col justify-between">
//             <div className="flex justify-between items-start mb-2 sm:mb-3">
//               <h3 className="text-sm sm:text-base font-medium text-gray-700">Pending Reports</h3>
//             </div>
//             <div>
//               <p className="text-2xl sm:text-3xl font-bold">200</p>
//             </div>
//           </div>
//           <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-xl shadow-lg flex flex-col justify-between">
//             <div className="flex justify-between items-start mb-2 sm:mb-3">
//               <h3 className="text-sm sm:text-base font-medium text-gray-700">Resolved Reports</h3>
//             </div>
//             <div>
//               <p className="text-2xl sm:text-3xl font-bold">1,300</p>
//             </div>
//           </div>
//           <div className="lg:col-span-1 bg-white p-4 sm:p-5 rounded-xl shadow-lg flex flex-col justify-between items-start">
//             <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Most common issues</h3>
//             <div>
//               <p className="text-xl sm:text-2xl font-bold">Engine issues</p> {/* Reduced text size */}
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Car Reports Table Section (remains largely the same) */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
//         {/* ... (Filter, Tabs, Table JSX remains the same as previous version) ... */}
//         <div className="flex justify-between items-center mb-4 sm:mb-6">
//           <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto max-w-sm"> <TbFilter size={20} className="text-gray-500 mr-2" /> <input type="text" placeholder="Filter drivers by name, ID, status" className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent" /> </div>
//         </div>
//         <div className="mb-4 border-b border-gray-200">
//           <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
//             {tableTabs.map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium ${activeTab === tab ? 'border-gray-800 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}> {tab} </button>))}
//           </nav>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1024px] text-sm text-left text-gray-600">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr> <th scope="col" className="px-4 py-3">No.</th> <th scope="col" className="px-4 py-3">User</th> <th scope="col" className="px-4 py-3">Car Details</th> <th scope="col" className="px-4 py-3"></th> <th scope="col" className="px-4 py-3">Issue Type</th> <th scope="col" className="px-4 py-3">Reported Date & Time</th> <th scope="col" className="px-4 py-3">Status</th> <th scope="col" className="px-4 py-3 text-center">Action</th> </tr>
//             </thead>
//             <tbody>
//               {carReportsTableData.map((report) => (
//                 <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
//                   <td className="px-4 py-3 text-gray-900">{report.no}</td>
//                   <td className="px-4 py-3"> <div className="flex items-center"> <img className="w-7 h-7 rounded-full mr-2.5 object-cover" src={report.userImg} alt={report.user} /> <span className="font-medium text-gray-900">{report.user}</span> </div> </td>
//                   <td className="px-4 py-3">{report.carDetails}</td>
//                   <td className="px-4 py-3"> <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium"> {report.carReg} </span> </td>
//                   <td className="px-4 py-3">{report.issueType}</td>
//                   <td className="px-4 py-3"> <div>{report.reportedDate}</div> <div className="text-xs text-gray-500">{report.reportedTime}</div> </td>
//                   <td className="px-4 py-3"> <div className="flex items-center"> <span className={`w-2.5 h-2.5 rounded-full mr-2 ${report.statusColor}`}></span> {report.status} </div> </td>
//                   <td className="px-4 py-3 text-center"> <ActionDropdown reportId={report.id} onAction={handleTableAction} /> </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarReportContent;

import React from 'react';

const CarReportContent = () => {
  return (
    <div>
      <h1>Car Report Content</h1>
    </div>
  );
};

export default CarReportContent;