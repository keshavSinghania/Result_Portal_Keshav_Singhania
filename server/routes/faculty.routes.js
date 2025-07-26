import { Router } from "express";
import { approveStudent, denyStudent, fetchUnapprovedStudents, getNumberOfApprovedStudents, getNumberOfUnapprovedStudents, updateStudentMarks } from "../controllers/facultyTask.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { verifyFacultyOrAdmin } from "../middlewares/verifyFacultyOrAdmin.middleware.js";
 
export const facultyRouter = Router();

facultyRouter.get("/fetch-unapproved-students", protectedRoute, verifyFacultyOrAdmin, fetchUnapprovedStudents);
facultyRouter.patch("/approve-student", protectedRoute, verifyFacultyOrAdmin, approveStudent);
facultyRouter.delete("/deny-student", protectedRoute, verifyFacultyOrAdmin, denyStudent);
facultyRouter.patch("/update-student-marks", protectedRoute, verifyFacultyOrAdmin, updateStudentMarks);
facultyRouter.get("/number-unapproved-students", protectedRoute, verifyFacultyOrAdmin, getNumberOfUnapprovedStudents);
facultyRouter.get("/number-approved-students", protectedRoute, verifyFacultyOrAdmin, getNumberOfApprovedStudents);