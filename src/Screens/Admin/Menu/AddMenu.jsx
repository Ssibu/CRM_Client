import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// External components
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";
import FormField from "@/Components/Admin/TextEditor/FormField";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal.jsx";
import Header from "@/Components/Admin/Add/Header.jsx";
import FormActions from "@/Components/Admin/Add/FormActions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DescriptionFields = memo(({ formData, onInputChange, errors }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    {/* English Description */}
    <div className="md:col-span-2">
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
          onChange={(val) => onInputChange("en_description", val)}
          placeholder="Enter description..."
        />
      </div>
      {errors?.en_description && (
        <p className="mt-1 text-xs text-red-600">{errors.en_description}</p>
      )}
    </div>

    {/* Odia Description */}
    <div className="md:col-span-2">
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
          onChange={(val) => onInputChange("od_description", val)}
          placeholder="Enter description..."
        />
      </div>
      {errors?.od_description && (
        <p className="mt-1 text-xs text-red-600">{errors.od_description}</p>
      )}
    </div>
  </div>
));

const AddMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    en_description: "",
    od_description: "",
    link: "",
    image: null, // File or null
  });

  const [existingImageInfo, setExistingImageInfo] = useState({
    name: "",
    url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (isEditMode) {
  const fetchMenuData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/menus/${id}`, {
      withCredentials: true,
    });
    const menu = res.data;

    // Define once and reuse
    const fetchedData = {
      en_title: menu.en_title || "",
      od_title: menu.od_title || "",
      en_description: menu.en_description || "",
      od_description: menu.od_description || "",
      link: menu.link || "",
      image: null,
    };

    setFormData(fetchedData);
    setInitialData(fetchedData);

    if (menu.image_url) {
      const urlParts = menu.image_url.split("/");
      setExistingImageInfo({
        name: urlParts[urlParts.length - 1],
        url: `${API_BASE_URL}${menu.image_url}`,
      });
    }
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    setModalVariant("error");
    setModalMessage("Could not load menu data for editing.");
    setModalOpen(true);
    navigate("/admin/menusetup/menu");
  } finally {
    setIsLoading(false);
  }
};

      fetchMenuData();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, image: error }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: "" }));
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setExistingImageInfo({ name: "", url: "" });
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageInfo({ name: "", url: "" });
    setErrors((prev) => ({ ...prev, image: "" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let newErrors = {};

    if (!formData.en_title.trim())
      newErrors.en_title = "Title (In English) is required";
    if (!formData.od_title.trim())
      newErrors.od_title = "Title (In Odia) is required";
    if (!formData.en_description.trim())
      newErrors.en_description = "Description (In English) is required";
    if (!formData.od_description.trim())
      newErrors.od_description = "Description (In Odia) is required";
    if (!formData.image && !isEditMode)
      newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("en_title", formData.en_title);
    data.append("od_title", formData.od_title);
    data.append("en_description", formData.en_description);
    data.append("od_description", formData.od_description);
    data.append("link", formData.link || "");

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    if (isEditMode && !formData.image && !existingImageInfo.url) {
      data.append("remove_image", "true");
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/menus/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("Menu updated successfully!");
        setModalOpen(true);
      } else {
        await axios.post(`${API_BASE_URL}/api/menus`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setModalVariant("success");
        setModalMessage("Menu added successfully!");
        setModalOpen(true);
      }
    } catch (error) {
  console.error("Error submitting form:", error);

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    // setErrors(errors); 
    // highlight fields

    // Show first field error in modal
    const firstErrorMsg = Object.values(errors)[0];
    setModalVariant("error");
    setModalMessage(firstErrorMsg);
    setModalOpen(true);

  } else if (error.response?.data?.message) {
    setModalVariant("error");
    setModalMessage(error.response.data.message);
    setModalOpen(true);
  } else {
    setModalVariant("error");
    setModalMessage("An error occurred.");
    setModalOpen(true);
  }
}  finally {
      setIsSubmitting(false);
    }
  };


  const handleReset = () => {
  if (isEditMode && initialData) {
    // Restore API-fetched original data
    setFormData(initialData);
  } else {
    // Clear fields in Add mode
    setFormData({
      en_title: "",
      od_title: "",
      en_description: "",
      od_description: "",
      link: "",
      image: null,
    });
    setExistingImageInfo({ name: "", url: "" });
  }
  setErrors({});
};

  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-white p-6">
      <Header
        title={isEditMode ? "Edit Menu" : "Add Menu"}
        onGoBack={handleGoBack}
      />

      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form Data...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              label="Title (In English)"
              placeholder="Enter title in English"
              value={formData.en_title}
              onChange={(val) => handleInputChange("en_title", val)}
              required
              error={errors?.en_title}
              maxLength={35}
            />
            <FormField
              label="Title (In Odia)"
              placeholder="Enter title in Odia"
              value={formData.od_title}
              onChange={(val) => handleInputChange("od_title", val)}
              required
              error={errors?.od_title}
              maxLength={35}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
              <DocumentUploader
                label="Upload Image"
                file={formData.image}
                existingFileName={existingImageInfo.name}
                existingFileUrl={`${import.meta.env.VITE_API_BASE_URL}/uploads/menus/${existingImageInfo.name}`}
                onFileChange={handleImageChange}
                onRemove={handleRemoveImage}
                error={errors.image}
                allowedTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                  "image/gif",
                ]}
                maxSizeMB={5}
                required="true"
              />

              <FormField
                label="Link (Optional)"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(val) => handleInputChange("link", val)}
                type="url"
              />
            </div>
          </div>

          <DescriptionFields
            formData={formData}
            onInputChange={handleInputChange}
            errors={errors}
          />

          <FormActions
            onReset={handleReset}
            onCancel={handleGoBack}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      )}

      <ModalDialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (modalVariant === "success") {
            navigate("/admin/menusetup/menu", { state: { updated: true } });
          }
        }}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default AddMenu;
