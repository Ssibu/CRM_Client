import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Add/Header";

const HomePageBannerForm = () => {
  const [formData, setFormData] = useState({
    image: null, // stores File object from input
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Cancel handler
  const handleCancel = () => {
    navigate("/admin/image-setup/homepage-banner");
  };

  // Fetch existing banner on edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBanner = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/image-setup/banners/${id}`,
            { withCredentials: true }
          );

          // We can't preload file inputs for security reasons, so just keep image null
          setFormData({ image: null });
        } catch (error) {
          console.error("Failed to fetch banner:", error);
        }
      };

      fetchBanner();
    }
  }, [id, isEditMode]);

  // Validation
  const validate = () => {
    const newErrors = {};

    // If creating new, image required
    if (!formData.image && !isEditMode) {
      newErrors.image = "Banner image is required.";
    } else if (
      formData.image &&
      !formData.image.type.startsWith("image/")
    ) {
      newErrors.image = "Only image files are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File input change handler
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFormData({ image: file });

    // Clear image errors
    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    if (formData.image) {
      data.append("banner", formData.image); // use "banner" as field name
    }

    try {
      if (isEditMode) {
        // PUT update existing banner by ID
        await axios.put(
          `${process.env.REACT_APP_API_URL}/image-setup/upload/homepage/banner/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // POST create new banner
        await axios.post(
          `${process.env.REACT_APP_API_URL}/image-setup/upload/homepage/banner`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      // Navigate back after success
      navigate("/admin/image-setup/homepage-banner");
    } catch (error) {
      console.error(
        "Error submitting banner:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form fields
  const handleReset = () => {
    setFormData({ image: null });
    setErrors({});
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={isEditMode ? "Edit Homepage Banner" : "Add Homepage Banner"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Upload Banner Image
            </label>
            <input
              type="file"
              name="banner" // input name should match backend field
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePageBannerForm;
