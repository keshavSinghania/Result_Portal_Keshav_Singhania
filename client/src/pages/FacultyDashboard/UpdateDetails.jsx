import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateFacultyDetails } from '../../axios';

const UpdateDetails = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form with current user details
  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        name: userDetails.name || '',
        email: userDetails.email || '',
      }));
    }
  }, [userDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const res = await updateFacultyDetails(payload);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#925FE2]">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-[#925FE2] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#925FE2]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-[#925FE2] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#925FE2]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter current password"
            value={formData.password}
            onChange={handleChange}
            className="border border-[#925FE2] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#925FE2]"
            required
          />

          <button
            type="submit"
            className="bg-[#925FE2] text-white font-semibold py-2 rounded hover:bg-[#7d4ed9] transition"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>

        {message && (
          <p className={`text-sm text-center mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p
          onClick={() => navigate('/dashboard')}
          className="text-sm text-center mt-3 cursor-pointer text-[#925FE2] hover:underline"
        >
          Back to Dashboard
        </p>
      </div>
    </div>
  );
};

export default UpdateDetails;
