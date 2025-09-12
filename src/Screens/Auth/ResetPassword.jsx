import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Logos/logo.jpg";
import lgnBg from "../../assets/Logos/LoginBanner.jpg";
import LeftSection from "../../Components/Admin/Login/LeftSection";
import { useModal } from "../../context/ModalProvider";

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showModal("error", "Passwords do not match.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/reset-password/${token}`,
        { password }
      );
      
      showModal("success", response.data.message);
      navigate("/login");

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to reset password.";
      showModal("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <LeftSection logo={logo} />
      <div
        className="flex justify-center items-center p-10 bg-cover bg-center bg-gray-200"
        style={{ backgroundImage: `url(${lgnBg})` }}
      >
        <div className="bg-white rounded-xs p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-xs hover:bg-btnHover transition duration-200 disabled:bg-gray-400"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;