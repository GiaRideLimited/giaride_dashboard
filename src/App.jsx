// // import React, { useState, useEffect } from 'react';
// // import Dashboard from './dashboard/Dashboard';
// // import LoginForm from './dashboard/LoginForm';
// // import { Toaster } from 'react-hot-toast';

// // const App = () => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   // Check if user is already logged in on page load
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       setIsAuthenticated(true);
// //     }
// //   }, []);

// //   const handleLoginSuccess = (token) => {
// //     localStorage.setItem('token', token); // Save token
// //     setIsAuthenticated(true);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     setIsAuthenticated(false);
// //   };

// //   return (
// //     <div>
// //       <Toaster position="top-right" />
      
// //       {isAuthenticated ? (
// //         // Pass logout handler to Dashboard if needed later
// //         <Dashboard onLogout={handleLogout} /> 
// //       ) : (
// //         <LoginForm onLoginSuccess={handleLoginSuccess} />
// //       )}
// //     </div>
// //   );
// // };

// // export default App;


// import React, { useState, useEffect } from 'react';
// import Dashboard from './dashboard/Dashboard';
// import LoginForm from './dashboard/LoginForm';
// import SignupForm from './dashboard/SignupForm'; // Import the new component
// import { Toaster } from 'react-hot-toast';

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

//   // Check token on load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLoginSuccess = (token) => {
//     localStorage.setItem('token', token);
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setAuthView('login');
//   };

//   return (
//     <div>
//       <Toaster position="top-right" />
      
//       {isAuthenticated ? (
//         <Dashboard onLogout={handleLogout} /> 
//       ) : (
//         // Switch between Login and Signup
//         authView === 'login' ? (
//           <LoginForm 
//             onLoginSuccess={handleLoginSuccess} 
//             onSwitchToSignup={() => setAuthView('signup')} 
//           />
//         ) : (
//           <SignupForm 
//             onSwitchToLogin={() => setAuthView('login')} 
//           />
//         )
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/Dashboard';
import LoginForm from './dashboard/LoginForm';
import SignupForm from './dashboard/SignupForm';
import ActivateAccountForm from './dashboard/ActivateAccountForm'; // Import new component
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // States: 'login' | 'signup' | 'activate'
  const [authView, setAuthView] = useState('login'); 
  // Store email to auto-fill activation form
  const [activationEmail, setActivationEmail] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAuthView('login');
  };

  // Handler to move from Signup -> Activate
  const handleSignupSuccess = (email) => {
    setActivationEmail(email);
    setAuthView('activate');
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} /> 
      ) : (
        <>
          {authView === 'login' && (
            <LoginForm 
              onLoginSuccess={handleLoginSuccess} 
              onSwitchToSignup={() => setAuthView('signup')} 
            />
          )}

          {authView === 'signup' && (
            <SignupForm 
              onSwitchToLogin={() => setAuthView('login')} 
              onSignupSuccess={handleSignupSuccess} // Pass new handler
            />
          )}

          {authView === 'activate' && (
            <ActivateAccountForm 
              initialEmail={activationEmail} 
              onSwitchToLogin={() => setAuthView('login')} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;