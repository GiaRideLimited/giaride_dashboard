// import React from 'react'
// import Dashboard from './dashboard/Dashboard'
// import LoginForm from './dashboard/LoginForm'
// const App = () => {
//   return (
//     <div>
//               <LoginForm />

//       {/* <Dashboard /> */}
//     </div>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/Dashboard';
import LoginForm from './dashboard/LoginForm';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token); // Save token
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      {isAuthenticated ? (
        // Pass logout handler to Dashboard if needed later
        <Dashboard onLogout={handleLogout} /> 
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;