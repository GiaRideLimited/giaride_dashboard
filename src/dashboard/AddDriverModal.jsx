import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
    FiChevronDown, FiMail, FiPhone, FiUser, FiMapPin, FiCamera, FiAlertCircle
} from 'react-icons/fi';
import { FaCarSide, FaShippingFast, FaBusAlt } from 'react-icons/fa';

// --- Modal Helper Components ---
const ModalInputField = ({ placeholder, icon, type = 'text', value, onChange, name, children, required = false }) => (
    <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all">
        {icon && React.cloneElement(icon, { size: 18, className: 'text-gray-400 mr-3 flex-shrink-0' })}
        {children || (
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
        )}
    </div>
);

const ModalSelectField = ({ placeholder, options, value, onChange, name, required = false }) => (
    <div className="relative flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all">
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full text-sm text-gray-800 outline-none bg-transparent appearance-none pr-8 cursor-pointer"
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
        <FiChevronDown size={18} className="text-gray-400 absolute right-4 pointer-events-none" />
    </div>
);

const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between w-full mb-10 overflow-x-hidden">
            {steps.map((step, index) => (
                <React.Fragment key={step.name}>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors
                                ${currentStep >= index + 1 ? 'bg-yellow-400 border-yellow-400' : 'border-gray-200 bg-white'}
                            `}
                        >
                            {currentStep > index + 1 ? (
                                <span className="text-[10px] font-bold text-black">✓</span>
                            ) : (
                                <div className={`w-1.5 h-1.5 rounded-full ${currentStep === index + 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
                            )}
                        </div>
                        <span
                            className={`text-[11px] font-semibold tracking-tight transition-colors
                                ${currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-300'}
                            `}
                        >
                            {step.name}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-[1px] mx-3 min-w-[30px]
                            ${currentStep > index + 1 ? 'bg-gray-900' : 'bg-gray-200'}
                        `}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const UploadArea = ({ label }) => (
    <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-900">{label}</h4>
        <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full border border-gray-100 bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                <FiCamera size={20} className="text-gray-400" />
            </div>
            <span className="text-xs font-semibold text-gray-400">Tap To Upload</span>
        </div>
    </div>
);

const ServiceTypeCard = ({ icon, label, description, type, selectedType, onSelect }) => {
    const isSelected = selectedType === type;
    return (
        <button
            type="button"
            onClick={() => onSelect(type)}
            className={`p-4 border rounded-2xl text-left w-full transition-all flex flex-col gap-3 h-full
                ${isSelected ? 'border-yellow-400 bg-yellow-50/30 ring-1 ring-yellow-400' : 'border-gray-100 hover:border-gray-200'}
            `}
        >
            <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                    {React.cloneElement(icon, { size: 22, className: isSelected ? 'text-yellow-600' : 'text-gray-400' })}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit uppercase tracking-wider
                    ${isSelected ? 'bg-yellow-100 border-yellow-200 text-yellow-700' : 'bg-white border-gray-200 text-gray-400'}
                `}>
                    {type.replace('_', ' ')}
                </span>
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{label}</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">{description}</p>
            </div>
        </button>
    );
};

// --- End Modal Helper Components ---

