import { Routes, Route, useNavigate } from 'react-router-dom';

// Import your components
import PartnersListView from './PartnersContent/PartnersListView';
import AddPartnerForm from './PartnersContent/AddPartnerForm';
import PartnerDetailView from './PartnersContent/PartnerDetailView';
import AddEmployeeForm from './PartnersContent/AddEmployeeForm';

const PartnersContent = () => {
  const navigate = useNavigate();

  const handleBackToList = () => navigate('/partners');
  const handleAddPartner = () => navigate('/partners/new');
  const handleAddEmployee = (id) => navigate(id ? `/partners/${id}/add-employee` : `/partners/add-employee`);

  const handleViewDetails = (id) => {
    navigate(`/partners/${id}`);
  };

  return (
    <div className="text-gray-800 min-h-screen font-sans bg-white">
      <Routes>
        <Route index element={
          <PartnersListView
            onViewDetails={handleViewDetails}
            onAddPartner={handleAddPartner}
            onAddEmployee={handleAddEmployee}
          />
        } />
        <Route path="new" element={
          <AddPartnerForm onBack={handleBackToList} />
        } />
        <Route path=":id" element={
          <PartnerDetailView
            onBack={handleBackToList}
            onAddEmployee={() => handleAddEmployee()} 
            // the PartnerDetailView will pass the ID using useParams or we handle it inside PartnerDetailView
          />
        } />
        <Route path=":id/add-employee" element={
          <AddEmployeeForm
            onBack={() => navigate(-1)}
            onBackToPartners={handleBackToList}
          />
        } />
      </Routes>
    </div>
  );
};

export default PartnersContent;