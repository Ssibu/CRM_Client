import React, { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

// const FormField = memo(({ label, name, type, value, onChange, error, placeholder }) => (
//     <div>
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <input
//             type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder}
//             className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
//         />
//         {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//     </div>
// ));

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!passwords.currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required.";
      if (!passwords.confirmNewPassword) {
        newErrors.confirmNewPassword = "Confirm password is required.";
      }
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwords]);

  const handleReset = (e) => {
    e.preventDefault();
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors({});
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);

      try {
        const res = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/admin/change-password`,
          {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          },
          { withCredentials: true }
        );
        showModal("success", res.data.message);
        navigate("/admin/dashboard");
      } catch (error) {
        showModal(
          "error",
          error.response?.data?.message || "Failed to change password."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [passwords, validateForm, showModal, navigate]
  );

  return (
    <div className="min-h-[80vh]">
      <div className="w-full bg-white p-6 shadow ">
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Change Password
          </h1>
        </div>
        <form onSubmit={handleSubmit} noValidate className="">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Current Password"
              placeholder="Current Password"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
            />
            <FormField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="At least 6 characters"
            />
            <FormField
              label="Confirm New Password"
              placeholder="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={passwords.confirmNewPassword}
              onChange={handleChange}
              error={errors.confirmNewPassword}
            />
          </div>
          <div className=" flex items-center justify-start gap-2">
            <FormActions
              onCancel={() => navigate("/admin/dashboard")}
              onReset={handleReset}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
