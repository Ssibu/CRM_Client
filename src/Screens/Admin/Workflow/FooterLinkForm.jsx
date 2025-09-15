import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";

// Import your reusable components
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/footerlinks`;

const initialState = {
  en_link_text: "",
  od_link_text: "",
  url: "",
  linkType: "",
};

const FooterlinkForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(initialState);

  useEffect(() => {
    if (isEditMode) {
      const fetchLink = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, {
            withCredentials: true,
          });
          setFormData(response.data);
          setOriginalData(response.data);
        } catch (error) {
          showModal("error", "Failed to load link data for editing.");
          console.error("Error fetching link data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLink();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation function to check all fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_link_text.trim()) {
      newErrors.en_link_text = "English Link Text is required.";
    }
    if (!formData.od_link_text.trim()) {
      newErrors.od_link_text = "Odia Link Text is required.";
    }
    if (!formData.url.trim()) {
      newErrors.url = "URL is required.";
    }
    if (!formData.linkType.trim()) {
    newErrors.linkType = "Link Type is required.";  
  }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop submission
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData, {
            withCredentials: true,
          });
        showModal("success", "Footer Link updated successfully!");
      } else {
        await axios.post(API_URL, formData, {withCredentials:true});
        showModal("success", "Footer Link created successfully!");
      }
      navigate("/admin/workflow/footerlink");
    }     catch (error) {
  const responseData = error.response?.data;
  let errorMessage = '';

  if (responseData?.errors) {
    // Combine all field error messages into one string
    errorMessage = Object.values(responseData.errors).join('\n');
  } else {
    // Fallback to top-level message
    errorMessage = responseData?.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`;
  }

  showModal("error", errorMessage);
} finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      // In edit mode, revert to the originally fetched data
      setFormData(originalData);
    } else {
      // In add mode, clear the form to a blank state
      setFormData(initialState);
    }
    setErrors({}); // Clear errors in both modes
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/footerlink");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div
      className="min-h-[80vh]"
    >
   <div className="bg-white p-6 shadow"  >
       <Header title={isEditMode ? "Edit Footer Link" : "Add Footer Link"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField 
            label="Link Text (In English)" 
            value={formData.en_link_text} 
            onChange={(val) => handleInputChange("en_link_text", val)} 
            required 
             placeholder="English title here"
            error={errors.en_link_text}
              maxLength={50}
          />
          <FormField 
            label="Link Text (In Odia)" 
            value={formData.od_link_text} 
            onChange={(val) => handleInputChange("od_link_text", val)} 
            required 
             placeholder="Odia title here"
            error={errors.od_link_text}
            maxLength={50}
          />
          <FormField 
            label="URL" 
            type="url"
            value={formData.url} 
            onChange={(val) => handleInputChange("url", val)} 
            placeholder="https://example.com"
            required 
            error={errors.url}
          />
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Link Type  <span className="text-red-500">*</span>
  </label>
<select
  value={formData.linkType}
  onChange={(e) => handleInputChange("linkType", e.target.value)}
  className={`mt-1 block w-full border ${
    errors.linkType ? "border-red-500" : "border-gray-300"
  } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2.5`}
>
  <option value="">-- Select Link Type --</option> 
  <option value="UsefulLink">Useful Link</option>
  <option value="ImportantLink">Important Link</option>
</select>
{errors.linkType && (
  <p className="text-red-600 text-sm mt-1">{errors.linkType}</p>
)}

</div>

        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={handleReset}
        />
      </form>
   </div>
    </div>
  );
};

export default FooterlinkForm;