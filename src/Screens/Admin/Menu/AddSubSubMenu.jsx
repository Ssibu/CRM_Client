

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Shared components
import Header from "@/Components/Admin/Add/Header";
import FormActions from "@/Components/Admin/Add/FormActions";
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddSubSubMenuForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
const [initialData, setInitialData] = useState(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    menu: "",
    subMenuId: "",
    en_title: "",
    od_title: "",
    link: "",
    image: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    en_description: "",
    od_description: "",
  });

  const [existingImageInfo, setExistingImageInfo] = useState({ name: "", url: "" });
  const [errors, setErrors] = useState({});
  const [menus, setMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");


useEffect(() => {
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch menus and submenus
      const [menusRes, subMenusRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/menus/list`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/submenus/list`, { withCredentials: true }),
      ]);

      setMenus(menusRes.data || []);
      setSubMenus(subMenusRes.data || []);

      if (isEditMode) {
        const res = await axios.get(`${API_BASE_URL}/api/subsubmenus/${id}`, { withCredentials: true });
        const data = res.data;

        const fetchedData = {
          menu: data.SubMenu ? data.SubMenu.menuId : "",
          subMenuId: data.subMenuId,
          en_title: data.en_title || "",
          od_title: data.od_title || "",
          en_description: data.en_description || "",
          od_description: data.od_description || "",
          link: data.link || "",
          metaTitle: data.meta_title || "",
          metaKeyword: data.meta_keyword || "",
          metaDescription: data.meta_description || "",
          image: null,
        };

        setFormData(fetchedData);
        setInitialData(fetchedData); //  store original for reset

        if (data.image_url) {
          const parts = data.image_url.split("/");
          const fileName = parts[parts.length - 1];
          setExistingImageInfo({
            name: fileName,
            url: `${API_BASE_URL}/${data.image_url}`,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching:", err.response?.data || err.message);
      setModalVariant("error");
      setModalMessage(err.response?.data?.message || "Could not load initial form data.");
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  fetchInitialData();
}, [id, isEditMode]);



    const handleInputChange = useCallback((field, value) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "menu") {
      setFormData((prev) => ({ ...prev, [field]: value, subMenuId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleImageChange = useCallback((file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setExistingImageInfo({ name: "", url: "" });
    setIsImageRemoved(false); 
  }, []);
  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageInfo({ name: "", url: "" });
      setIsImageRemoved(true);   
  }, []);

  const filteredSubMenus = useMemo(() => {
    if (!formData.menu) return [];
    return subMenus.filter((sm) => sm.menuId === parseInt(formData.menu, 10));
  }, [formData.menu, subMenus]);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.menu) errs.menu = "Menu is required";
    if (!formData.subMenuId) errs.subMenuId = "SubMenu is required";
    if (!formData.en_title.trim())
      errs.en_title = "Title (English) is required";
    if (!formData.od_title.trim())
      errs.od_title = "Title (Odia) is required";
     if (!formData.image && !isEditMode && !existingImageInfo.url)
      errs.image = "Image is required";
    if (!formData.en_description.trim())
      errs.en_description = "Description (English) is required";
    if (!formData.od_description.trim())
      errs.od_description = "Description (Odia) is required";
    return errs;
  };


const handleReset = () => {
  if (isEditMode && initialData) {
    // Reset back to original API values
    setFormData(initialData);
  } else {
    // Add mode → reset to empty
    setFormData({
      menu: "",
      subMenuId: "",
      en_title: "",
      od_title: "",
      link: "",
      image: null,
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      en_description: "",
      od_description: "",
    });
    setExistingImageInfo({ name: "", url: "" });
  }
  setErrors({});
  setIsImageRemoved(false);
};

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = new FormData();
    dataToSubmit.append("subMenuId", formData.subMenuId);
    dataToSubmit.append("en_title", formData.en_title);
    dataToSubmit.append("od_title", formData.od_title);
    dataToSubmit.append("en_description", formData.en_description);
    dataToSubmit.append("od_description", formData.od_description);
    dataToSubmit.append("link", formData.link);
    dataToSubmit.append("meta_title", formData.metaTitle);
    dataToSubmit.append("meta_keyword", formData.metaKeyword);
    dataToSubmit.append("meta_description", formData.metaDescription);

    if (formData.image instanceof File) {
      dataToSubmit.append("image", formData.image);
    }
 
    if (isEditMode && isImageRemoved) {
  dataToSubmit.append("remove_image", "true");   
}

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/api/subsubmenus/${id}`
        : `${API_BASE_URL}/api/subsubmenus`;
      const method = isEditMode ? "put" : "post";

      await axios[method](url, dataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },withCredentials:true
      });

      setModalVariant("success");
      setModalMessage(
        `Sub-SubMenu ${isEditMode ? "updated" : "added"} successfully!`
      );
      setModalOpen(true);
      setTimeout(() => navigate("/admin/menusetup/subsubmenu"), 1000);
    } catch (err) {
      console.error("Error submitting:", err);
      setModalVariant("error");
      setModalMessage(err.response?.data?.message || "An error occurred.");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => navigate(-1);
    
  return (
    <div className=" bg-white p-6">
      <Header
        title={isEditMode ? "Edit Sub-SubMenu" : "Add Sub-SubMenu"}
        onGoBack={handleGoBack}
      />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

   
            {/* Menu & SubMenu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Menu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.menu}
                  onChange={(e) => handleInputChange("menu", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.menu ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select a Menu --</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.en_title}
                    </option>
                  ))}
                </select>
                {errors.menu && (
                  <p className="text-xs text-red-600 mt-1">{errors.menu}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select SubMenu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subMenuId}
                  onChange={(e) =>
                    handleInputChange("subMenuId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.subMenuId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={!formData.menu}
                >
                  <option value="">-- Select a SubMenu --</option>
                  {filteredSubMenus.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.en_title}
                    </option>
                  ))}
                </select>
                {errors.subMenuId && (
                  <p className="text-xs text-red-600 mt-1">{errors.subMenuId}</p>
                )}
              </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title (In English)"
                placeholder="Enter Title In English"
                required
                value={formData.en_title}
                onChange={(val) => handleInputChange("en_title", val)}
                error={errors.en_title}
              />
              <FormField
                label="Title (In Odia)"
                 placeholder="Enter Title In Odia"
                required
                value={formData.od_title}
                onChange={(val) => handleInputChange("od_title", val)}
                error={errors.od_title}
              />
            </div>

         <div className="grid grid-cols-2 gap-6" >

          
            {/* Image */}
            <DocumentUploader
              label="Upload Image"
              file={formData.image}
              existingFileName={existingImageInfo.name}
              existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/subsubmenus/${existingImageInfo.name}`}
              onFileChange={handleImageChange}
                  onRemove={handleRemoveImage}
              error={errors.image}
              allowedTypes={[
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/webp",
              ]}
              maxSizeMB={5}
            />
             {/* Link */}
            <FormField
              label="Link (Optional)"
               placeholder="https://example.com"
              value={formData.link}
              onChange={(val) => handleInputChange("link", val)}
            />

         </div>

            {/* Descriptions */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Description (In English) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.en_description ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.en_description}
      onChange={(val) => handleInputChange("en_description", val)}
      placeholder="Enter description..."
      className="w-full"
    />
  </div>
  {errors.en_description && (
    <p className="mt-1 text-xs text-red-600">{errors.en_description}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Description (In Odia) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.od_description ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.od_description}
      onChange={(val) => handleInputChange("od_description", val)}
      placeholder="Enter description..."
    />
  </div>
  {errors.od_description && (
    <p className="mt-1 text-xs text-red-600">{errors.od_description}</p>
  )}
</div>


            {/* Meta info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Meta Title"
                 placeholder="Enter Meta Title"
                value={formData.metaTitle}
                onChange={(val) => handleInputChange("metaTitle", val)}
              />
              <FormField
                label="Meta Keywords"
                 placeholder="Enter Meta Keywords"
                value={formData.metaKeyword}
                onChange={(val) => handleInputChange("metaKeyword", val)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
              />
            </div>
          {/* </div> */}

          {/* Actions */}
          <FormActions
            onReset={handleReset}
            onCancel={handleGoBack}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      )}

      {/* Modal */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default AddSubSubMenuForm;