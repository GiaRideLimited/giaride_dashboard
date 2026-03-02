import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineArrowSmRight
} from 'react-icons/hi';
import login_img from "../assets/travel-org.png"; 

const SignupForm = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: 'admin' 
  });

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/account/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully! Please login.");
      
      // Delay slightly then switch to login view
    //   setTimeout(() => {
    //     onSwitchToLogin();
    //   }, 1500);
    setTimeout(() => {
        if (onSignupSuccess) {
            onSignupSuccess(formData.email);
        }
      }, 1500);

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[85%] mx-auto flex min-h-screen items-center justify-center py-10"> 

      {/* Image Container */}
      <div className="hidden lg:block mr-10">
        <img 
          src={login_img} 
          alt="Signup illustration" 
          className='h-[650px] w-[400px] rounded-[50px] object-cover shadow-xl' 
        /> 
      </div>

      <div className="flex-1 flex justify-start max-w-md w-full">
        <div className="bg-white flex flex-col items-center p-4 font-sans w-full">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-2 text-black text-left">
              Create Account
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Enter your details to register as an admin.
            </p>

            <form onSubmit={handleSubmit}>
              
              {/* Name Row */}
              <div className="flex gap-4 mb-6">
                {/* First Name */}
                <div className="flex-1">
                  <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                    <HiOutlineUser className="text-gray-500 w-5 h-5 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      className="w-full text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>
                {/* Last Name */}
                <div className="flex-1">
                  <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                    <HiOutlineUser className="text-gray-500 w-5 h-5 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      className="w-full text-sm text-gray-700 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                  <HiOutlineMail className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full text-base text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="mb-10">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                  <HiOutlinePhone className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                    className="w-full text-base text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold text-lg py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
                {!isLoading && <HiOutlineArrowSmRight className="ml-2 w-5 h-5" />}
              </button>

              {/* Switch to Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-black font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default SignupForm;