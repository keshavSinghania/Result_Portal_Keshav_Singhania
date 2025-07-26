import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import subhartiLogo from '../assets/subharti-logo.png';
import subhartiBg from '../assets/subharti-bg.jpg';
import { forgotPasswordApi, resetPasswordApi } from '../axios';

const FacultyForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Send OTP | Step 2: Verify OTP + Reset
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email: formData.email, role: 'faculty' });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPasswordApi({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate('/faculty/login'), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="bg-white/90 border-2 border-black rounded w-[90%] max-w-md shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <img src={subhartiLogo} alt="subharti-logo" className="size-20 sm:size-24 mb-2" />
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl text-center">Faculty Password Reset</h2>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Enter registered email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
          />

          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
                className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="border border-[#925FE2] rounded px-3 py-2 focus:ring-2 focus:ring-[#925FE2] outline-none"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#925FE2] text-white font-semibold rounded py-2 hover:bg-[#7d4ed9] transition"
          >
            {loading
              ? 'Please wait...'
              : step === 1
              ? 'Send OTP'
              : 'Reset Password'}
          </button>
        </form>

        {/* Response Message */}
        <div className="text-sm text-center text-[#925FE2] mt-2 font-medium">
          {message}
        </div>

        <p className="text-xs text-center mt-3">
          Back to login?{' '}
          <span
            onClick={() => navigate('/faculty/login')}
            className="text-[#925FE2] font-bold cursor-pointer hover:underline"
          >
            Click here
          </span>
        </p>
      </div>
    </div>
  );
};

export default FacultyForgotPassword;
