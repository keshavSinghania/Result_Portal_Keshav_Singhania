import React, { useEffect } from 'react';
import subhartiLogo from "../assets/subharti-logo.png";
import subhartiBg from "../assets/subharti-bg.jpg";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // useEffect(() => { navigate("/dashboard") }, [])
  return (
    <div
      className="h-[calc(100vh)] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${subhartiBg})` }}
    >
      <div className="border-2 border-black rounded w-[28vw] md:h-[70vh] h-[45vh] min-w-[280px] min-h-[350px] flex flex-col shadow-lg bg-white/90">

        {/* Top half */}
        <div className="h-1/2 flex flex-col items-center justify-center p-3">
          <div className="text-[#925FE2] font-bold text-center leading-tight">
            <h3 className="text-sm sm:text-base md:text-lg">Subharti Institute Of</h3>
            <h3 className="text-sm sm:text-base md:text-lg">Technology And Engineering</h3>
            <h2 className="text-base sm:text-lg md:text-xl">SITE</h2>
          </div>
          <img src={subhartiLogo} alt="subharti-logo" className="size-20 sm:size-24 mt-2" />
          <div className="border border-[#925FE2] w-2/3 mt-2"></div>
        </div>

        {/* Bottom half */}
        <div className="h-1/2 flex flex-col items-center justify-center p-3">
          <h2 className="text-[#925FE2] font-extrabold text-xl sm:text-2xl mb-2">
            RESULT <span className="font-bold">PORTAL</span>
          </h2>

          <div
            onClick={() => navigate("/student/login")}
            className="text-[#925FE2] border border-[#925FE2] rounded w-4/5 py-2 mb-2 text-center hover:bg-[#925FE2] hover:text-white transition cursor-pointer"
          >
            Student Login
          </div>

          <div
            onClick={() => navigate("/faculty/login")}
            className="text-[#925FE2] border border-[#925FE2] rounded w-4/5 py-2 mb-2 text-center hover:bg-[#925FE2] hover:text-white transition cursor-pointer"
          >
            Faculty Login
          </div>

          <p className="text-xs sm:text-sm mt-1 text-center">
            Don't have an account?
          </p>

          <div className="flex gap-2 mt-1 flex-wrap justify-center">
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
