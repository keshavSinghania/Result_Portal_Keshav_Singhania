import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MdModeEdit } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changePasswordApi } from '../../axios/index.js';
import { useNavigate } from 'react-router-dom';

const FacultyProfile = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const naviagte = useNavigate()
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };
      const response = await changePasswordApi(payload);
      setMessage({ text: response.data.message, isError: false });
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Something went wrong.",
        isError: true,
      });
    }
  };

  return (
    <div className='flex items-center justify-center py-10 px-4'>
      <section className='bg-white w-full max-w-4xl rounded-lg shadow-md p-6'>
        {/* Header */}
        <div className='text-center mb-6'>
          <h2 className='text-3xl font-bold text-purple-700'>Profile Section</h2>
        </div>

        {/* Profile Details */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {[
            { label: "Name", value: userDetails?.name || "NaN" },
            { label: "Email", value: userDetails?.email || "NaN" },
            { label: "Role", value: userDetails?.role || "NaN" },
            {
              label: "Last Login",
              value: userDetails?.lastLogin
                ? new Date(userDetails.lastLogin).toLocaleString()
                : "NaN",
            },
          ].map(({ label, value }, index) => (
            <div key={index}>
              <label className='block text-sm font-semibold text-gray-600 mb-1'>{label}</label>
              <input
                type='text'
                readOnly
                className='border border-gray-300 rounded p-2 w-full text-gray-800 bg-gray-100 cursor-not-allowed'
                value={value}
              />
            </div>
          ))}
        </div>

        {/* Edit Button */}
        <div className='flex justify-center mt-6'>
          <button
            onClick={()=> naviagte("/faculty/dashboard/update-details")}
            type='button'
            className='bg-purple-600 text-white rounded hover:bg-purple-700 transition p-2 px-6 flex items-center gap-2'
          >
            <MdModeEdit className='text-lg' />
            Update Details
          </button>
        </div>

        <hr className='my-8 border-t-2 border-gray-200' />

        {/* Password Change Section */}
        <div>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>Change Password</h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='relative'>
              <label className='block text-sm font-semibold text-gray-600 mb-1'>Current Password</label>
              <input
                type={showOld ? "text" : "password"}
                placeholder='Enter current password'
                name="oldPassword"
                value={formData.oldPassword}
                onChange={changeHandler}
                className='border border-gray-300 rounded p-2 w-full pr-10'
              />
              <span
                className='absolute top-9 right-3 cursor-pointer text-xl text-gray-500'
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <div className='relative'>
              <label className='block text-sm font-semibold text-gray-600 mb-1'>New Password</label>
              <input
                type={showNew ? "text" : "password"}
                placeholder='Enter new password'
                name="newPassword"
                value={formData.newPassword}
                onChange={changeHandler}
                className='border border-gray-300 rounded p-2 w-full pr-10'
              />
              <span
                className='absolute top-9 right-3 cursor-pointer text-xl text-gray-500'
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mt-4 text-sm ${message.isError ? "text-red-600" : "text-green-600"}`}>
              {message.text}
            </div>
          )}

          {/* Submit */}
          <div className='flex justify-end mt-6'>
            <button
              type='button'
              onClick={handlePasswordChange}
              className='bg-green-600 text-white rounded hover:bg-green-700 transition p-2 px-6'
            >
              Update Password
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FacultyProfile;
