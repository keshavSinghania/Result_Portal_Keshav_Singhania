import React from 'react';
import { useNavigate } from 'react-router-dom';

const UploadResult = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100%] flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-purple-600">Upload Result Panel</h1>

      <div className="flex flex-col gap-6 w-full max-w-md">
        <div
          onClick={() => navigate('semester')}
          className="bg-purple-700 hover:bg-purple-800 transition-colors text-center py-4 px-6 rounded-xl cursor-pointer shadow-md hover:shadow-lg text-lg font-semibold"
        >
          Upload Semester Result
        </div>

        <div
          onClick={() => navigate('sessional')}
          className="bg-green-600 hover:bg-green-700 transition-colors text-center py-4 px-6 rounded-xl cursor-pointer shadow-md hover:shadow-lg text-lg font-semibold"
        >
          Upload Sessional Result
        </div>
      </div>
    </div>
  );
};

export default UploadResult;
