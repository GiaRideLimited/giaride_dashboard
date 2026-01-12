import React, { useState } from 'react';
import { MdOutlineMailOutline } from "react-icons/md";
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import travelOrg from "./assets/travel-org.png"; 

const CreatePartnerAccount = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className='w-full px-8 md:px-16'>
                        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Login</h1>
                        <form onSubmit={handleNextStep}>
                            <div className="relative mb-4">
                                <MdOutlineMailOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Email/Phone number"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>
                            <div className="relative mb-6">
                                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                Continue <FiArrowRight />
                            </button>
                        </form>
                    </div>
                );
            case 2:
                return (
                    <div className='w-full px-8 md:px-16'>
                        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Create Password</h1>
                        <form onSubmit={handleNextStep}>
                            <div className="relative mb-4">
                                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <div className="relative mb-6">
                                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-type password"
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                Continue <FiArrowRight />
                            </button>
                        </form>
                    </div>
                );
            case 3:
                return (
                    <div className='w-full px-8 md:px-16 text-center'>
                        <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <FaCheck className="text-green-600 text-2xl" />
                        </div>
                        <p className="text-gray-700 mb-6">Account verified</p>
                        <button onClick={onComplete} className="w-full bg-black text-white py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                            Proceed to dashboard <FiArrowRight />
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="flex h-screen font-sans bg-white">
            <div
                className="w-1/2  bg-cover bg-center"
                style={{ backgroundImage: `url(${travelOrg})` }}
            >
                <div className='bg-black/50 hidden lg:flex flex-col justify-end p-8 h-full'>
                    <h2 className="text-2xl font-bold text-yellow-400">giaride</h2>
                    <h1 className="text-4xl font-semibold mt-2 text-white">Welcome to the Giaride</h1>
                    <p className="text-4xl font-semibold text-white">Partner Admin Dashboard</p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                {renderStep()}
            </div>
        </div>
    );
};

export default CreatePartnerAccount;