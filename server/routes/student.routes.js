import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { fetchStudentResult, updateStudentDetails } from '../controllers/studentTask.controller.js';

export const studentRouter = express.Router();

studentRouter.get("/view-student-result", protectedRoute, fetchStudentResult );
studentRouter.patch("/update-student-details", protectedRoute, updateStudentDetails );