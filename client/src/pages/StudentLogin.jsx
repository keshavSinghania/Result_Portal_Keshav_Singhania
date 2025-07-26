import React, { useState } from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

const StudentLogin = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    enrollment: '',
    dob: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role: "student", password: formData.dob };

    try {
      setLoading(true);
      const result = await loginApi(payload);
      setResponseMessage(result?.data?.message || result);

      if (result?.data?.success) {
        dispatch(loginSuccess({ user: result?.data?.user, token: result?.data?.token }));
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
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl text-center">Student Login</h2>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name='enrollment'
            placeholder="Enrollment Number"
            className="border border-[#925FE2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name='dob'
            placeholder="Date of Birth"
            className="border border-[#925FE2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#925FE2] text-white font-semibold rounded py-2 hover:bg-[#7d4ed9] transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-center text-red-500 min-h-[20px]">
          {loading ? "Please wait for a while..." : responseMessage}
        </div>

        <p className="text-xs sm:text-sm text-center mt-2">
          Not a student?{" "}
          <span onClick={() => navigate("/")} className="text-[#925FE2] font-bold cursor-pointer hover:underline">Go back</span>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
