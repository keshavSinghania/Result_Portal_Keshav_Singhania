import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Upload, UserCheck, Trash, Home, User, Menu, Edit2Icon } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from '../../store/authSlice';
import { getNumberOfUnapprovedStudentsApi, logOutApi } from "../../axios";

const SidebarFaculty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfUnapprovedStudent, setNumberOfUnapprovedStudent] = useState(0);

  const fetchUnApprovedStudentCount = async () => {
    try {
      const resCount = await getNumberOfUnapprovedStudentsApi();
      setNumberOfUnapprovedStudent(resCount?.data?.count);
    } catch (error) {
      console.error("Error fetching unapproved student count:", error.message);
    }
  }

  useState(() => {
    fetchUnApprovedStudentCount()
  }, [])
  const handleLogout = async () => {
    try {
      await logOutApi();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message || error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition duration-200 font-medium ${isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-purple-50"
    }`;

  const Badge = ({ count }) =>
    count > 0 ? (
      <span className="ml-auto bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        {count}
      </span>
    ) : null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 p-4 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">Faculty Panel</h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/faculty/dashboard" end className={navLinkClass}>
            <Home size={20} /> Dashboard Home
          </NavLink>
          <NavLink to="/faculty/dashboard/upload-result" className={navLinkClass}>
            <Upload size={20} /> Upload Result
          </NavLink>
          <NavLink to="/faculty/dashboard/approve-students" className={navLinkClass}>
            <div className="flex items-center gap-3">
              <UserCheck size={20} /> Approve Students
            </div>
            <Badge count={numberOfUnapprovedStudent} />
          </NavLink>
          <NavLink to="/faculty/dashboard/manage-students" className={navLinkClass}>
            <Edit2Icon size={20} /> Manage Students
          </NavLink>
          <NavLink to="/faculty/dashboard/profile" className={navLinkClass}>
            <User size={20} /> Profile
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-4 transition duration-200"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default SidebarFaculty;
