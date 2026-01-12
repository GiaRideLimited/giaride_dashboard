// src/components/ImageAndHello.jsx (or wherever this file is)
import React, { useState } from 'react'; // Ensure useState is imported
// import login_img from '../assets/login_img.png'; // Assuming this path is correct

// Import necessary icons
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowSmRight
} from 'react-icons/hi';
import login_img from "../assets/travel-org.png"; 

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="max-w-[85%] mx-auto flex mt-[90px]  items-center"> 

      {/* Image Container */}
      <div>
        <img src={login_img} alt="Login illustration" className='h-[600px] w-[400px] rounded-[50px] object-cover' /> {/* Added object-cover */}
      </div>


      <div className="flex-1 flex justify-start">
        <div className="bg-white flex flex-col items-center p-4 font-sans w-full">
          <div className="w-full max-w-sm">
            <h1 className="text-5xl font-bold mb-10 text-black text-left">
              Login
            </h1>

            <form onSubmit={(e) => e.preventDefault()}>
              {/* Email/Phone number input */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
                  <HiOutlineMail className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Email/Phone number"
                    className="w-full text-base text-gray-700 placeholder-gray-500 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="mb-10">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
                  <HiOutlineLockClosed className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value="************" // Static value from the image
                    readOnly
                    className="w-full text-base text-gray-700 tracking-widest outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-gray-500 focus:outline-none flex-shrink-0"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff className="w-6 h-6" />
                    ) : (
                      <HiOutlineEye className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Continue button */}
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold text-lg py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Continue
                <HiOutlineArrowSmRight className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LoginForm;