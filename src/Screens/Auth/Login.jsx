import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RiFacebookCircleFill } from "react-icons/ri";
import Tostify from "../Common/Tostify";
import { toast } from "react-toastify";
import lgnIllustrator from "../../Assets/Login/lgnIll.png";
import logo from "../../Assets/Logos/logo.jpg";
import lgnBg from "../../Assets/Logos/LoginBanner.jpg";
import LeftSection from "../../Components/Login/LeftSection";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import {useModal} from "../../context/ModalProvider"

const Login = () => {
  const { user, setUser, loading, setLoading, error, setError, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {showModal} = useModal()

  const [formData, setFormData] = useState({
    email: '',
    password: '',

  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }



  const handleLogin = async (e) => {
    e.preventDefault(); // prevent default form submit behavior

    try {
      // const response = await axios.post(
      //     `${process.env.REACT_APP_API_URL}/admin/login",
      //   formData,
      //    { withCredentials: true }
      // );

      const status = await login(formData);

     

      if (status) {
        showModal("success", 'Logged in Successfully')
        navigate("/admin/dashboard");


      } else {
        showModal("error", 'Failed to login')
        navigate("/login");

      }

    } catch (error) {
      alert("Login failed. Please try again.");

    }
  };
  useEffect(() => {
  if (user) {
    console.log("✅ User updated in Login component:", user);
  }
  }, [user]);

  const goToSignUP = () => {
    navigate("/sign-up");
  };

  const tostifyErr = (msg) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side */}
      <LeftSection logo={logo} />

      {/* Right Side */}
      <div
        className="flex justify-center items-center p-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${lgnBg})` }}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-1">Welcome to our CRM</h2>
          <h3 className="text-2xl font-bold mb-4">Log In Now</h3>
          <p className="text-gray-500 mb-6">
            Enter your details to proceed further
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember Me !
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-btnHover transition duration-200"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
