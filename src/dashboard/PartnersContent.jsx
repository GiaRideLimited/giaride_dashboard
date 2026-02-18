// import React, { useState } from 'react';
// import PartnersListView from './PartnersContent/PartnersListView';
// import AddPartnerForm from './PartnersContent/AddPartnerForm';
// import PartnerDetailView from './PartnersContent/PartnerDetailView';



// const PartnersContent = () => {
//   // States: 'list', 'details', 'add-partner'
//   const [view, setView] = useState('list');

//   const handleBackToList = () => {
//     setView('list');
//   };

//   return (
//     <div className="text-gray-800 min-h-screen font-sans bg-white">

//       {/* 1. Show List View */}
//       {view === 'list' && (
//         <PartnersListView
//           onViewDetails={() => setView('details')}
//           onAddPartner={() => setView('add-partner')}
//         />
//       )}

//       {/* 2. Show Add Partner Form */}
//       {view === 'add-partner' && (
//         <AddPartnerForm onBack={handleBackToList} />
//       )}

//       {/* 3. Show Details View */}
//       {view === 'details' && (
//         // Ensure PartnerDetailView has an onBack prop in its definition
//         <PartnerDetailView onBack={handleBackToList} />
//       )}

//     </div>
//   );
// };

// export default PartnersContent;


import React, { useState } from 'react';

// Import your components
import PartnersListView from './PartnersContent/PartnersListView';
import AddPartnerForm from './PartnersContent/AddPartnerForm';
import PartnerDetailView from './PartnersContent/PartnerDetailView';
import AddEmployeeForm from './PartnersContent/AddEmployeeForm'; // Import the new component

const PartnersContent = () => {
  // States: 'list', 'details', 'add-partner', 'add-employee'
  const [view, setView] = useState('list');

  // Navigation Handlers
  const handleBackToList = () => setView('list');
  const handleViewDetails = () => setView('details');
  const handleAddPartner = () => setView('add-partner');
  const handleAddEmployee = () => setView('add-employee');

  return (
    <div className="text-gray-800 min-h-screen font-sans bg-white">

      {/* 1. List View */}
      {view === 'list' && (
        <PartnersListView
          onViewDetails={handleViewDetails}
          onAddPartner={handleAddPartner}
          // Assuming you want the 'Add Employee' button in the table to also trigger this
          onAddEmployee={handleAddEmployee}
        />
      )}

      {/* 2. Add Partner Form */}
      {view === 'add-partner' && (
        <AddPartnerForm onBack={handleBackToList} />
      )}

      {/* 3. Partner Details View */}
      {view === 'details' && (
        <PartnerDetailView
          onBack={handleBackToList}
          onAddEmployee={handleAddEmployee} // Pass the trigger to the detail view
        />
      )}

      {/* 4. Add Employee Form */}
      {view === 'add-employee' && (
        <AddEmployeeForm
          onBack={handleViewDetails} // Goes back to the specific Partner Details
          onBackToPartners={handleBackToList} // Goes all the way back to List
        />
      )}

    </div>
  );
};

export default PartnersContent;