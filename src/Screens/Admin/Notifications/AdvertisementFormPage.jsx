
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '../../../Components/Admin/TextEditor/DocumentUploader';


// NEW: Define initial empty states for clarity and reusability.
const INITIAL_FORM_STATE = { ad_link: '' };
const INITIAL_FILES_STATE = { en_adphoto: null, od_adphoto: null };
const INITIAL_EXISTING_FILES_STATE = { en_adphoto: '', od_adphoto: '' };

const AdvertisementFormPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { showModal } = useModal();

    // "Live" states that the user interacts with
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [files, setFiles] = useState(INITIAL_FILES_STATE);
    const [existingFileNames, setExistingFileNames] = useState(INITIAL_EXISTING_FILES_STATE);
    const [filesToRemove, setFilesToRemove] = useState({ en_adphoto: false, od_adphoto: false });
    
    // NEW: "Original" states to store the initial data snapshot for resetting
    const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
    const [originalExistingFileNames, setOriginalExistingFileNames] = useState(INITIAL_EXISTING_FILES_STATE);
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;

        const fetchAdData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}`, { withCredentials: true });
                const { ad_link, en_adphoto, od_adphoto } = response.data;

                // CHANGED: Structure the fetched data
                const fetchedData = { ad_link: ad_link || '' };
                const fetchedFileNames = { en_adphoto: en_adphoto || '', od_adphoto: od_adphoto || '' };

                // CHANGED: Set both the live state for editing...
                setFormData(fetchedData);
                setExistingFileNames(fetchedFileNames);

                // ...and the backup "original" state for the reset functionality.
                setOriginalData(fetchedData);
                setOriginalExistingFileNames(fetchedFileNames);
            } catch (err) {
                showModal('error', err.response?.data?.message || 'Failed to fetch advertisement data.');
                navigate('/admin/notifications/advertisements');
            }
        };
        fetchAdData();
    }, [id, isEditMode, navigate, showModal]);

    const handleChange = useCallback((value) => {
        setFormData({ ad_link: value });
        setErrors(prev => ({ ...prev, ad_link: null }));
    }, []);

    const handleFileChange = useCallback((file, error, fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        if (error) {
            setFiles(prev => ({ ...prev, [fieldName]: null }));
            return;
        }
        setFiles(prev => ({ ...prev, [fieldName]: file }));
        setExistingFileNames(prev => ({ ...prev, [fieldName]: '' })); // New file overrides existing
        setFilesToRemove(prev => ({ ...prev, [fieldName]: false }));
    }, []);

    const handleRemoveFile = useCallback((fieldName) => {
        setFiles(prev => ({ ...prev, [fieldName]: null }));
        setExistingFileNames(prev => ({ ...prev, [fieldName]: '' }));
        setFilesToRemove(prev => ({ ...prev, [fieldName]: true }));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        // English photo is required if (it's add mode AND no new file) OR (it's edit mode AND user removed old file AND no new file)
        if ((!isEditMode || filesToRemove.en_adphoto) && !files.en_adphoto) {
            newErrors.en_adphoto = 'English advertisement photo is required.';
        }
        // Odia photo is required if (it's add mode AND no new file) OR (it's edit mode AND user removed old file AND no new file)
        if ((!isEditMode || filesToRemove.od_adphoto) && !files.od_adphoto) {
            newErrors.od_adphoto = 'Odia advertisement photo is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const submissionData = new FormData();
        submissionData.append('ad_link', formData.ad_link);
        if (files.en_adphoto) submissionData.append('en_adphoto', files.en_adphoto);
        if (files.od_adphoto) submissionData.append('od_adphoto', files.od_adphoto);
        if (filesToRemove.en_adphoto) submissionData.append('remove_en_adphoto', 'true');
        if (filesToRemove.od_adphoto) submissionData.append('remove_od_adphoto', 'true');

        const url = isEditMode ? `${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}` : `${import.meta.env.VITE_API_BASE_URL}/advertisements`;
        const method = isEditMode ? 'patch' : 'post';

        try {
            await axios[method](url, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            showModal('success', `Advertisement ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate('/admin/notifications/advertisements');
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // CHANGED: The new, unified reset handler.
    const handleReset = useCallback(() => {
        // Revert form fields and existing file names to their original states.
        setFormData(originalData);
        setExistingFileNames(originalExistingFileNames);

        // Always reset transient states like new files, errors, and removal flags.
        setFiles(INITIAL_FILES_STATE);
        setFilesToRemove({ en_adphoto: false, od_adphoto: false });
        setErrors({});

        // Visually clear the file input elements in the DOM
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
    }, [originalData, originalExistingFileNames]);
    
    return (
        <div
      className="min-h-[80vh]"
    >
        <div className="bg-white p-6 shadow">
            <Header title={isEditMode ? 'Edit Advertisement' : 'Add New Advertisement'} onGoBack={() => navigate('/admin/notifications/advertisements')} />
            <div className="">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DocumentUploader
                            label="English Advertisement"
                            file={files.en_adphoto}
                            existingFileName={existingFileNames.en_adphoto}
                            existingFileUrl={existingFileNames.en_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.en_adphoto}` : null}
                            onFileChange={(file, error) => handleFileChange(file, error, 'en_adphoto')}
                            onRemove={() => handleRemoveFile('en_adphoto')}
                            error={errors.en_adphoto}
                            required="true"
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                        />
                        <DocumentUploader
                            label="Odia Advertisement"
                            file={files.od_adphoto}
                            existingFileName={existingFileNames.od_adphoto}
                            existingFileUrl={existingFileNames.od_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.od_adphoto}` : null}
                            onFileChange={(file, error) => handleFileChange(file, error, 'od_adphoto')}
                            onRemove={() => handleRemoveFile('od_adphoto')}
                            error={errors.od_adphoto}
                            required="true"
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                        />
                    </div>
                    <div className="mt-6">
                        <FormField type='url' label="Advertisement Link (Optional)" name="ad_link" value={formData.ad_link} onChange={handleChange} error={errors.ad_link} placeholder="https://example.com" />
                    </div>
                    <FormActions
                        isSubmitting={isSubmitting}
                        isEditMode={isEditMode}
                        onCancel={() => navigate('/admin/notifications/advertisements')}
                        onReset={handleReset} // <-- Use the new smart reset handler
                    />
                </form>
            </div>
        </div>
        </div>
    );
};

export default AdvertisementFormPage;