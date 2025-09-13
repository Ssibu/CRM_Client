import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '@/Components/Admin/TextEditor/FormField';

// The SelectField component is well-written and does not need changes.
const SelectField = memo(({ label, name, value, onChange, error, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            id={name} name={name} value={value} onChange={onChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
            {/* Add a default disabled option for better UX */}
            <option value="" disabled>-- Select a Type --</option>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
));

const HolidayFormPage = () => {
  const { id } = useParams(); 
  const isEditMode = !!id; 
  const navigate = useNavigate();
  const { showModal } = useModal();

  const holidayTypes = ['National', 'Gazetted', 'Restricted', 'State-Specific'];
  const initialFormState = { holiday_date: '', name: '', type: 'Gazetted' }; // A sensible default

  // "Live" state that the user interacts with
  const [formData, setFormData] = useState(initialFormState);
  // NEW: "Original" state to store a snapshot of the initial data for resetting
  const [originalData, setOriginalData] = useState(initialFormState);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHolidayData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/holidays/${id}`, { withCredentials: true });
        const { holiday_date, name, type } = response.data;
        
        // CHANGED: Structure the fetched data
        const fetchedData = { holiday_date, name, type };

        // CHANGED: Set both the live state for editing...
        setFormData(fetchedData);
        // ...and the backup "original" state for the reset functionality.
        setOriginalData(fetchedData);
      } catch (error) {
        showModal("error", "Failed to fetch holiday data.");
        navigate('/admin/notifications/holidays');
      }
    };
    
    fetchHolidayData();
  }, [id, isEditMode, navigate, showModal]);

  // CHANGED: Unified handler for all input types.
  // It now accepts the field's name and value directly.
  const handleChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  // Validation logic remains the same
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Holiday name is required.";
    if (!formData.holiday_date) newErrors.holiday_date = "Holiday date is required.";
    if (!formData.type) newErrors.type = "Holiday type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Submission logic remains the same
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/holidays/${id}` 
        : `${import.meta.env.VITE_API_BASE_URL}/holidays`;
    const method = isEditMode ? 'patch' : 'post';

    try {
      await axios[method](url, formData, { withCredentials: true });
      showModal("success", `Holiday ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate('/admin/notifications/holidays');
    } catch (error) {
      showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} holiday.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, id, isEditMode, navigate, showModal, validateForm]);

  // CHANGED: The new, unified reset handler.
  const handleReset = useCallback(() => {
    // Reverts the form data to the original state saved on load.
    // This works for both "add" and "edit" modes automatically.
    setFormData(originalData);
    setErrors({});
  }, [originalData]);

  return (
    <div
      className="min-h-[80vh]"
    >
    <div className="bg-white p-6 shadow">
      <Header title={isEditMode ? "Edit Holiday" : "Add New Holiday"} onGoBack={() => navigate('/admin/notifications/holidays')} />
      <div className="">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CHANGED: The 'onChange' prop for FormField is now adapted to the new handler */}
            <FormField 
              label="Holiday Name" 
              placeholder="Enter a Holiday name here" 
              name="name"  
              value={formData.name} 
              onChange={(value) => handleChange('name', value)} 
              error={errors.name} 
              required="true"
            />
            <FormField 
              label="Date" 
              name="holiday_date" 
              type="date" 
              value={formData.holiday_date} 
              onChange={(value) => handleChange('holiday_date', value)} 
              error={errors.holiday_date}
              required="true"
            />
            {/* CHANGED: The 'onChange' for SelectField is also adapted to pass name and value */}
            <SelectField 
              label="Type" 
              name="type" 
              value={formData.type} 
              onChange={(e) => handleChange(e.target.name, e.target.value)} 
              error={errors.type} 
              options={holidayTypes} 
            />
          </div>
          <FormActions
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            onCancel={() => navigate('/admin/notifications/holidays')}
            onReset={handleReset} // <-- Use the new smart reset handler
          />
        </form>
      </div>
    </div>
    </div>
  );
};

export default HolidayFormPage;