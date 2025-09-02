// import React, { useState, useEffect, useCallback, memo } from 'react';
// import axios from 'axios';
// import { useModal } from '@/context/ModalProvider';
// import RichTextEditor from '@/Components/TextEditor/RichTextEditor';
// import { ImagePlus } from 'lucide-react';

// const FormField = memo(({ label, name, value, onChange, error }) => (
//     <div>
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
//         <input type="text" id={name} name={name} value={value} onChange={onChange}
//             className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
//         />
//         {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//     </div>
// ));

// const ImageInput = memo(({ label, name, onFileChange, error, previewUrl, existingImageUrl }) => {
//     const imageUrl = previewUrl || (existingImageUrl ? `${import.meta.env.VITE_API_BASE_URL}/uploads/director-desk/${existingImageUrl}` : null);

//     return (
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//             <p className="text-xs text-gray-500 mb-2">Accepts jpg, png, jpeg, webp. Max 1024kb</p>
//             <input type="file" id={name} name={name} accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 mb-2"/>
//             <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
//                 {imageUrl ? (
//                     <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
//                 ) : (
//                     <div className="text-center text-gray-400">
//                         <ImagePlus size={40} className="mx-auto" />
//                         <span>No Photo</span>
//                     </div>
//                 )}
//             </div>
//             {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//         </div>
//     );
// });

// const DirectorDeskPage = () => {
//     const { showModal } = useModal();

//     const [formData, setFormData] = useState({
//         en_title: '', od_title: '',
//         en_director_name: '', od_director_name: '',
//         en_designation: '', od_designation: '',
//         en_message: '', od_message: '',
//     });
//     const [files, setFiles] = useState({ logo: null, photo: null });
//     const [previews, setPreviews] = useState({ logo: null, photo: null });
//     const [existingImages, setExistingImages] = useState({ logo: '', photo: '' });
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [initialData, setInitialData] = useState(null);

//     const fetchData = useCallback(async () => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/director-desk`, {
//                 withCredentials:true
//             });
//             const data = response.data;
//             const initial = {
//                 en_title: data.en_title || '', od_title: data.od_title || '',
//                 en_director_name: data.en_director_name || '', od_director_name: data.od_director_name || '',
//                 en_designation: data.en_designation || '', od_designation: data.od_designation || '',
//                 en_message: data.en_message || '', od_message: data.od_message || '',
//             };
//             setFormData(initial);
//             setExistingImages({ logo: data.logo, photo: data.photo });
//             setInitialData(initial);
//         } catch (error) {
//             showModal('error',  error.response?.data?.message || error.message );
//         }
//     }, [showModal]);

//     useEffect(() => {
//         fetchData();
//         return () => {
//             Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); });
//         };
//     }, [fetchData]);

//     const handleChange = useCallback((e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }, []);

//     const handleRichTextChange = useCallback((name, content) => {
//         setFormData(prev => ({ ...prev, [name]: content }));
//     }, []);

//     const handleFileChange = useCallback((e) => {
//         const { name, files: selectedFiles } = e.target;
//         const file = selectedFiles[0];

//         if (previews[name]) URL.revokeObjectURL(previews[name]);
//         if (!file) {
//             setFiles(prev => ({ ...prev, [name]: null }));
//             setPreviews(prev => ({ ...prev, [name]: null }));
//             return;
//         }

//         const MAX_SIZE = 1024 * 1024;
//         if (file.size > MAX_SIZE) {
//             setErrors(prev => ({ ...prev, [name]: 'File size exceeds 1MB.' }));
//             return;
//         }

//         setErrors(prev => ({ ...prev, [name]: null }));
//         setFiles(prev => ({ ...prev, [name]: file }));
//         setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
//     }, [previews]);
    
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         const submissionData = new FormData();
//         Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
//         if (files.logo) submissionData.append('logo', files.logo);
//         if (files.photo) submissionData.append('photo', files.photo);

