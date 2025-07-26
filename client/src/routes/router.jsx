import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import StudentLogin from "../pages/StudentLogin.jsx";
import FacultyLogin from "../pages/FacultyLogin.jsx";
import StudentRegister from "../pages/StudentRegister.jsx";
import FacultyRegister from "../pages/FacultyRegister.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ApprovalNotice from "../pages/ApprovalNotice.jsx";
import FacultyForgotPassword from "../pages/FacultyForgotPassword.jsx";

// Faculty Child Pages
import ApproveStudents from "../pages/FacultyDashboard/ApproveStudents.jsx";
import FacultyProfile from "../pages/FacultyDashboard/FacultyProfile.jsx";
import FacultyHome from "../pages/FacultyDashboard/FacultyHome.jsx";
import FacultyDashboard from "../pages/FacultyDashboard/FacultyDashboard.jsx";
import UpdateDetails from "../pages/FacultyDashboard/UpdateDetails.jsx";
import UploadResult from "../pages/FacultyDashboard/uploadResult/UploadResult.jsx"
import UploadSessionalResult from "../pages/FacultyDashboard/uploadResult/UploadSessionalResult.jsx";
import UploadSemesterResult from "../pages/FacultyDashboard/uploadResult/UploadSemesterResult.jsx";
import ManageStudents from "../pages/FacultyDashboard/ManageStudents.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Student Pages
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard.jsx"
import StudentHome from "../pages/StudentDashboard/StudentHome.jsx";
import StudentViewResult from "../pages/StudentDashboard/StudentViewResult.jsx";

// Admin pages
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard.jsx";
import AdminHome from "../pages/AdminDashboard/AdminHome.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import AdminDashboardHome from "../pages/AdminDashboard/AdminHome.jsx";
import AdminProfile from "../pages/AdminDashboard/AdminProfile.jsx";
import ApproveFaculty from "../pages/AdminDashboard/ApproveFaculty.jsx";
import ManageFaculty from "../pages/AdminDashboard/ManageFaculty.jsx";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "student/login", element: <StudentLogin /> },
      { path: "student/register", element: <StudentRegister /> },
      { path: "faculty/login", element: <FacultyLogin /> },
      { path: "admin/login", element: <AdminLogin/> },
      { path: "faculty/login/notify", element: <ApprovalNotice /> },
      { path: "faculty/register", element: <FacultyRegister /> },
      { path: "faculty/forgot-password", element: <FacultyForgotPassword /> },
      { path: "dashboard", element: <Dashboard /> },

      //faculty dashboard 
      {
        path: "faculty/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "", element: <FacultyHome /> },
          { path: "upload-result", element: <UploadResult /> },
          { path: "upload-result/sessional", element: <UploadSessionalResult /> },
          { path: "upload-result/semester", element: <UploadSemesterResult /> },
          { path: "approve-students", element: <ApproveStudents /> },
          { path: "manage-students", element: <ManageStudents /> },
          { path: "profile", element: <FacultyProfile /> },
          { path: "update-details", element: <UpdateDetails /> },
        ],
      },

      //student dashboard
      {
        path: "student/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "", element: <StudentHome /> },
          { path: "view-results", element: <StudentViewResult /> },
        ]
      },

      //admin dashboard
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "", element: <AdminDashboardHome/>},
          { path: "upload-result", element: <UploadResult /> },
          { path: "upload-result/sessional", element: <UploadSessionalResult /> },
          { path: "upload-result/semester", element: <UploadSemesterResult /> },
          { path: "approve-faculty", element: <ApproveFaculty/> },
          { path: "approve-students", element: <ApproveStudents /> },
          { path: "manage-faculty", element: <ManageFaculty /> },
          { path: "manage-students", element: <ManageStudents /> },
          { path: "profile", element: <AdminProfile/> },
          { path: "update-details", element: <UpdateDetails /> },
        ]
      }
    ],
  },
]);

export default Router;
