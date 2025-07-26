import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdUpload, MdPerson, MdDelete, MdCheckCircle } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";
import { getNumberOfApprovedStudentsApi } from "../../axios"; // ✅ Import the API

const AdminHome = () => {
  const user = useSelector((state) => state.auth.user);
  const [numberOfApprovedStudents, setNumberOfApprovedStudents] = useState(0);
  useEffect(() => {
    console.log("again")
    const fetchApprovedCount = async () => {
      try {
        const res = await getNumberOfApprovedStudentsApi();
        setNumberOfApprovedStudents(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching approved student count:", error.message);
      }
    };

    fetchApprovedCount();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-purple-100 border border-purple-200 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-purple-800 mb-1">
          Jai Hind! {user?.name || "Faculty"}
        </h2>
        <p className="text-gray-600 text-sm">
          Empowering students, one result at a time.
        </p>
      </div>

      {/* Profile Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Email</h4>
          <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Role</h4>
          <p className="font-semibold text-gray-800 capitalize">{user?.role}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          <h4 className="text-sm text-gray-500 mb-1">Last Login</h4>
          <p className="font-semibold text-gray-800">
            {new Date(user?.lastLogin).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: "Upload Result", icon: <MdUpload />, to: "/admin/dashboard/upload-result" },
            { label: "Approve Faculty", icon: <BsPersonCheckFill />, to: "/admin/dashboard/approve-faculty" },
            { label: "Approve Students", icon: <MdCheckCircle />, to: "/admin/dashboard/approve-students" },
            { label: "Manage Faculty", icon: <MdDelete />, to: "/admin/dashboard/manage-faculty" },
            { label: "Manage Student", icon: <FaUserGraduate />, to: "/admin/dashboard/manage-students" },
            { label: "Profile", icon: <MdPerson />, to: "/admin/dashboard/profile" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.to}
              className="bg-white border shadow-sm rounded-xl p-4 text-center hover:bg-purple-50 transition"
            >
              <div className="text-3xl mb-2 text-purple-700">{action.icon}</div>
              <p className="text-sm font-semibold text-gray-700">{action.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h4 className="text-sm text-gray-500">Total Approved Students</h4>
            <p className="text-2xl font-bold text-purple-700">{numberOfApprovedStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