//         try {
//             await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/director-desk`, submissionData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             showModal('success', "Director's Desk updated successfully!");
//             fetchData();
//         } catch (error) {
//             showModal('error', error.response?.data?.message || 'Update failed.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleReset = useCallback(() => {
//         if (initialData) {
//             setFormData(initialData);
//             setErrors({});
//             setFiles({ logo: null, photo: null });
//             Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); });
//             setPreviews({ logo: null, photo: null });
//         }
//     }, [initialData, previews]);

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h1 className="text-xl font-bold text-gray-800 mb-6">Manage Director's Desk</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//                         <div className="space-y-4">
//                             <FormField label="Title (In English)" name="en_title" value={formData.en_title} onChange={handleChange} />
//                             <FormField label="Director's Name (In English)" name="en_director_name" value={formData.en_director_name} onChange={handleChange} />
//                             <FormField label="Designation (In English)" name="en_designation" value={formData.en_designation} onChange={handleChange} />
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Message (In English) *</label>
//                                 <RichTextEditor
//                                     key={`en-editor-${initialData ? 'loaded' : 'loading'}`}
//                                     value={formData.en_message}
//                                     onChange={(content) => handleRichTextChange('en_message', content)}
//                                     placeholder="Enter message here..."
//                                 />
//                             </div>
//                             <ImageInput label="Upload Department Logo" name="logo" onFileChange={handleFileChange} error={errors.logo} previewUrl={previews.logo} existingImageUrl={existingImages.logo} />
//                         </div>
//                         <div className="space-y-4">
//                             <FormField label="Title (In Odia)" name="od_title" value={formData.od_title} onChange={handleChange} />
//                             <FormField label="Director's Name (In Odia)" name="od_director_name" value={formData.od_director_name} onChange={handleChange} />
//                             <FormField label="Designation (In Odia)" name="od_designation" value={formData.od_designation} onChange={handleChange} />
//                              <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Message (In Odia) *</label>
//                                 <RichTextEditor
//                                     key={`od-editor-${initialData ? 'loaded' : 'loading'}`}
//                                     value={formData.od_message}
//                                     onChange={(content) => handleRichTextChange('od_message', content)}
//                                     placeholder="Enter message here..."
//                                 />
//                             </div>
//                             <ImageInput label="Upload Director's Photo" name="photo" onFileChange={handleFileChange} error={errors.photo} previewUrl={previews.photo} existingImageUrl={existingImages.photo} />
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-4 mt-8">
//                         <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
//                             {isSubmitting ? 'Updating...' : 'Update'}
//                         </button>
//                         <button type="button" onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
//                             Reset
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default DirectorDeskPage;



import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import { useModal } from '@/context/ModalProvider';

import FormField from '@/Components/TextEditor/FormField';
import DocumentUploader from '@/Components/TextEditor/DocumentUploader';
import RichTextEditor from '@/Components/TextEditor/RichTextEditor';
import { ImagePlus } from 'lucide-react';

const ImagePreview = memo(({ imageUrl, label }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt="Current" className="h-full w-full object-cover" />
            ) : (
                <div className="text-center text-gray-400">
                    <ImagePlus size={40} className="mx-auto" />
                    <span>No Photo</span>
                </div>
            )}
        </div>
    </div>
));

