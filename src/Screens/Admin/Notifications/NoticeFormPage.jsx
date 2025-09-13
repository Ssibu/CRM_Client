import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '@/Components/Admin/TextEditor/DocumentUploader';

// NEW: Define the initial empty state for the form fields.
const INITIAL_FORM_STATE = { en_title: '', od_title: '', date: '' };

const NoticeFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showModal } = useModal();

  // "Live" states that the user interacts with
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [file, setFile] = useState(null); // For a newly selected file
  const [existingFileName, setExistingFileName] = useState('');
  const [isFileRemoved, setIsFileRemoved] = useState(false); // Tracks if user removed the existing file

  // NEW: "Original" states to store the initial data snapshot for resetting
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [originalExistingFileName, setOriginalExistingFileName] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch notice data for edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchNoticeData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notices/${id}`, { withCredentials: true });
        const { en_title, od_title, date, doc } = response.data;

        // CHANGED: Structure the fetched data
        const fetchedData = { en_title, od_title, date: date || '' };
        const fetchedFileName = doc || '';

        // CHANGED: Set both the live state for editing...
        setFormData(fetchedData);
        setExistingFileName(fetchedFileName);

        // ...and the backup "original" state for the reset functionality.
        setOriginalData(fetchedData);
        setOriginalExistingFileName(fetchedFileName);

      } catch (error) {
        showModal("error", error.response?.data?.message || "Failed to fetch notice data.");
        navigate('/admin/notifications/notices');
      }
    };
    
    fetchNoticeData();
  }, [id, isEditMode, navigate, showModal]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = useCallback((selectedFile, errorMsg) => {
    if (errorMsg) {
      setErrors(prev => ({ ...prev, doc: errorMsg }));
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setExistingFileName(''); // A new file overrides the existing one
    setIsFileRemoved(false);
    setErrors(prev => ({ ...prev, doc: null }));
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null); // Clear any newly selected file
    setExistingFileName(''); // Clear the name of the existing file
    setIsFileRemoved(true); // Mark that the file was intentionally removed
  }, []);
  
  // Validation logic remains the same
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
    if (!formData.od_title.trim()) newErrors.od_title = "Odia title is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!isEditMode && !file) {
      newErrors.doc = "Notice document is required.";
    }
    // Check if file is required after removing the old one in edit mode
    if (isEditMode && isFileRemoved && !file) {
        newErrors.doc = "A new document is required after removing the old one."
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, file, isEditMode, isFileRemoved]);

  // Submission logic remains the same
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    if (file) {
      submissionData.append('doc', file);
    } else if (isFileRemoved) {
      submissionData.append('removeDoc', 'true'); // Signal to backend to delete the file
    }

    const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/notices/${id}` : `${import.meta.env.VITE_API_BASE_URL}/notices`;
    const method = isEditMode ? 'patch' : 'post';

    try {
      await axios[method](url, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      showModal("success", `Notice ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate('/admin/notifications/notices');
    } catch (error) {
      showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} notice.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, file, id, isEditMode, navigate, showModal, validateForm, isFileRemoved]);

  // CHANGED: The new, unified reset handler.
  const handleReset = useCallback(() => {
    // Revert form fields and existing file name to their original states.
    setFormData(originalData);
    setExistingFileName(originalExistingFileName);

    // Always reset transient states like new files, errors, and the removal flag.
    setFile(null);
    setIsFileRemoved(false);
    setErrors({});

    // Visually clear the file input element in the DOM
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  }, [originalData, originalExistingFileName]);
  
  return (
    <div
      className="min-h-[80vh]"
    >
    <div className="bg-white p-6 shadow">
      <Header title={isEditMode ? "Edit Notice" : "Add New Notice"} onGoBack={() => navigate('/admin/notifications/notices')} />
      <div className="">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Title (English)" placeholder="English title here" name="en_title" type="text" value={formData.en_title} onChange={(value) => handleChange("en_title", value)} error={errors.en_title} required="true" />
            <FormField label="Title (Odia)" placeholder="Odia title here" name="od_title" type="text" value={formData.od_title} onChange={(value) => handleChange("od_title", value)} error={errors.od_title} required="true" />
            <FormField label="Date" name="date" type="date" value={formData.date} onChange={(value) => handleChange("date", value)} error={errors.date} required="true" />
            
            <DocumentUploader
              label="Notice Document"
              name="doc"
              onFileChange={handleFileChange}
              onRemove={handleRemoveFile}
              error={errors.doc}
              allowedTypes={["application/pdf"]}
              maxSizeMB={1}
              required="true"
              file={file} // Pass the new file object
              existingFileName={existingFileName}
              existingFileUrl={
                existingFileName
                  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/notices/${existingFileName}`
                  : null
              }
            />
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            onCancel={() => navigate('/admin/notifications/notices')}
            onReset={handleReset} // <-- Use the new smart reset handler
          />
        </form>
      </div>
    </div>
    </div>
  );
};

export default NoticeFormPage;