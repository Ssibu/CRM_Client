
import React, { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import { useModal } from '../../context/ModalProvider';
import FormField from '../../Components/Admin/TextEditor/FormField';
import DocumentUploader from '../../Components/Admin/TextEditor/DocumentUploader';
import { ImagePlus } from 'lucide-react';
import FormActions from '@/Components/Admin/Add/FormActions';

const ImagePreview = memo(({ imageUrl }) => {
    return (
        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
                <div className="text-center text-gray-400">
                    <ImagePlus size={40} className="mx-auto" />
                    <span>No Photo</span>
                </div>
            )}
        </div>
    );
});

const HomeAdminForm = memo(({ admin, index, onDataChange, onFileChange }) => (
    <div className="">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Home Admin {index + 1}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            <FormField 
                label="Name (In English)" 
                value={admin.en_name} 
                onChange={(value) => onDataChange(index, 'en_name', value)} 
                required 
                error={admin.errors?.en_name}
                maxLength={100}
            />
            <FormField 
                label="Name (In Odia)" 
                value={admin.od_name} 
                onChange={(value) => onDataChange(index, 'od_name', value)} 
                required
                error={admin.errors?.od_name}
                maxLength={100}
            />
            <FormField 
                label="Designation (In English)" 
                value={admin.en_designation} 
                onChange={(value) => onDataChange(index, 'en_designation', value)}
                required
                error={admin.errors?.en_designation}
                maxLength={55}
            />
            <FormField 
                label="Designation (In Odia)" 
                value={admin.od_designation} 
                onChange={(value) => onDataChange(index, 'od_designation', value)}
                required
                error={admin.errors?.od_designation}
                maxLength={55}
            />
            
            <div className="flex flex-col gap-4">
                <DocumentUploader
                required
                    label="Upload Image"
                    file={admin.file}
                    onFileChange={(file, error) => onFileChange(index, file, error)}
                    allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                    maxSizeMB={1}
                    error={admin.errors?.image}
                />
                <ImagePreview 
                    imageUrl={admin.previewUrl || (admin.image ? `${import.meta.env.VITE_API_BASE_URL}/uploads/home-admins/${admin.image}` : null)} 
                />
            </div>
        </div>
    </div>
));

const HomeAdminPage = () => {
    const { showModal } = useModal();
    const [admins, setAdmins] = useState([]);
    const [initialAdmins, setInitialAdmins] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, { withCredentials: true });
            const dataWithUIState = response.data.map(admin => ({ 
                ...admin, 
                file: null, 
                previewUrl: null, 
                removeImage: false,
                errors: {} // Initialize errors object for each admin
            }));
            setAdmins(dataWithUIState);
            setInitialAdmins(JSON.parse(JSON.stringify(dataWithUIState)));
        } catch (error) {
            showModal('error', error.response?.data?.message || 'Failed to fetch data.');
        }
    }, [showModal]);

    useEffect(() => {
        fetchData();
        return () => { admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); }); };
    }, [fetchData]);

    const handleDataChange = useCallback((index, field, value) => {
        setAdmins(prevAdmins => 
            prevAdmins.map((admin, idx) => 
                idx === index ? { ...admin, [field]: value, errors: { ...admin.errors, [field]: null } } : admin
            )
        );
    }, []);
    
    const handleFileChange = useCallback((index, file, error) => {
        setAdmins(prevAdmins => 
            prevAdmins.map((admin, idx) => {
                if (idx === index) {
                    if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl);
                    return {
                        ...admin,
                        file: file,
                        previewUrl: file ? URL.createObjectURL(file) : null,
                        removeImage: false,
                        errors: { ...admin.errors, image: error }
                    };
                }
                return admin;
            })
        );
    }, []);



    const validateForms = () => {
        let isValid = true;
        const newAdminsState = admins.map(admin => {
            const newErrors = {};
            if (!admin.en_name?.trim()) newErrors.en_name = "English name is required.";
            if (!admin.od_name?.trim()) newErrors.od_name = "Odia name is required.";
            if (!admin.en_designation?.trim()) newErrors.en_designation = "English designation is required.";
            if (!admin.od_designation?.trim()) newErrors.od_designation = "Odia designation is required.";
            if (!admin.image && !admin.file) newErrors.image = "An image is required.";
            
            if (Object.keys(newErrors).length > 0) {
                isValid = false;
            }
            return { ...admin, errors: newErrors };
        });
        setAdmins(newAdminsState);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForms()) {
            showModal('error', 'Please fill all required fields for each member.');
            return;
        }

        setIsSubmitting(true);
        const submissionData = new FormData();
        const dataToSubmit = admins.map(({ file, previewUrl, errors, ...rest }) => ({ ...rest }));
        submissionData.append('data', JSON.stringify(dataToSubmit));
        
        admins.forEach(admin => {
            if (admin.file) {
                const newFileName = `home_admin_${admin.id}_${admin.file.name}`;
                submissionData.append('images', admin.file, newFileName);
            }
        });

        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/home-admins`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            showModal('success', 'Members updated successfully!');
            fetchData();
        } catch (error) {
            showModal('error', error.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = useCallback(() => {
        admins.forEach(admin => { if (admin.previewUrl) URL.revokeObjectURL(admin.previewUrl); });
        setAdmins(JSON.parse(JSON.stringify(initialAdmins)));
    }, [initialAdmins, admins]);

    return (
        <div className="bg-white min-h-screen p-6 shadow">
            <div className="space-y-6">
                {admins.map((admin, index) => (
                    <HomeAdminForm
                        key={admin.id}
                        admin={admin}
                        index={index}
                        onDataChange={handleDataChange}
                        onFileChange={handleFileChange}
                    />
                ))}
                <div className="flex items-center gap-4 pt-4">
                  
                    <FormActions
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    />
                </div>
            </div>
        </div>
    );
};

export default HomeAdminPage;