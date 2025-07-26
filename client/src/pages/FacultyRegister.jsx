import React, { useState } from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { Eye, EyeOff, Handshake } from 'lucide-react';
import { registerApi } from '../axios/index.js';
import { useNavigate } from 'react-router-dom';

const FacultyRegister = () => {
  const [formData, setFormData] = useState({
    name: ' ',
    email: ' ',
    password: ' '
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading , setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(' ');
  const navigate = useNavigate()


  // IMPORTANT FUNCTION
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role: "faculty" };
    console.log(payload);
    try {
      setLoading(true);
      const result = await registerApi(payload);
      // console.log(result.data.message, "result");
      setResponseMessage(result?.data?.message || result)
      if (result?.data?.success) navigate("/faculty/login")
    } catch (error) {
      if (error.response) {
        // console.log(error.response.data.message || error);
        setResponseMessage(error?.response?.data?.message || error)
      }
      else {
        // console.log("Error: ", error.message || error)
        setResponseMessage(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="h-[calc(100vh)] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="bg-white/90 border-2 border-black rounded w-[28vw] min-w-[280px] h-auto p-6 shadow-lg">

        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <img src={subhartiLogo} alt="subharti-logo" className="size-20 sm:size-24 mb-2" />
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl text-center">Faculty Registration</h2>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Full Name"
            name='name'
            className="border border-[#925FE2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Email"
            name='email'
            className="border border-[#925FE2] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
            required
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border border-[#925FE2] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#925FE2]"
              required
              name='password'
              onChange={handleChange}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#925FE2]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* SHOW RESPONSE MESSAGE */}
          <div>
            {
              loading? "Please wait for a while...": responseMessage
            }
          </div>
          <button
            type="submit"
            className="bg-[#925FE2] text-white font-semibold rounded py-2 hover:bg-[#7d4ed9] transition"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
};

export default FacultyRegister;
