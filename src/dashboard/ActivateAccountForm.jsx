import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowSmRight
} from 'react-icons/hi';
import login_img from "../assets/travel-org.png"; 

const ActivateAccountForm = ({ onSwitchToLogin, initialEmail = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State matching the API Payload
  const [formData, setFormData] = useState({
    email: initialEmail,
    registration_token: '',
    password: ''
  });

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.registration_token || !formData.password || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/account/activate-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Activation failed");
      }

      toast.success("Account activated! You can now log in.");
      
      // Redirect to Login
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);

    } catch (error) {
      console.error("Activation Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[85%] mx-auto flex min-h-screen items-center justify-center"> 
      {/* Image Container */}
      <div className="hidden lg:block mr-10">
        <img 
          src={login_img} 
          alt="Activation illustration" 
          className='h-[600px] w-[400px] rounded-[50px] object-cover shadow-xl' 
        /> 
      </div>

      <div className="flex-1 flex justify-start max-w-md w-full">
        <div className="bg-white flex flex-col items-center p-4 font-sans w-full">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-2 text-black text-left">
              Activate Account
            </h1>
            <p className="text-gray-500 mb-8 text-sm">
              Enter the token sent to your email and set your password.
            </p>

            <form onSubmit={handleSubmit}>
              
              {/* Email Input (Read Only if passed from Signup) */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent bg-gray-50">
                  <HiOutlineMail className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    // If email was passed from signup, make it read-only
                    readOnly={!!initialEmail} 
                    className={`w-full text-base text-gray-700 outline-none bg-transparent ${initialEmail ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {/* Registration Token Input */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                  <HiOutlineKey className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    name="registration_token"
                    value={formData.registration_token}
                    onChange={handleChange}
                    placeholder="Registration Token (OTP)"
                    required
                    className="w-full text-base text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div className="mb-10">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent">
                  <HiOutlineLockClosed className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create Password"
                    required
                    className="w-full text-base text-gray-700 outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-gray-500 focus:outline-none flex-shrink-0 hover:text-black"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-6 h-6" />
                    ) : (
                      <HiOutlineEye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold text-lg py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Activating..." : "Activate Account"}
                {!isLoading && <HiOutlineArrowSmRight className="ml-2 w-5 h-5" />}
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already activated?{' '}
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

export default ActivateAccountForm;