
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../context/ModalProvider';
import Header from '../../../Components/Admin/Add/Header';
import FormActions from '../../../Components/Admin/Add/FormActions';
import FormField from '../../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '../../../Components/Admin/TextEditor/DocumentUploader';

const AdvertisementFormPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const { showModal } = useModal();

    const [formData, setFormData] = useState({ ad_link: '' });
    const [files, setFiles] = useState({ en_adphoto: null, od_adphoto: null });
    const [errors, setErrors] = useState({});
    const [existingFileNames, setExistingFileNames] = useState({ en_adphoto: '', od_adphoto: '' });
    const [filesToRemove, setFilesToRemove] = useState({ en_adphoto: false, od_adphoto: false });
    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/advertisements/${id}`, { withCredentials: true })
                .then(response => {
                    const { ad_link, en_adphoto, od_adphoto } = response.data;
                    const initial = { ad_link: ad_link || '' };
                    setFormData(initial);
                    setInitialData(initial);
                    setExistingFileNames({ en_adphoto, od_adphoto });
                })
                .catch(err => {
                    showModal('error', err.response?.data?.message || 'Failed to fetch advertisement data.');
                    navigate('/admin/notifications/advertisements');
                });
        }
    }, [id, isEditMode, navigate, showModal]);

    const handleFileChange = useCallback((file, error, fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        if (error) {
            setFiles(prev => ({ ...prev, [fieldName]: null }));
            return;
        }
        setFiles(prev => ({ ...prev, [fieldName]: file }));
        setFilesToRemove(prev => ({ ...prev, [fieldName]: false }));
        setExistingFileNames(prev => ({...prev, [fieldName]: ''}));
    }, []);

   const handleChange = useCallback((value) => {
    setFormData({ ad_link: value });
}, []);


       const handleRemoveFile = useCallback((fieldName) => {
        setFilesToRemove(prev => ({ ...prev, [fieldName]: true }));
        setExistingFileNames(prev => ({ ...prev, [fieldName]: null }));
        setFiles(prev => ({ ...prev, [fieldName]: null })); // Also clear any staged file
    }, []);



    const validateForm = () => {
        const newErrors = {};
        if (!isEditMode) {
            if (!files.en_adphoto && !existingFileNames.en_adphoto) newErrors.en_adphoto = 'English advertisement photo is required.';
        }
        if (!isEditMode) {
            if (!files.od_adphoto && !existingFileNames.od_adphoto) newErrors.od_adphoto = 'Odia advertisement photo is required.';
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

    const handleReset = useCallback(() => {
        if (isEditMode && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ ad_link: '' });
        }
        setErrors({});
        setFiles({ en_adphoto: null, od_adphoto: null });
        setFilesToRemove({ en_adphoto: false, od_adphoto: false });
        const enInput = document.getElementById('en_adphoto');
        const odInput = document.getElementById('od_adphoto');
        if (enInput) enInput.value = null;
        if (odInput) odInput.value = null;
    }, [isEditMode, initialData]);
    
    return (
        <div className="p-6 min-h-[80vh]">
            <Header title={isEditMode ? 'Edit Advertisement' : 'Add New Advertisement'} onGoBack={() => navigate('/admin/notifications/advertisements')} />
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DocumentUploader
                            label="English Advertisement"
                            file={files.en_adphoto}
                            onFileChange={(file, error) => handleFileChange(file, error, 'en_adphoto')}
                            error={errors.en_adphoto}
                            existingFileName={filesToRemove.en_adphoto ? null : existingFileNames.en_adphoto}
                            existingFileUrl={filesToRemove.en_adphoto ? null : (existingFileNames.en_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.en_adphoto}` : null)}
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                            onRemove={() => handleRemoveFile('en_adphoto')}
                        />
                        <DocumentUploader
                            label="Odia Advertisement"
                            file={files.od_adphoto}
                            onFileChange={(file, error) => handleFileChange(file, error, 'od_adphoto')}
                            error={errors.od_adphoto}
                            existingFileName={filesToRemove.od_adphoto ? null : existingFileNames.od_adphoto}
                            existingFileUrl={filesToRemove.od_adphoto ? null : (existingFileNames.od_adphoto ? `${import.meta.env.VITE_API_BASE_URL}/uploads/advertisements/${existingFileNames.od_adphoto}` : null)}
                            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                            maxSizeMB={1}
                            onRemove={() => handleRemoveFile('od_adphoto')}
                        />
                    </div>
                    <div className="mt-6">
                        <FormField type='url' label="Advertisement Link (Optional)" name="ad_link" value={formData.ad_link} onChange={handleChange} error={errors.ad_link} placeholder="https://example.com" />
                    </div>
                    <FormActions
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        onCancel={() => navigate('/admin/notifications/advertisements')}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
};

export default AdvertisementFormPage;