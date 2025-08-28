import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Import shared components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
import FormField from "../../Components/TextEditor/FormField";
import ImageUploader from "../../Components/TextEditor/ImageUploader";

const API_BASE_URL = "http://localhost:7777";

const AddSubSubMenuForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // State for all form fields
  const [formData, setFormData] = useState({
    menu: "",
    subMenuId: "",
    titleEnglish: "",
    titleOdia: "",
    link: "",
    image: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    descriptionEnglish: "",
    descriptionOdia: "",
  });

  // State for dropdown options
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data needed for the form
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [menusResponse, subMenusResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/menus`),
            axios.get(`${API_BASE_URL}/api/submenus`)
        ]);
        
        setMenus(menusResponse.data || []);
        setSubMenus(subMenusResponse.data || []);

        if (isEditMode) {
          const res = await axios.get(`${API_BASE_URL}/api/subsubmenus/${id}`);
          const data = res.data;
          
          const parentSubMenu = (subMenusResponse.data || []).find(sm => sm.id === data.subMenuId);

          setFormData({
            menu: parentSubMenu ? parentSubMenu.menuId : "",
            subMenuId: data.subMenuId,
            titleEnglish: data.title_en || "",
            titleOdia: data.title_od || "",
            descriptionEnglish: data.description_en || "",
            descriptionOdia: data.description_od || "",
            link: data.link || "",
            metaTitle: data.meta_title || "",
            metaKeyword: data.meta_keyword || "",
            metaDescription: data.meta_description || "",
            image: null,
          });
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        alert('Could not load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEditMode]);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    if (field === 'menu') {
        setFormData((prev) => ({ ...prev, [field]: value, subMenuId: "" }));
    } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleImageChange = useCallback((file) => {
    handleInputChange("image", file);
  }, [handleInputChange]);
  
  // Memoize the filtered submenus for performance
  const filteredSubMenus = useMemo(() => {
    if (!formData.menu) return [];
    return subMenus.filter(sm => sm.menuId === parseInt(formData.menu, 10));
  }, [formData.menu, subMenus]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dataToSubmit = new FormData();
    dataToSubmit.append('subMenuId', formData.subMenuId);
    dataToSubmit.append('title_en', formData.titleEnglish);
    dataToSubmit.append('title_od', formData.titleOdia);
    dataToSubmit.append('description_en', formData.descriptionEnglish);
    dataToSubmit.append('description_od', formData.descriptionOdia);
    dataToSubmit.append('link', formData.link);
    dataToSubmit.append('meta_title', formData.metaTitle);
    dataToSubmit.append('meta_keyword', formData.metaKeyword);
    dataToSubmit.append('meta_description', formData.metaDescription);
    if (formData.image instanceof File) {
        dataToSubmit.append('image', formData.image);
    }

    try {
      const url = isEditMode ? `${API_BASE_URL}/api/subsubmenus/${id}` : `${API_BASE_URL}/api/subsubmenus`;
      const method = isEditMode ? 'put' : 'post';
      
      await axios[method](url, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert(`Sub-SubMenu ${isEditMode ? 'updated' : 'added'} successfully!`);
      navigate("/admin/menusetup/subsubmenu");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoBack = () => navigate(-1);
  
  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Header title={isEditMode ? "Edit Sub-SubMenu" : "Add Sub-SubMenu"} onGoBack={handleGoBack} />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Section */}
            <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Menu *</label>
                    <select value={formData.menu} onChange={(e) => handleInputChange("menu", e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
                        <option value="">-- Select a Menu --</option>
                        {menus.map((menu) => <option key={menu.id} value={menu.id}>{menu.title_en}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select SubMenu *</label>
                    <select value={formData.subMenuId} onChange={(e) => handleInputChange("subMenuId", e.target.value)} className="w-full px-3 py-2 border rounded-md" required disabled={!formData.menu}>
                        <option value="">-- Select a SubMenu --</option>
                        {filteredSubMenus.map((subMenu) => <option key={subMenu.id} value={subMenu.id}>{subMenu.title_en}</option>)}
                    </select>
                </div>
                <FormField label="Title (In English) *" value={formData.titleEnglish} onChange={(val) => handleInputChange("titleEnglish", val)} />
                <FormField label="Title (In Odia) *" value={formData.titleOdia} onChange={(val) => handleInputChange("titleOdia", val)} />
                <div className="md:col-span-2"><FormField label="Link (Optional)" value={formData.link} onChange={(val) => handleInputChange("link", val)} /></div>
                <div className="md:col-span-2"><ImageUploader onChange={handleImageChange} /></div>
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
            
            {/* Meta Fields Section */}
            <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField label="Meta Title" value={formData.metaTitle} onChange={(val) => handleInputChange("metaTitle", val)} />
                <FormField label="Meta Keywords" value={formData.metaKeyword} onChange={(val) => handleInputChange("metaKeyword", val)} />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea value={formData.metaDescription} onChange={(e) => handleInputChange("metaDescription", e.target.value)} className="w-full px-3 py-2 border rounded-md" rows="3" />
                </div>
            </div>

            {/* Action Buttons */}
            <FormActions onCancel={handleGoBack} isSubmitting={isSubmitting} isEditMode={isEditMode} />
        </form>
      )}
    </motion.div>
  );
};

export default AddSubSubMenuForm;