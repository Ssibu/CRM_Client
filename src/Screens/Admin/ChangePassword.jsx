
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

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

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    colorClass: "",
  });

  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;

    let label = "";
    let colorClass = "";

    switch (strength) {
      case 1:
        label = "Very Weak";
        colorClass = "bg-red-500";
        break;
      case 2:
        label = "Weak";
        colorClass = "bg-yellow-400";
        break;
      case 3:
        label = "Moderate";
        colorClass = "bg-yellow-500";
        break;
      case 4:
        label = "Strong";
        colorClass = "bg-green-400";
        break;
      case 5:
        label = "Very Strong";
        colorClass = "bg-green-600";
        break;
      default:
        label = "";
        colorClass = "";
    }

    return { score: strength, label, colorClass };
  };

  const verifyCurrentPassword = async (password) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/verify-password`,
        { currentPassword: password },
        { withCredentials: true }
      );
      setErrors((prev) => ({ ...prev, currentPassword: null }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        currentPassword:
          error.response?.data?.message || "Current password is incorrect.",
      }));
    }
  };

  const handleCurrentPasswordBlur = () => {
    if (passwords.currentPassword.trim() !== "") {
      verifyCurrentPassword(passwords.currentPassword);
    }
  };

  useEffect(() => {
    const handleWindowBlur = () => {
      if (passwords.currentPassword.trim() !== "") {
        verifyCurrentPassword(passwords.currentPassword);
      }
    };

    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
  }, [passwords.currentPassword]);

  const handleChange = (name, value) => {
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === "currentPassword" && value.trim() === "") {
      setErrors((prev) => ({ ...prev, currentPassword: null }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!passwords.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long.";
    }

    if (passwords.confirmNewPassword !== passwords.newPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
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
    setPasswordStrength({ score: 0, label: "", colorClass: "" });
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

  const strengthPercentage = (passwordStrength.score / 5) * 100;

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
            required
            maxLength={12}
              label="Current Password"
              placeholder="Current Password"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={(value) => handleChange("currentPassword", value)}
              onBlur={handleCurrentPasswordBlur}
              error={errors.currentPassword}
            />
            <div className="flex flex-col">
              <FormField
              required
                label="New Password"
                name="newPassword"
                maxLength={12}
                type="password"
                value={passwords.newPassword}
                onChange={(value) => handleChange("newPassword", value)}
                error={errors.newPassword}
                placeholder="At least 8 characters"
              />
              

              
             {!passwordStrength.label.length == 0 &&
            <>
             <div className="w-full bg-gray-300 h-2 rounded mt-1 mb-1">
                <div
                  className={`h-2 rounded transition-all duration-300 ${passwordStrength.colorClass}`}
                  style={{ width: `${strengthPercentage}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 h-5">
                {passwordStrength.label}
              </p>
            </>
              }
            </div>
            <FormField
            maxLength={12}
              label="Confirm New Password"
              placeholder="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={passwords.confirmNewPassword}
              onChange={(value) =>
                handleChange("confirmNewPassword", value)
              }
              error={errors.confirmNewPassword}
            />
          </div>
          <div className="flex items-center justify-start gap-2">
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
