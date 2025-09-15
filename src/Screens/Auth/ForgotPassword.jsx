import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Logos/logo.jpg";
import lgnBg from "../../assets/Logos/LoginBanner.jpg";
import LeftSection from "../../Components/Admin/Login/LeftSection";
import { useModal } from "../../context/ModalProvider"; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showModal } = useModal(); 

  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/captcha`,
        { withCredentials: true }
      );
      setCaptchaQuestion(data.question);
    } catch (error) {
      console.error("Failed to fetch CAPTCHA", error);
      setCaptchaQuestion("Could not load CAPTCHA.");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/forgot-password`,
        { email, captcha },
        { withCredentials: true }
      );
      
      showModal("success", "If an account with that email exists, a password reset link has been sent.");
      navigate("/login");

    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unknown error occurred.";
      showModal("error", errorMessage);
      fetchCaptcha(); // Refresh captcha on error
      setCaptcha(""); // Clear captcha input
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
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <p className="text-gray-500 mb-6">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* CAPTCHA Section */}
            <div className="flex items-center space-x-4">
              <label htmlFor="captcha" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {captchaQuestion}
              </label>
              <input
                type="text"
                id="captcha"
                name="captcha"
                placeholder="Answer"
                className="w-full px-4 py-2 border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-xs hover:bg-btnHover transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;