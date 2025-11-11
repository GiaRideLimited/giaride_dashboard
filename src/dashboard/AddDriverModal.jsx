import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
    FiChevronDown, FiMail, FiPhone, FiUser, FiTruck, FiClock, FiFileText, FiRepeat, FiMapPin, FiChevronUp
} from 'react-icons/fi';
import { FaCarSide, FaShippingFast, FaBusAlt } from 'react-icons/fa';

const ModalInputField = ({ placeholder, icon, type = 'text', value, onChange, name, children, required = false }) => (
    <div className="flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
        {icon && React.cloneElement(icon, { size: 18, className: 'text-gray-500 mr-2.5 flex-shrink-0' })}
        {children || (
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent"
            />
        )}
    </div>
);

const ModalSelectField = ({ placeholder, options, value, onChange, name, required = false }) => (
    <div className="relative flex items-center border border-gray-300 rounded-lg px-3.5 py-2.5 focus-within:ring-1 focus-within:ring-black focus-within:border-black">
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent appearance-none pr-8 cursor-pointer"
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        <FiChevronDown size={18} className="text-gray-500 absolute right-3.5 pointer-events-none" />
    </div>
);

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between w-full mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center text-center">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2
                                ${currentStep > index + 1 ? 'bg-yellow-400 border-yellow-400' : ''}
                                ${currentStep === index + 1 ? 'bg-yellow-400 border-yellow-400 animate-pulse' : ''}
                                ${currentStep < index + 1 ? 'border-gray-300' : ''}
                            `}
                        >
                            {currentStep > index + 1 && <span className="text-xs font-bold text-black">✓</span>}
                            {currentStep === index + 1 && <div className="w-2 h-2 bg-black rounded-full"></div>}
                        </div>
                        <span
                            className={`mt-1.5 text-xs font-medium 
                                ${currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'}
                            `}
                        >
                            {step.name}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 
                            ${currentStep > index + 1 ? 'bg-yellow-400' : 'bg-gray-300'}
                        `}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const ServiceTypeCard = ({ icon, title, description, type, selectedType, onSelect }) => {
    const isSelected = selectedType === type;
    return (
        <button
            type="button"
            onClick={() => onSelect(type)}
            className={`p-4 border rounded-xl text-left w-full transition-all duration-150
                ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'}
            `}
        >
            <div className="flex items-center mb-2">
                {React.cloneElement(icon, { size: 20, className: `mr-3 ${isSelected ? 'text-yellow-600' : 'text-gray-500'}` })}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${isSelected ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}
                `}>
                    {title.split(' ')[0]}
                </span>
            </div>
            <h4 className={`text-md font-semibold mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
        </button>
    );
};
// --- End Modal Helper Components ---

