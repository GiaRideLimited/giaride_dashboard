import { TbFilter } from 'react-icons/tb';
import { FiPlus, FiCreditCard, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiVisaLine } from 'react-icons/ri';

const employeeTableData = Array.from({ length: 6 }, (_, i) => ({
    id: `e${i + 1}`,
    no: `${String(i + 1).padStart(2, '0')}`,
    name: 'John Doe',
    email: 'user@gmail.com',
    totalExpense: '$ 35.44',
}));

const PartnerDetailView = ({ onBack, onAddEmployee}) => {
    const TodayTag = () => (
        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Today
        </span>
    );
    return (
        <div className="animate-fade-in">
            {/* Header / Payment Methods Section */}
            <div className="bg-[#F8F7F1] p-6 sm:p-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <FiArrowLeft className="mr-2" /> Back to Partners
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {/* Placeholder for Logo */}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">ACME Corporation</h2>
                            <p className="text-gray-400 text-sm">123 Innovation Drive, Tech City, 12345</p>
                        </div>
                    </div>
                    <button className="mt-4 md:mt-0 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-800 transition">
                        <FiEdit2 className="mr-2" size={14} /> Edit Details
                    </button>
                </div>

                {/* Payment Card Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="p-2 border border-gray-200 rounded-md">
                            <RiVisaLine size={32} className="text-blue-900" />
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium text-sm">Visa ending in 1234</p>
                            <p className="text-gray-400 text-xs">Expires 12/2025</p>
                        </div>
                    </div>
                    <button className="text-red-500 text-sm font-medium hover:text-red-700 mt-2 sm:mt-0 w-full sm:w-auto text-right sm:text-left">
                        Remove
                    </button>
                </div>

                <button className="flex items-center text-sm font-semibold text-gray-900 hover:text-gray-700 mt-4">
                    <FiPlus className="mr-2" /> Add Payment Method
                </button>
            </div>

            {/* Stats Section */}
            <div className="bg-[#F8F7F1] px-6 sm:px-8 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-600">Total Registered Employees</h3>
                            <TodayTag />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">30</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-600">Total Expense Incurred</h3>
                            <TodayTag />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-600">Emails Managed</h3>
                            <TodayTag />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                    </div>
                </div>
            </div>

            {/* Employee Table Section */}
            <div className="bg-white px-6 sm:px-8 py-8 min-h-screen">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 w-full md:max-w-[350px] bg-white">
                        <TbFilter size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Filter by travel type, Gender, State"
                            className="text-sm placeholder-gray-400 outline-none flex-grow bg-transparent text-gray-600"
                        />
                    </div>
                    {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-full flex items-center transition-colors text-sm">
                        <FiPlus size={18} className="mr-1.5" /> Add Employee
                    </button> */}
                    <button
                        onClick={onAddEmployee} // Add this onClick
                        className="bg-yellow-400 hover:bg-yellow-500..."
                    >
                        <FiPlus size={18} className="mr-1.5" /> Add Employee
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-4 font-normal">No.</th>
                                <th className="px-4 py-4 font-normal">Name</th>
                                <th className="px-4 py-4 font-normal">Employee account</th>
                                <th className="px-4 py-4 font-normal text-right">Total Expense</th>
                                <th className="px-4 py-4 font-normal text-center">Actions</th>
                                <th className="px-2 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeTableData.map((emp) => (
                                <tr key={emp.id} className="group hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                                    <td className="px-4 py-4 text-gray-500 font-medium">{emp.no}</td>
                                    <td className="px-4 py-4 text-gray-900 font-medium">{emp.name}</td>
                                    <td className="px-4 py-4 text-gray-500">{emp.email}</td>
                                    <td className="px-4 py-4 text-gray-500 text-right">{emp.totalExpense}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="bg-black text-white text-xs font-medium px-4 py-2 rounded shadow-sm hover:bg-gray-800 transition-colors">
                                                View details
                                            </button>
                                            <button className="bg-[#A0410D] text-white text-xs font-medium px-4 py-2 rounded shadow-sm hover:bg-[#85350a] transition-colors">
                                                Remove Employee
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <BsThreeDotsVertical size={16} />
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

export default PartnerDetailView;