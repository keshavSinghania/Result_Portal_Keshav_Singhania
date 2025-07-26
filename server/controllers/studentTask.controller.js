import User from "../models/user.model.js";
import mongoose from 'mongoose';

//fetching user result using user id (from auth controller) 
export const fetchStudentResult = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized or invalid user ID",
      });
    }

    const user = await User.findById(userId).select("result");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Result fetched successfully",
      result: user.result,
    });

  } catch (error) {
    if (error.name === "MongoNetworkError" || error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({
        success: false,
        error: true,
        message: "Service unavailable due to network issues. Please try again later.",
      });
    }

    console.error("Error fetching result:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error while fetching result.",
    });
  }
};

// To update section and branch of student using userId (from auth controller)
export const updateStudentDetails = async (req, res) => {
  console.log("check 1")
  try {
    const { userId } = req.user;
    const { section, branch } = req.body;
    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized. Please log in first.",
      });
    }

    // Fetch user from DB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found.",
      });
    }

    // Check if any data is provided
    if (!section && !branch) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide at least one field to update (section or branch).",
      });
    }

    // Update fields
    if (section) user.section = section;
    if (branch) user.branch = branch;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Student details updated successfully.",
      updatedUser: {
        name: updatedUser.name,
        email: updatedUser.email,
        section: updatedUser.section,
        branch: updatedUser.branch,
      },
    });

  } catch (error) {
    console.error("Error updating student details:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error. Please try again later.",
    });
  }
};
