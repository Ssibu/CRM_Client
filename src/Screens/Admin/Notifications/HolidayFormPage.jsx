import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '@/Components/Admin/TextEditor/FormField';

const SelectField = memo(({ label, name, value, onChange, error, options, required }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}  {required && <span className='text-red-500' >*</span>} </label>
        <select
            id={name} name={name} value={value} onChange={onChange}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
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
  const initialFormState = { holiday_date: '', name: '', type: '' };

  const [formData, setFormData] = useState(initialFormState);
  const [originalData, setOriginalData] = useState(initialFormState);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHolidayData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/holidays/${id}`, { withCredentials: true });
        const { holiday_date, name, type } = response.data;
        
        const fetchedData = { holiday_date, name, type };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        showModal("error", "Failed to fetch holiday data.");
        navigate('/admin/notifications/holidays');
      }
    };
    
    fetchHolidayData();
  }, [id, isEditMode, navigate, showModal]);

  const handleChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Holiday name is required.";
    if (!formData.holiday_date) newErrors.holiday_date = "Holiday date is required.";
    if (!formData.type) newErrors.type = "Holiday type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

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

  const handleReset = useCallback(() => {
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
            <FormField 
              label="Holiday Name" 
              placeholder="Enter a Holiday name here" 
              name="name"  
              value={formData.name} 
              onChange={(value) => handleChange('name', value)} 
              error={errors.name} 
              required="true"
              maxLength={100}
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
                
            <SelectField 
            required
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
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
    </div>
  );
};

export default HolidayFormPage;