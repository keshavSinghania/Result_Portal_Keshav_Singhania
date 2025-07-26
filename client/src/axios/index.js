import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});
console.log(import.meta.env.VITE_BASE_URL)

export const loginApi = (payload) => api.post("auth/login", payload);
export const registerApi = (payload) => api.post("auth/register", payload);
export const forgotPasswordApi = (payload) => api.post("auth/forgot-password", payload);
export const resetPasswordApi = (payload) => api.post("auth/reset-password", payload);
export const getUserDetails = () => api.get("auth/get-user-details");
export const logOutApi = () => api.post("auth/logout");
export const changePasswordApi = (payload) => api.post("auth/change-password", payload);
export const updateFacultyDetails = (payload) => api.put("auth/update-details", payload);


// upload result routes
export const getStudentsByYearAndSection = (payload) => api.get("result/get-students-by-year-and-section", { params: payload });
export const uploadSessionalResult = (payload) => api.post("result/upload-sessional-result", payload);
export const uploadSemesterResult = (payload) => api.post("result/upload-semester-result", payload);


//faculty role routes
export const fetchUnapprovedStudentsApi = () => api.get("faculty/fetch-unapproved-students");
export const approveStudentApi = (payload) => api.patch("faculty/approve-student", payload);
export const denyStudentApi = (payload) => api.delete("faculty/deny-student", { data: payload});
export const updateStudentMarksApi = (payload) => api.patch("faculty/update-student-marks", payload);
export const getNumberOfApprovedStudentsApi = () => api.get("faculty/number-approved-students");
export const getNumberOfUnapprovedStudentsApi = () => api.get("faculty/number-unapproved-students");


//student role routes
export const viewResultApi = () => api.get("student/view-student-result");
export const updateStudentDetailsApi = (payload) => api.patch("student/update-student-details", payload);

//admin role routes
export const approveFacultyApi = (payload) => api.patch("admin/approve-faculty", payload);
export const denyFacultyApi = (payload) => api.delete("admin/deny-faculty", { data: payload });
export const fetchUnapprovedFacultyApi = () => api.get("admin/fetch-unapproved-faculty");
export const fetchFacultiesApi = () => api.get("admin/fetch-faculties");
export const deletedFacultyApi = (payload) => api.delete("admin/delete-faculty",{data:payload});
export const getNumberOfUnapprovedFacultyApi = () => api.get("admin/number-unapproved-faculty");