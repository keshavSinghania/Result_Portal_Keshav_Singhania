import express from "express"
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getStudentsByYearAndSection, uploadSemesterResult, uploadSessionalResult } from "../controllers/result.controller.js";
import { verifyFacultyOrAdmin } from "../middlewares/verifyFacultyOrAdmin.middleware.js";
const resultRouter = express.Router();

resultRouter.get("/get-students-by-year-and-section", protectedRoute, verifyFacultyOrAdmin, getStudentsByYearAndSection);
resultRouter.post("/upload-sessional-result", protectedRoute, verifyFacultyOrAdmin, uploadSessionalResult);
resultRouter.post("/upload-semester-result", protectedRoute, verifyFacultyOrAdmin, uploadSemesterResult);

export default resultRouter;