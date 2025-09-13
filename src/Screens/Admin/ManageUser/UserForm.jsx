import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../context/ModalProvider";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: null,
    existingImageName: "",
    existingImageUrl: "",
  });

  const [initialData, setInitialData] = useState(null); // For reset in edit mode
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { showModal } = useModal();

  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
            { withCredentials: true }
          );
          const user = res.data.user;

          const userData = {
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
            profilePic: null,
            existingImageName: user.profilePic || "",
            existingImageUrl: user.profilePicUrl || "",
          };

          setFormData(userData);
          setInitialData(userData); // Store for reset
          setExistingImageRemoved(false);
          setErrors({});
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          showModal("error", "Failed to load user data.");
        }
      };

      fetchUserData();
    }
  }, [id, isEditMode, showModal]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z\s]{2,}$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    if (!formData.profilePic && !formData.existingImageUrl && !isEditMode) {
      newErrors.profilePic = "Profile image is required.";
    } else if (
      formData.profilePic &&
      !formData.profilePic.type.startsWith("image/")
    ) {
      newErrors.profilePic = "Only image files are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, profilePic: null }));
      setErrors((prev) => ({ ...prev, profilePic: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profilePic: selectedFile,
        existingImageName: "",
        existingImageUrl: "",
      }));
      setExistingImageRemoved(false);
      setErrors((prev) => ({ ...prev, profilePic: null }));
    }
  };

  const handleRemoveExisting = () => {
    setFormData((prev) => ({
      ...prev,
      existingImageName: "",
      existingImageUrl: "",
    }));
    setExistingImageRemoved(true);
    setErrors((prev) => ({ ...prev, profilePic: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);

    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic);
    } else if (isEditMode && existingImageRemoved) {
      data.append("profilePic", "");
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "User updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/register`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "User created successfully.");
      }

      navigate("/admin/user-management/users");
    } catch (error) {
      console.error("Error submitting form:", error);
      showModal(
        "error",
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit the form."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && initialData) {
      setFormData(initialData);
      setExistingImageRemoved(false);
    } else {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        profilePic: null,
        existingImageName: "",
        existingImageUrl: "",
      });
    }
    setErrors({});
  };

  const handleCancel = () => {
    navigate("/admin/user-management/users");
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit User" : "Create User"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Full Name */}
            <FormField
              label="Full Name"
              placeholder="Full Name"
              maxLength={100}
              type="text"
              name="name"
              value={formData.name}
              onChange={(val) => handleChange("name", val)}
              error={errors.name}
            />

            {/* Email */}
            <FormField
              label="Email"
                            placeholder="Email"
                             maxLength={55}
              type="email"
              name="email"
              value={formData.email}
              onChange={(val) => handleChange("email", val)}
              error={errors.email}
            />

            {/* Mobile */}
            <FormField
              label="Mobile No"
              type="tel"
              maxLength="10"
              placeholder="10-digit phone number"
              name="mobile"
              value={formData.mobile}
              onChange={(val) => handleChange("mobile", val)}
              error={errors.mobile}
            />

            {/* Profile Pic */}
            <div>
              <DocumentUploader
                label="Upload Profile Image"
                file={formData.profilePic}
                existingFileName={formData.existingImageName}
                existingFileUrl={formData.existingImageUrl}
                onFileChange={handleFileChange}
                onRemove={handleRemoveExisting} 
                error={errors.profilePic}
                allowedTypes={["image/jpeg", "image/png"]}
                maxSizeMB={12}
              />
            </div>
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default UserForm;
