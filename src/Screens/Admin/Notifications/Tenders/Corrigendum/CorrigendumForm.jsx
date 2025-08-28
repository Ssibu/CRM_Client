import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../../../../../context/ModalProvider';
import FormActions from '../../../../../Components/Add/FormActions';

// Assuming these are exported from a shared components file
// If not, you can copy their definitions here.
const FormField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type} id={name} name={name} value={value} onChange={onChange}
      className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const FileInput = ({ label, name, onFileChange, error, fileName }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="file" id={name} name={name} accept=".pdf" onChange={onFileChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
    {fileName && <p className="text-xs text-gray-600 mt-1">Selected: {fileName}</p>}
    <p className="text-xs text-gray-500 mt-1">PDF only, max 1MB.</p>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const CorrigendumForm = ({ tenderId, editingCorrigendum, onSuccess, onCancel }) => {
    const isEditMode = !!editingCorrigendum;
    const { showModal } = useModal();

    const initialFormData = {
        en_title: '',
        od_title: '',
        date: '',
        expiry_date: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [file, setFile] = useState(null);
    const [existingFileName, setExistingFileName] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && editingCorrigendum) {
            setFormData({
                en_title: editingCorrigendum.en_title || '',
                od_title: editingCorrigendum.od_title || '',
                date: editingCorrigendum.date || '',
                expiry_date: editingCorrigendum.expiry_date || '',
            });
            setExistingFileName(editingCorrigendum.cor_document || '');
        } else {
            setFormData(initialFormData);
            setExistingFileName('');
        }
        setFile(null);
        setErrors({});
        // Clear the file input visually
        const fileInput = document.getElementById('cor_document');
        if (fileInput) fileInput.value = null;
    }, [editingCorrigendum, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        const selectedFile = selectedFiles[0];
        if (!selectedFile) {
            setFile(null);
            return;
        }
        if (selectedFile.type !== 'application/pdf') {
            setErrors(prev => ({ ...prev, [name]: "Invalid file type. Only PDF is allowed." }));
            e.target.value = null; return;
        }
        if (selectedFile.size > 1 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, [name]: "File size exceeds 1MB." }));
            e.target.value = null; return;
        }
        setErrors(prev => ({ ...prev, [name]: null }));
        setFile(selectedFile);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        if (!formData.expiry_date) newErrors.expiry_date = "Expiry date is required.";
        if (!isEditMode && !file) newErrors.cor_document = "Corrigendum document is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (file) submissionData.append('cor_document', file);

        const url = isEditMode
            ? `${process.env.REACT_APP_API_URL}/corrigendums/${editingCorrigendum.id}`
            : `${process.env.REACT_APP_API_URL}/corrigendums/tenders/${tenderId}/corrigendums`;
        const method = isEditMode ? 'patch' : 'post';

        try {
            await axios[method](url, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            showModal("success", `Corrigendum ${isEditMode ? 'updated' : 'added'} successfully!`);
            onSuccess(); // Notify parent page to refresh
        } catch (error) {
            showModal("error", error.response?.data?.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        if (isEditMode) {
            // If editing, reset to the original data, not blank
            setFormData({
                en_title: editingCorrigendum.en_title || '',
                od_title: editingCorrigendum.od_title || '',
                date: editingCorrigendum.date || '',
                expiry_date: editingCorrigendum.expiry_date || '',
            });
        } else {
            setFormData(initialFormData);
        }
        setFile(null);
        setErrors({});
        const fileInput = document.getElementById('cor_document');
        if (fileInput) fileInput.value = null;
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b">
                {isEditMode ? 'Edit Corrigendum' : 'Add New Corrigendum'}
            </h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Title (English)" name="en_title" value={formData.en_title} onChange={handleChange} error={errors.en_title} />
                    <FormField label="Title (Odia)" name="od_title" value={formData.od_title} onChange={handleChange} error={errors.od_title} />
                    <FormField label="Date" name="date" type="date" value={formData.date} onChange={handleChange} error={errors.date} />
                    <FormField label="Expiry Date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleChange} error={errors.expiry_date} />
                    <div className="md:col-span-2">
                      <FileInput
                        label={isEditMode ? "Replace Corrigendum Document (Optional)" : "Corrigendum Document (Required)"}
                        name="cor_document"
                        onFileChange={handleFileChange}
                        error={errors.cor_document}
                        fileName={file?.name || existingFileName}
                      />
                    </div>
                </div>
                <FormActions
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    onCancel={onCancel} // This will trigger handleCancelEdit on the parent page
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
};

export default CorrigendumForm;