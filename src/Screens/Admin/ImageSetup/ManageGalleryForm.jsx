

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import { useModal } from "../../../context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

const ManageGallaryForm = () => {
  const [formData, setFormData] = useState({
    en_category: "",
    od_category: "",
    category_type: "",
    thumbnail: null,
    thumbnail_name: "",
    thumbnail_url: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingThumbnailRemoved, setExistingThumbnailRemoved] =
    useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showModal } = useModal();

  const handleCancel = () => {
    navigate("/admin/image-setup/manage-galary");
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchCategoryById = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/image-setup/category/${id}`,
            { withCredentials: true }
          );

          const {
            en_category,
            od_category,
            category_type,
            thumbnail,
            thumbnail_url,
          } = res.data.category;

          const fetchedData = {
            en_category: en_category || "",
            od_category: od_category || "",
            category_type: (category_type || "").toLowerCase(),
            thumbnail: null,
            thumbnail_name: thumbnail || "",
            thumbnail_url: thumbnail_url || "",
          };

          setFormData(fetchedData);
          setInitialData(fetchedData);
          setExistingThumbnailRemoved(false);
          setErrors({});
        } catch (error) {
          showModal("error", "Failed to fetch category data.");
          console.error("Failed to fetch category:", error);
        }
      };

      fetchCategoryById();
    } else {
      setInitialData(null);
    }
  }, [id, isEditMode, showModal]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toLowerCase(),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleThumbnailChange = (file, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setErrors((prev) => ({ ...prev, thumbnail: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnail_name: "",
        thumbnail_url: "",
      }));
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
      setExistingThumbnailRemoved(false);
    }
  };

  const handleThumbnailRemove = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnail_name: "",
      thumbnail_url: "",
    }));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
    setExistingThumbnailRemoved(true);
  };

  const validate = () => {
    const newErrors = {};
    // data.append("category_type", formData.category_type);
    if(!formData.category_type){
       newErrors.category_type  = "Category Type is required.";
    }

    if (!formData.en_category.trim())
      newErrors.en_category = "Category (English) is required.";
    if (!formData.od_category.trim())
      newErrors.od_category = "Category (Odia) is required.";

    if (!formData.thumbnail && !formData.thumbnail_url && !isEditMode) {
      newErrors.thumbnail = "Thumbnail is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append("en_category", formData.en_category);
    data.append("od_category", formData.od_category);
    data.append("category_type", formData.category_type);

    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    } else if (isEditMode && existingThumbnailRemoved) {
      data.append("thumbnail", "");
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/image-setup/update-category/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Gallery category updated successfully.");
      } else {
        await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/image-setup/register-category`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Gallery category created successfully.");
      }

      navigate("/admin/image-setup/manage-galary");
    } catch (error) {
      showModal(
        "error",
        error.response?.data?.message || "Failed to submit the form."
      );
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && initialData) {
      setFormData(initialData);
      setExistingThumbnailRemoved(false);
    } else {
      setFormData({
        en_category: "",
        od_category: "",
        category_type: "",
        thumbnail: null,
        thumbnail_name: "",
        thumbnail_url: "",
      });
      setExistingThumbnailRemoved(false);
    }
    setErrors({});
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit Gallery Category" : "Add Gallery Category"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-">
            <label className="block text-sm font-medium text-gray-700">
              Category Type <span className="text-red-500">*</span>
            </label>
     <select
  name="category_type" 
  
  
  value={formData.category_type}
  onChange={handleSelectChange}
  className={`mt-1 block w-full border  ${
          errors.category_type ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2.5`}
>
  <option value="">-- Select Category Type --</option>
  <option value="photo">Photo</option>
  <option value="video">Video</option>
</select>
{errors.category_type && (
  <p className="text-red-600 text-sm mt-1">{errors.category_type}</p>
)}

          </div>
          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Category (English)"
              placeholder="Category in English"
              type="text"
              name="en_category"
              value={formData.en_category}
              onChange={(value) => handleFormFieldChange("en_category", value)}
              error={errors.en_category}
            />
          </div>

          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Category (Odia)"
              placeholder="Category in Odia"
              type="text"
              name="od_category"
              value={formData.od_category}
              onChange={(value) => handleFormFieldChange("od_category", value)}
              error={errors.od_category}
            />
          </div>

          <div className="mb-">
            <DocumentUploader
            required
              label="Upload Thumbnail"
              file={formData.thumbnail}
              existingFileName={formData.thumbnail_name}
              existingFileUrl={formData.thumbnail_url}
              onFileChange={handleThumbnailChange}
              onRemove={handleThumbnailRemove}
                allowedTypes={['image/jpg', 'image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={3}
              error={errors.thumbnail}
            />
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default ManageGallaryForm;