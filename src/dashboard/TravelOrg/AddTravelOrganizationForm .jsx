import { useState } from "react";
import CreatePartnerAccount from "../../CreatePartnerAccount";

const AddTravelOrganizationForm = ({ onBack }) => {
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    const handleCreateClick = (e) => {
        e.preventDefault();
        // Here you would typically handle form validation and submission
        // For now, we'll just trigger the next UI flow
        setIsCreatingAccount(true);
    };

    if (isCreatingAccount) {
        // When the flow is complete, the `onBack` function is called to return
        return <CreatePartnerAccount onComplete={onBack} />;
    }
    return (
        <div className="p-6 sm:p-8 bg-[#F8F7F1] min-h-screen font-sans text-gray-800">
            <div className="flex items-center mb-6">
                <span className="text-gray-500 cursor-pointer" onClick={onBack}>Partners</span>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="font-semibold text-blue-700">Add travel organization</span>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Add New Travel Organization</h2>
                <form className="">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                            <input
                                type="text"
                                id="fullName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Name of Organization</label>
                            <input
                                type="text"
                                id="organizationName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter organization name"
                            />
                        </div>
                        <div>
                            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="emailAddress"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                id="address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter address"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                id="city"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                                type="text"
                                id="state"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter state"
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                id="country"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter country"
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="bg-gray-700 mt-6 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-colors w-full"
                        onClick={handleCreateClick}
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddTravelOrganizationForm 