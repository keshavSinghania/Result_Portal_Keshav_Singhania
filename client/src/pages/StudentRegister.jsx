import React, { useState } from 'react';
import subhartiBg from '../assets/subharti-bg.jpg';
import { registerApi } from '../axios/index.js';
import { useNavigate } from 'react-router-dom';

export const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    branch: '',
    year: '',
    section: '',
    enrollment: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [responseMessage, setResponseMessage] = useState("")
  const branches = ['CSE', 'IT', 'AIML', 'Mechanical', 'Electrical', 'Civil', 'Aerospace', 'FT', 'Other'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const years = Array.from({ length: 2050 - 2020 + 1 }, (_, i) => 2020 + i);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, password: formData.dob, role: "student" };
    try {
      setLoading(true);
      const result = await registerApi(payload);
      // console.log(result.data.message, "result");
      setResponseMessage(result?.data?.message || result)
      if (result?.data?.success) navigate("/student/login")
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
      <div className="bg-white/90 border-2 border-black rounded w-[90%] max-w-md shadow-lg p-5">
        <h2 className="text-[#925FE2] font-extrabold text-2xl text-center mb-4">Student Registration</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name as per college records"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          >
            <option value="">Select Your Admission Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <input
            type="text"
            name="courseDuration"
            placeholder="Course duration (Auto-filled )"
            value={
              formData?.year
                ? `${formData.year} - ${parseInt(formData.year) + 4}`
                : ""
            }

            onChange={handleChange}
            required
            readOnly
            className="border text-black border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          <input
            type="text"
            name="enrollment"
            placeholder="Enrollment Number"
            value={formData.enrollment}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          {/* TO DISPLAY RESPONSE MESSAGE */}
          <div>
            {
              loading ? "please wait for a while..." : responseMessage
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
  )
}

export default StudentRegister;
