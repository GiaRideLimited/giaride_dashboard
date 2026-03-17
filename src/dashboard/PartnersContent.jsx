import React, { useState } from 'react';

// Import your components
import PartnersListView from './PartnersContent/PartnersListView';
import AddPartnerForm from './PartnersContent/AddPartnerForm';
import PartnerDetailView from './PartnersContent/PartnerDetailView';
import AddEmployeeForm from './PartnersContent/AddEmployeeForm'; // Import the new component

const PartnersContent = () => {
  // States: 'list', 'details', 'add-partner', 'add-employee'
  const [view, setView] = useState('list');
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);


  // Navigation Handlers
  const handleBackToList = () => setView('list');
  const handleAddPartner = () => setView('add-partner');
  // const handleAddEmployee = () => setView('add-employee');
  const handleAddEmployee = (id) => {
    if (id) setSelectedPartnerId(id); // only update if id is passed
    setView('add-employee');
  };

  const handleViewDetails = (id) => {
    setSelectedPartnerId(id);
    setView('details');
  };

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


      {view === 'details' && (
        <PartnerDetailView
          onBack={handleBackToList}
          onAddEmployee={handleAddEmployee}
          partnerId={selectedPartnerId}
        />
      )}

      {/* 4. Add Employee Form */}
      {/* {view === 'add-employee' && (
        <AddEmployeeForm
          onBack={handleViewDetails} // Goes back to the specific Partner Details
          onBackToPartners={handleBackToList} // Goes all the way back to List
        />
      )} */}
      {view === 'add-employee' && (
        <AddEmployeeForm
          onBack={() => setView('details')}
          onBackToPartners={handleBackToList}
          organizationId={selectedPartnerId} // Change 1: pass real partner id
        />
      )}

    </div>
  );
};

export default PartnersContent;