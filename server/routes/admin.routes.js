import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { approveFaculty, deletedFaculty, denyFaculty, fetchFaculties, fetchUnapprovedFaculty, getNumberOfUnapprovedFaculty } from "../controllers/adminTask.controller.js";
 
export const adminRouter = Router();

adminRouter.get("/fetch-unapproved-faculty", protectedRoute, verifyAdmin, fetchUnapprovedFaculty);
adminRouter.patch("/approve-faculty", protectedRoute, verifyAdmin, approveFaculty);
adminRouter.delete("/deny-faculty", protectedRoute, verifyAdmin, denyFaculty);
adminRouter.get("/fetch-faculties",protectedRoute,verifyAdmin, fetchFaculties);
adminRouter.delete("/delete-faculty",protectedRoute,verifyAdmin,deletedFaculty);
adminRouter.get("/number-unapproved-faculty",protectedRoute,verifyAdmin,getNumberOfUnapprovedFaculty);