import React, { useState } from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const FacultyLogin = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role: "faculty" };
    try {
      setLoading(true);
      const result = await loginApi(payload);
      setResponseMessage(result?.data?.message || result);
      if (result.data.success) {
        dispatch(loginSuccess({user: result?.data?.user, token: result?.data?.token}))
        navigate("/dashboard");
      }
    } catch (error) {
      setResponseMessage(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[calc(100vh)] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="bg-white/90 border-2 border-black rounded w-[25vw] h-[60vh] min-w-[280px] min-h-[380px] flex flex-col shadow-lg p-4 justify-between">

        {/* Header */}
        <div className="flex flex-col items-center">
          <img src={subhartiLogo} alt="subharti-logo" className="size-20 sm:size-24 mb-2" />
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl text-center">Faculty Login</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="border border-[#925FE2] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#925FE2]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Forgot password link */}
          <p
            className="text-xs text-right text-[#925FE2] cursor-pointer hover:underline"
            onClick={() => {
              navigate("/faculty/forgot-password")
            }}
          >
            Forgot Password?
          </p>

          {/* Response message */}
          <div className="text-sm text-center text-red-500 min-h-[20px]">
            {loading ? "Please wait for a while..." : responseMessage}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#925FE2] text-white font-semibold rounded py-2 hover:bg-[#7d4ed9] transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs sm:text-sm text-center mt-2">
          Not faculty?{" "}
          <span
            className="text-[#925FE2] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default FacultyLogin;
