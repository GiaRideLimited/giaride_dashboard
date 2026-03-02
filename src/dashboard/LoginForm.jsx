// import React, { useState } from 'react'; // Ensure useState is imported

// import {
//   HiOutlineMail,
//   HiOutlineLockClosed,
//   HiOutlineEye,
//   HiOutlineEyeOff,
//   HiOutlineArrowSmRight
// } from 'react-icons/hi';
// import login_img from "../assets/travel-org.png"; 

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false);


//   return (
//     <div className="max-w-[85%] mx-auto flex mt-[90px]  items-center"> 

//       {/* Image Container */}
//       <div>
//         <img src={login_img} alt="Login illustration" className='h-[600px] w-[400px] rounded-[50px] object-cover' /> {/* Added object-cover */}
//       </div>


//       <div className="flex-1 flex justify-start">
//         <div className="bg-white flex flex-col items-center p-4 font-sans w-full">
//           <div className="w-full max-w-sm">
//             <h1 className="text-5xl font-bold mb-10 text-black text-left">
//               Login
//             </h1>

//             <form onSubmit={(e) => e.preventDefault()}>
//               {/* Email/Phone number input */}
//               <div className="mb-6">
//                 <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
//                   <HiOutlineMail className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     placeholder="Email/Phone number"
//                     className="w-full text-base text-gray-700 placeholder-gray-500 outline-none bg-transparent"
//                   />
//                 </div>
//               </div>

//               {/* Password input */}
//               <div className="mb-10">
//                 <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
//                   <HiOutlineLockClosed className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value="************" // Static value from the image
//                     readOnly
//                     className="w-full text-base text-gray-700 tracking-widest outline-none bg-transparent"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="ml-3 text-gray-500 focus:outline-none flex-shrink-0"
//                   >
//                     {showPassword ? (
//                       <HiOutlineEyeOff className="w-6 h-6" />
//                     ) : (
//                       <HiOutlineEye className="w-6 h-6" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Continue button */}
//               <button
//                 type="submit"
//                 className="w-full bg-black text-white font-semibold text-lg py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
//               >
//                 Continue
//                 <HiOutlineArrowSmRight className="ml-2 w-5 h-5" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//     </div>
//   ); 
// }

// export default LoginForm;

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineArrowSmRight
} from 'react-icons/hi';
import login_img from "../assets/travel-org.png"; 

const LoginForm = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/account/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Success
      toast.success("Login successful!");
      
      // Assuming the API returns a token in data.token or data.data.token
      // Adjust 'data.token' below based on your actual API response structure
      const token = data.token || data.data?.token || "dummy-token"; 
      
      // Navigate to Dashboard via parent callback
      setTimeout(() => {
        onLoginSuccess(token);
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[85%] mx-auto flex min-h-screen items-center justify-center"> 

      {/* Image Container - Hidden on small screens, visible on large */}
      <div className="hidden lg:block mr-10">
        <img 
          src={login_img} 
          alt="Login illustration" 
          className='h-[600px] w-[400px] rounded-[50px] object-cover shadow-xl' 
        /> 
      </div>

      <div className="flex-1 flex justify-start max-w-md w-full">
        <div className="bg-white flex flex-col items-center p-4 font-sans w-full">
          <div className="w-full">
            <h1 className="text-5xl font-bold mb-10 text-black text-left">
              Login
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <HiOutlineMail className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type="email" // Changed to email for better mobile keyboard
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full text-base text-gray-700 placeholder-gray-500 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-10">
                <div className="flex items-center border border-gray-400 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <HiOutlineLockClosed className="text-gray-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
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

              {/* Continue button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold text-lg py-3 px-6 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Continue"}
                {!isLoading && <HiOutlineArrowSmRight className="ml-2 w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default LoginForm;