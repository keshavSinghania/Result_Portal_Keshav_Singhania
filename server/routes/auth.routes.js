import express from "express";
import { changePasswordController, forgetPasswordController, getUserDetails, loginController, logoutController, registerController, updateFacultyAndAdminDetailsController, verifyOtpAndResetPasswordController } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login",loginController);
authRouter.post("/logout",logoutController);
authRouter.post("/forgot-password",forgetPasswordController);//faculty
authRouter.post("/reset-password",verifyOtpAndResetPasswordController);//faculty
authRouter.get("/get-user-details",protectedRoute,getUserDetails);
authRouter.post("/change-password",protectedRoute,changePasswordController);
authRouter.put("/update-details",protectedRoute,updateFacultyAndAdminDetailsController);
export default authRouter;