const AddDriverModal = ({ isOpen, onClose, entityType = "Driver", onAddSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        nin: '',
        nationality: '',
        state: '',
        address: '',
        // Step 3: Other
        serviceType: 'ride_hailing',
        cityAllocation: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const modalContentRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_REACT_ENDPOINT;

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setFormData({
                firstName: '', lastName: '', age: '', gender: '', email: '', phone: '',
                nin: '', nationality: '', state: '', address: '',
                serviceType: 'ride_hailing', cityAllocation: '',
            });
            setError(null);
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            return;
        }

        // Final Submission
        setIsLoading(true);
        setError(null);

        const endpoint = entityType.toLowerCase() === 'driver' ? '/admin/add-driver' : '/admin/add-rider';

        // Match the user's local format: 081... or 070...
        let cleanedPhone = formData.phone.replace(/\D/g, '');
        if (cleanedPhone.startsWith('234') && cleanedPhone.length > 10) {
            cleanedPhone = '0' + cleanedPhone.substring(3);
        } else if (!cleanedPhone.startsWith('0') && cleanedPhone.length === 10) {
            cleanedPhone = '0' + cleanedPhone;
        }

        const payload = {
            email: formData.email,
            phone_number: cleanedPhone,
            first_name: formData.firstName,
            last_name: formData.lastName,
            // organization_id: 10 // Added back as a common required field for multi-tenant APIs
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            console.log(`Successfully added ${entityType}:`, result);
            if (onAddSuccess) onAddSuccess();
            onClose();
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ];
    const cityOptions = [
        { value: 'lagos', label: 'Lagos' },
        { value: 'abuja', label: 'Abuja' },
        { value: 'ibadan', label: 'Ibadan' }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={modalContentRef}
                className="bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-1"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Add {entityType}
                </h2>

                <Stepper steps={steps} currentStep={currentStep} />

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <FiAlertCircle className="shrink-0" size={18} />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-8">
                    {/* Step 1: Personal details */}
                    {currentStep === 1 && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-5">Personal Information</h3>
                                <div className="space-y-4">
                                    <ModalInputField placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    <ModalInputField placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    <ModalInputField placeholder="Age" type="number" name="age" value={formData.age} onChange={handleChange} required />
                                    <ModalSelectField placeholder="Gender" options={genderOptions} name="gender" value={formData.gender} onChange={handleChange} required />
                                    <ModalInputField placeholder="Email" type="email" icon={<FiMail />} name="email" value={formData.email} onChange={handleChange} required />
                                    <ModalInputField icon={<FiPhone />}>
                                        <div className="flex items-center w-full">
                                            <span className="text-sm text-gray-800 font-semibold mr-2">+234</span>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
                                                required
                                            />
                                        </div>
                                    </ModalInputField>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-5">Other Information</h3>
                                <div className="space-y-4">
                                    <ModalInputField placeholder="NIN/ international passport" name="nin" value={formData.nin} onChange={handleChange} required />
                                    <ModalInputField placeholder="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} required />
                                    <ModalInputField placeholder="State" name="state" value={formData.state} onChange={handleChange} required />
                                    <ModalInputField placeholder="Address" name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents */}
                    {currentStep === 2 && (
                        <div className="space-y-6 pb-4">
                            <UploadArea label="Driver's License" />
                            <UploadArea label="Vehicle Insurance" />
                            <UploadArea label="Road worthiness report" />
                        </div>
                    )}

                    {/* Step 3: Other details */}
                    {currentStep === 3 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <ServiceTypeCard
                                    icon={<FaCarSide />}
                                    label="Driver"
                                    description="Earn money driving as taxi or ride hailing service within your state and its environs"
                                    type="ride_hailing"
                                    selectedType={formData.serviceType}
                                    onSelect={handleServiceTypeSelect}
                                />
                                <ServiceTypeCard
                                    icon={<FaShippingFast />}
                                    label="Delivery"
                                    description="On demand delivery services for customers within your state"
                                    type="logistics"
                                    selectedType={formData.serviceType}
                                    onSelect={handleServiceTypeSelect}
                                />
                                <ServiceTypeCard
                                    icon={<FaBusAlt />}
                                    label="Intercity Journey"
                                    description="Bus or taxi services for inter state or long distance journey"
                                    type="travel"
                                    selectedType={formData.serviceType}
                                    onSelect={handleServiceTypeSelect}
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4">City Allocation</h3>
                                <ModalSelectField placeholder="Select a city" options={cityOptions} name="cityAllocation" value={formData.cityAllocation} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 pb-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white font-bold text-sm py-4 rounded-full hover:bg-gray-800 transition-all active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                currentStep === 3 ? `Add ${entityType}` : 'Continue'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriverModal;