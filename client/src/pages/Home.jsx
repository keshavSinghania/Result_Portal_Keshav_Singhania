import React from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="border-2 border-black rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white/90 shadow-lg flex flex-col">

        {/* Top half */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="text-[#925FE2] font-bold text-center leading-tight">
            <h3 className="text-sm sm:text-base md:text-lg">Subharti Institute Of</h3>
            <h3 className="text-sm sm:text-base md:text-lg">Technology And Engineering</h3>
            <h2 className="text-base sm:text-lg md:text-xl">SITE</h2>
          </div>
          <img
            src={subhartiLogo}
            alt="subharti-logo"
            className="w-20 h-20 sm:w-24 sm:h-24 mt-2 object-contain"
          />
          <div className="border border-[#925FE2] w-2/3 mt-2"></div>
        </div>

        {/* Bottom half */}
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl mb-3">
            RESULT <span className="font-bold">PORTAL</span>
          </h2>

          <button
            onClick={() => navigate("/student/login")}
            className="text-[#925FE2] border border-[#925FE2] rounded w-full max-w-xs py-2 mb-2 text-center hover:bg-[#925FE2] hover:text-white transition"
          >
            Student Login
          </button>

          <button
            onClick={() => navigate("/faculty/login")}
            className="text-[#925FE2] border border-[#925FE2] rounded w-full max-w-xs py-2 mb-2 text-center hover:bg-[#925FE2] hover:text-white transition"
          >
            Faculty Login
          </button>

          <p className="text-xs sm:text-sm mt-2 text-center">
            Don't have an account?
          </p>

          <div className="flex flex-wrap gap-2 mt-2 justify-center text-sm sm:text-base">
            <span
              className="text-[#925FE2] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/student/register")}
            >
              Register as Student
            </span>
            <span className="text-gray-400">|</span>
            <span
              className="text-[#925FE2] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/faculty/register")}
            >
              Register as Faculty
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