// --- Accordion Item for Step 3 ---
const AccordionItem = ({ icon, title, children, initiallyOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 px-1"
            >
                <div className="flex items-center">
                    {React.cloneElement(icon, { size: 18, className: "mr-3 text-gray-500" })}
                    <span>{title}</span>
                </div>
                {isOpen ? <FiChevronUp size={20} className="text-gray-500" /> : <FiChevronDown size={20} className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="py-3 px-1 text-sm text-gray-600 space-y-2.5">
                    {children}
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, valueClass = "text-gray-800 font-medium" }) => (
    <div className="flex justify-between items-center">
        <span className="text-gray-500">{label}</span>
        <span className={valueClass}>{value}</span>
    </div>
);
// --- End Accordion Item ---


const AddDriverModal = ({ isOpen, onClose, entityType = "Driver" }) => {
    const [currentStep, setCurrentStep] = useState(1);
    // Combine all form data into one object, even if parts are not used in all steps
    const [formData, setFormData] = useState({
        // Step 1
        firstName: 'Alex', lastName: 'Noman', age: '28', gender: 'male', email: 'alex.noman@example.com', phone: '+2348023456780',
        nin: '909391252362837', nationality: 'Nigerian', address: 'No 5, Lekki phase 1, Lagos',
        // Step 2
        serviceType: 'ride_hailing', cityAllocation: 'lagos',
        // Step 3 (Driver Details specific - this data might come from formData or be static for the view)
        driverId: '6465', driverStatus: 'Online', driverType: 'Interstate/Intrastate', driverLocation: 'Lagos',
        dob: '12th December 1996',
        profileImg: 'https://randomuser.me/api/portraits/women/44.jpg', // Placeholder for driver's image
    });
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            //setCurrentStep(1); // Keep this if you want to always start at step 1
            // For now, let's assume if it's opened, it might be for editing, so step 3 could be shown
            // If always starting fresh:
            // setCurrentStep(1);
            // setFormData({ ...initial empty state... });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) { document.addEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const steps = [
        { name: 'Personal details', number: 1 },
        { name: 'Documents', number: 2 },
        { name: 'Other details', number: 3 },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleServiceTypeSelect = (type) => setFormData(prev => ({ ...prev, serviceType: type }));

    const genderOptions = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
    const cityOptions = [{ value: 'lagos', label: 'Lagos' }, { value: 'abuja', label: 'Abuja' }];


    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (currentStep === 2 && (!formData.serviceType || !formData.cityAllocation)) {
            alert("Please select a service type and city allocation.");
            return;
        }
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log(`Submitting/Finalizing ${entityType} data:`, formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div ref={modalContentRef} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative"> {/* Adjusted max-w for this view */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <IoMdClose size={24} />
                </button>

                {/* Conditional Title based on step, or always "Add Driver/Rider" */}
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {currentStep === 3 ? `${entityType} details` : `Add ${entityType}`}
                </h2>
                
                {currentStep !== 3 && <Stepper steps={steps} currentStep={currentStep} />}

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Step 1 */}
                    {currentStep === 1 && ( /* ... Step 1 JSX from previous code ... */
                        <>
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3">Personal Information</h3>
                                <div className="space-y-4">
                                    <ModalInputField placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <ModalInputField placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    <ModalInputField placeholder="Age" type="number" name="age" value={formData.age} onChange={handleChange} required />
                                    <ModalSelectField placeholder="Gender" options={genderOptions} name="gender" value={formData.gender} onChange={handleChange} required />
                                    <ModalInputField placeholder="Email" type="email" icon={<FiMail />} name="email" value={formData.email} onChange={handleChange} required />
                                    <ModalInputField icon={<FiPhone />}>
                                        <div className="flex items-center w-full">
                                            <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">+234</span>
                                            <span className="text-gray-400 mr-2">|</span>
                                            <input type="tel" name="phone" value={formData.phone.startsWith('+234') ? formData.phone.substring(4) : formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: '+234' + e.target.value.replace(/\D/g, '') }))} className="w-full text-sm text-gray-700 placeholder-gray-500 outline-none bg-transparent" required />
                                        </div>
                                    </ModalInputField>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3 mt-6">Other Information</h3>
                                <div className="space-y-4">
                                    <ModalInputField placeholder="NIN/International passport" name="nin" value={formData.nin} onChange={handleChange} required />
                                    <ModalInputField placeholder="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} required />
                                    <ModalInputField placeholder="Address" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && ( /* ... Step 2 JSX from previous code ... */
                         <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <ServiceTypeCard icon={<FaCarSide />} title="Ride Hailing" description="Earn money driving as taxi or ride hailing service within your state and its environs" type="ride_hailing" selectedType={formData.serviceType} onSelect={handleServiceTypeSelect}/>
                                <ServiceTypeCard icon={<FaShippingFast />} title="Logistics" description="On demand delivery services for customers within your state" type="logistics" selectedType={formData.serviceType} onSelect={handleServiceTypeSelect}/>
                                <ServiceTypeCard icon={<FaBusAlt />} title="Intercity Journey" description="Bus or taxi services for inter state or long distance journey" type="intercity" selectedType={formData.serviceType} onSelect={handleServiceTypeSelect}/>
                            </div>
                            <div>
                                <h3 className="text-md font-semibold text-gray-800 mb-3">City Allocation</h3>
                                <ModalSelectField placeholder="Select a city" options={cityOptions} name="cityAllocation" value={formData.cityAllocation} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Driver Details View */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 mb-6">
                                <img
                                    src={formData.profileImg || "https://via.placeholder.com/80"} // Placeholder if no image
                                    alt={`${formData.firstName} ${formData.lastName}`}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{`${formData.firstName} ${formData.lastName}`}</h3>
                                    <p className="text-sm text-gray-500">{formData.driverId}</p>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block
                                        ${formData.driverStatus === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                                    `}>
                                        {formData.driverStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Basic Info List */}
                            <div className="space-y-3 text-sm">
                                <DetailRow label={<><FiPhone size={16} className="inline mr-2 text-gray-400"/>Phone Number</>} value={formData.phone} />
                                <DetailRow label={<><FiRepeat size={16} className="inline mr-2 text-gray-400"/>Type</>} value={<span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{formData.driverType}</span>} />
                                <DetailRow label={<><FiMapPin size={16} className="inline mr-2 text-gray-400"/>Location</>} value={formData.driverLocation} />
                            </div>
                            
                            <hr className="my-5" />

                            {/* Accordions */}
                            <AccordionItem icon={<FiUser />} title="Other Details" initiallyOpen={true}>
                                <DetailRow label="Gender" value={<span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</span>} />
                                <DetailRow label="DOB" value={formData.dob} />
                                <DetailRow label="Address" value={formData.address} />
                                <DetailRow label="NIN" value={formData.nin} />
                            </AccordionItem>
                            <AccordionItem icon={<FiTruck />} title="Car Details">
                                <p>Car model, registration, color, etc. would be displayed here.</p>
                                {/* Example: <DetailRow label="Car Model" value="Toyota Corolla 06" /> */}
                            </AccordionItem>
                            <AccordionItem icon={<FiClock />} title="Ride History">
                                <p>A summary or list of recent rides would be displayed here.</p>
                            </AccordionItem>
                            <AccordionItem icon={<FiFileText />} title="Documents">
                                <p>Links to or status of uploaded documents would be displayed here.</p>
                            </AccordionItem>
                        </div>
                    )}

                    {/* Button for Steps 1 & 2 */}
                    {currentStep < 3 && (
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-8"
                        >
                            Continue
                        </button>
                    )}
                    {/* Button for Step 3 - "Edit Driver" or "Complete/Add Driver" */}
                    {currentStep === 3 && (
                         <button
                            type="submit" // If it submits and closes
                            // onClick={onClose} // Or if it just closes, or triggers an edit mode
                            className="w-full bg-black text-white font-semibold text-base py-3 px-6 rounded-full hover:bg-gray-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mt-8"
                        >
                            {/* The image shows "Edit driver", but this is an "Add Driver" flow.
                                For consistency with "Add Driver", the button might be "Add Driver" or "Complete".
                                If this modal is also used for *editing*, then "Edit Driver" makes sense.
                                Let's assume "Complete" for the add flow.
                            */}
                            Complete {entityType} Setup 
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddDriverModal;