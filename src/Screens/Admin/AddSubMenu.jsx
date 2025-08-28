import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Reusable Components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
import ImageUploader from "../../Components/TextEditor/ImageUploader";

const API_BASE_URL = "http://localhost:7777"; 

const AddSubMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        menuId: "", // Parent Menu ID
        titleEnglish: "",
        titleOdia: "",
        descriptionEnglish: "",
        descriptionOdia: "",
        link: "",
        image: null,
    });

    const [parentMenus, setParentMenus] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial data (parent menus, and submenu data if editing)
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const menusResponse = await axios.get(`${API_BASE_URL}/api/menus`);
                setParentMenus(menusResponse.data || []);

                if (isEditMode) {
                    const subMenuResponse = await axios.get(`${API_BASE_URL}/api/submenus/${id}`);
                    const subMenu = subMenuResponse.data;
                    setFormData({
                        menuId: subMenu.menuId || "",
                        titleEnglish: subMenu.title_en || "",
                        titleOdia: subMenu.title_od || "",
                        descriptionEnglish: subMenu.description_en || "",
                        descriptionOdia: subMenu.description_od || "",
                        link: subMenu.link || "",
                        image: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                alert('Could not load required data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id, isEditMode]);

    const handleInputChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleImageChange = useCallback((file) => {
        setFormData((prev) => ({ ...prev, image: file }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.menuId || !formData.titleEnglish.trim() || !formData.titleOdia.trim()) {
            alert("Parent Menu, Title (English), and Title (Odia) are required.");
            return;
        }

        setIsSubmitting(true);
        const dataToSubmit = new FormData();
        dataToSubmit.append('menuId', formData.menuId);
        dataToSubmit.append('title_en', formData.titleEnglish);
        dataToSubmit.append('title_od', formData.titleOdia);
        dataToSubmit.append('description_en', formData.descriptionEnglish);
        dataToSubmit.append('description_od', formData.descriptionOdia);
        dataToSubmit.append('link', formData.link);
        if (formData.image instanceof File) {
            dataToSubmit.append('image', formData.image);
        }

        try {
            const url = isEditMode ? `${API_BASE_URL}/api/submenus/${id}` : `${API_BASE_URL}/api/submenus`;
            const method = isEditMode ? 'put' : 'post';
            await axios[method](url, dataToSubmit, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(`SubMenu ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate("/admin/menusetup/submenu");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`Error: ${error.response?.data?.message || "An error occurred."}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleGoBack = () => navigate(-1);

    if (isLoading) {
        return <div className="text-center p-10 font-semibold">Loading Form...</div>;
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50 p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Header title={isEditMode ? "Edit SubMenu" : "Add SubMenu"} onGoBack={handleGoBack} />
            <form onSubmit={handleSubmit}>
                <div className="space-y-6 mt-6">
                    {/* Top Section with Titles and Image */}
                    <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Parent Menu *</label>
                            <select value={formData.menuId} onChange={(e) => handleInputChange("menuId", e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
                                <option value="">-- Select a Menu --</option>
                                {parentMenus.map((menu) => (
                                    <option key={menu.id} value={menu.id}>{menu.title_en}</option>
                                ))}
                            </select>
                        </div>
                        <FormField label="Title (In English) *" value={formData.titleEnglish} onChange={(val) => handleInputChange("titleEnglish", val)} />
                        <FormField label="Title (In Odia) *" value={formData.titleOdia} onChange={(val) => handleInputChange("titleOdia", val)} />
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploader onChange={handleImageChange} />
                            <FormField label="Link (Optional)" value={formData.link} onChange={(val) => handleInputChange("link", val)} />
                        </div>
                    </div>

                    {/* Description Section with Corrected Labels */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (In English)
                            </label>
                            <RichTextEditor 
                                value={formData.descriptionEnglish} 
                                onChange={(val) => handleInputChange("descriptionEnglish", val)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description (In Odia)
                            </label>
                            <RichTextEditor 
                                value={formData.descriptionOdia} 
                                onChange={(val) => handleInputChange("descriptionOdia", val)}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <FormActions
                    onCancel={handleGoBack}
                    isSubmitting={isSubmitting}
                    isEditMode={isEditMode}
                />
            </form>
        </motion.div>
    );
};

export default AddSubMenu;