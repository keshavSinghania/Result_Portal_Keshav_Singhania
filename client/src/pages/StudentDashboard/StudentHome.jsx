import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PiExamBold, PiRankingBold } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { updateStudentDetailsApi } from "../../axios";


const StudentDashboardHome = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const [updateDetailsBox, setUpdateDetailsBox] = useState(false);
  const [newBranch, setNewBranch] = useState(userDetails?.branch);
  const [newSection, setNewSection] = useState(userDetails?.section);
  const [message, setMessage] = useState("");
  const branches = ['CSE', 'IT', 'AIML', 'Mechanical', 'Electrical', 'Civil', 'Aerospace', 'FT', 'Other'];
  const handleUpdateDetail = async () => {
    try {
      const res = await updateStudentDetailsApi({ branch: newBranch, section: newSection });
      setMessage("Please wait....")
      if (res?.data?.success) {
        setMessage(res?.data?.message);
        setTimeout(() => {
          setUpdateDetailsBox(false);
          setMessage("");
          window.location.reload();
        }
          , 1000);
      }
    } catch (error) {
      setMessage(error.message || error || res?.data?.message || "Something went wrong try again.");
    }
  }
  return (
    <div className="space-y-6 ">
      {/* Welcome Banner */}
      <div className="bg-purple-100 border border-purple-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-purple-800 mb-1">
          Jai Hind! {userDetails?.name || "Student"}
        </h2>
        <p className="text-gray-600 text-sm">
          Ready to explore your academic journey?
        </p>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Enrollment No</h4>
          <p className="font-semibold text-gray-800">{userDetails?.enrollment || "N/A"}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Branch</h4>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800 capitalize">{userDetails?.branch || "N/A"}</p>
            <button onClick={() => setUpdateDetailsBox(true)}><MdEdit size={20} /></button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Section</h4>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-800 capitalize">{userDetails?.section || "N/A"}</p>
            <button onClick={() => setUpdateDetailsBox(true)}><MdEdit size={20} /></button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Email</h4>
          <p className="font-semibold text-gray-800 truncate">{userDetails?.email}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Course Duration</h4>
          <p className="font-semibold text-gray-800 truncate">{userDetails?.year}-{Number(userDetails.year) + 4}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: "View Result", icon: <PiExamBold className="text-2xl" />, to: "/student/dashboard/view-results" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="bg-white border shadow-sm rounded-xl p-4 text-center hover:bg-purple-50 transition"
            >
              <div className="mb-2 text-purple-700">{item.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{item.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Edit User information input box */}
      {updateDetailsBox && (
        <div className="fixed inset-0 bg-purple-100 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[300px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Update Your Details</h2>

            {/* Year Dropdown */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Year:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
              >
                <option value="">{userDetails?.branch}</option>
                {branches?.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Section:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              >
                <option value="">{userDetails.section}</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleUpdateDetail}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => setUpdateDetailsBox(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

            {/*Updation Warning */}
            <p className="font-semibold text-md mt-2 mb-2">
              {message}
            </p>
            <p className="text-red-700">
              Kindly be aware that changing your section or branch will update your record accordingly,
              and your name will appear only within the selected section.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardHome;



// import React from "react";
// import { PiRankingBold } from "react-icons/pi";

// const leaderboardData = [
//   { rank: 1, name: "Ankit Sharma", enrollment: "CS2023001", totalMarks: 489, section: "A" },
//   { rank: 2, name: "Riya Mehta", enrollment: "CS2023004", totalMarks: 475, section: "A" },
//   { rank: 3, name: "Aditya Verma", enrollment: "CS2023010", totalMarks: 460, section: "A" },
// ];

// const Leaderboard = () => {
//   return (
//     <div className="min-h-screen bg-purple-100 p-8">
//       <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-2 mb-6">
//         <PiRankingBold className="text-purple-700 text-4xl" />
//         Class Top Performers
//       </h1>

//       <div className="grid md:grid-cols-3 gap-6">
//         {leaderboardData.map((student) => (
//           <div
//             key={student.rank}
//             className="bg-white shadow-md border border-purple-200 rounded-xl p-4"
//           >
//             <div className="text-2xl font-bold text-purple-700">#{student.rank}</div>
//             <div className="text-lg font-semibold mt-2">{student.name}</div>
//             <div className="text-sm text-gray-600">{student.enrollment}</div>
//             <div className="mt-2 text-sm">
//               <strong>Total Marks:</strong> {student.totalMarks}
//             </div>
//             <div className="text-sm">
//               <strong>Section:</strong> {student.section}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;
