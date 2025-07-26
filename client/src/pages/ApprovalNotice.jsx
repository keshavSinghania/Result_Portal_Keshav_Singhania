import React from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { useNavigate } from 'react-router-dom';

const ApprovalNotice = ({ role }) => {
  const navigate = useNavigate();

  const getMessage = () => {
    if (role === "student") {
      return "Please ask your faculty to approve your account before login.";
    }
    if (role === "faculty") {
      return "Please ask the exam cell to approve your account before login.";
    }
    return "Approval pending. Please contact the relevant authority.";
  };

  return (
    <div
      className="h-[100vh] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="bg-white/90 border-2 border-black rounded w-[90%] max-w-md shadow-lg p-6 flex flex-col items-center">
        <img src={subhartiLogo} alt="subharti-logo" className="size-24 mb-4" />

        <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl text-center mb-4">
          Account Approval Needed
        </h2>
        <p className="text-center text-sm sm:text-base text-[#333] mb-6">
          {getMessage()}
        </p>

        <button
          className="bg-[#925FE2] text-white font-semibold rounded py-2 px-4 hover:bg-[#7d4ed9] transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ApprovalNotice;