const DirectorDeskPage = () => {
    const { showModal } = useModal();

    const [formData, setFormData] = useState({
        en_title: '', od_title: '',
        en_director_name: '', od_director_name: '',
        en_designation: '', od_designation: '',
        en_message: '', od_message: '',
    });
    
    const [files, setFiles] = useState({ logo: null, photo: null });
    const [errors, setErrors] = useState({});
    const [existingImages, setExistingImages] = useState({ logo: '', photo: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [resetCounter, setResetCounter] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/director-desk`, { withCredentials: true });
            const data = response.data;
            const initial = {
                en_title: data.en_title || '', od_title: data.od_title || '',
                en_director_name: data.en_director_name || '', od_director_name: data.od_director_name || '',
                en_designation: data.en_designation || '', od_designation: data.od_designation || '',
                en_message: data.en_message || '', od_message: data.od_message || '',
            };
            setFormData(initial);
            setInitialData(initial);
            setExistingImages({ logo: data.logo, photo: data.photo });
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Failed to fetch data.');
        }
    }, [showModal]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleChange = useCallback((fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    }, [errors]);

    const handleFileChange = useCallback((file, error, fieldName) => {
        setFiles(prev => ({ ...prev, [fieldName]: file }));
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
        if (!formData.od_title.trim()) newErrors.od_title = "Odia title is required.";
        if (!formData.en_director_name.trim()) newErrors.en_director_name = "English name is required.";
        if (!formData.od_director_name.trim()) newErrors.od_director_name = "Odia name is required.";
        if (!formData.od_designation.trim()) newErrors.od_designation = "Odia name is required.";
        if (!formData.en_designation.trim()) newErrors.en_designation = "Odia name is required.";
        if (!formData.en_message.trim()) newErrors.en_message = "English message is required.";
        if (!formData.od_message.trim()) newErrors.od_message = "Odia message is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showModal('error', 'Please fill all required fields.');
            return;
        }
        setIsSubmitting(true);
        
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
        if (files.logo) submissionData.append('logo', files.logo);
        if (files.photo) submissionData.append('photo', files.photo);

        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/director-desk`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            showModal('success', "Director's Desk updated successfully!");
            fetchData();
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Update failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = useCallback(() => {
        if (initialData) {
            setFormData(initialData);
            setErrors({});
            setFiles({ logo: null, photo: null });
            setResetCounter(c => c + 1);
        }
    }, [initialData]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 mb-6">Manage Director's Desk</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                            <FormField label="Title (In English)" value={formData.en_title} onChange={(val) => handleChange('en_title', val)} error={errors.en_title} required />
                            <FormField label="Director's Name (In English)" value={formData.en_director_name} onChange={(val) => handleChange('en_director_name', val)} error={errors.en_director_name} required />
                            <FormField label="Designation (In English)" value={formData.en_designation} onChange={(val) => handleChange('en_designation', val)} error={errors.en_designation} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (In English) *</label>
                                <RichTextEditor
                                    key={`en-editor-${resetCounter}`}
                                    value={formData.en_message}
                                    onChange={(content) => handleChange('en_message', content)}
                                    error={errors.en_message}
                                />
            
                            </div>
                            <DocumentUploader
                                label="Upload Department Logo"
                                file={files.logo}
                                onFileChange={(file, error) => handleFileChange(file, error, 'logo')}
                                error={errors.logo}
                                existingFileName={existingImages.logo}
                                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                                maxSizeMB={1}
                            />
                            <ImagePreview label="Current Logo" imageUrl={existingImages.logo ? `${import.meta.env.VITE_API_BASE_URL}/uploads/director-desk/${existingImages.logo}` : null} />
                        </div>
                        <div className="space-y-4">
                            <FormField label="Title (In Odia)" value={formData.od_title} onChange={(val) => handleChange('od_title', val)} error={errors.od_title} required />
                            <FormField label="Director's Name (In Odia)" value={formData.od_director_name} onChange={(val) => handleChange('od_director_name', val)} error={errors.od_director_name} required />
                            <FormField label="Designation (In Odia)" value={formData.od_designation} onChange={(val) => handleChange('od_designation', val)} error={errors.od_designation} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message (In Odia) *</label>
                                <RichTextEditor
                                    key={`od-editor-${resetCounter}`}
                                    value={formData.od_message}
                                    onChange={(content) => handleChange('od_message', content)}
                                    error={errors.od_message}
                                />
                            </div>
                            <DocumentUploader
                                label="Upload Director's Photo"
                                file={files.photo}
                                onFileChange={(file, error) => handleFileChange(file, error, 'photo')}
                                error={errors.photo}
                                existingFileName={existingImages.photo}
                                allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                                maxSizeMB={1}
                            />
                            <ImagePreview label="Current Photo" imageUrl={existingImages.photo ? `${import.meta.env.VITE_API_BASE_URL}/uploads/director-desk/${existingImages.photo}` : null} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                        <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DirectorDeskPage;