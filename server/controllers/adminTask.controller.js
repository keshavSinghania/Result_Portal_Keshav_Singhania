import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// controller to fetch all faculty who are not approved
export const fetchUnapprovedFaculty = async (req, res) => {
  try {
    const unapprovedFaculty = await User.find({
      isApproved: false,
      role: "faculty",
    }).select("-password");

    if (unapprovedFaculty.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No unapproved faculty found.",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: unapprovedFaculty,
    });
  } catch (error) {
    console.error("Error fetching unapproved faculty:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error. Could not fetch unapproved faculty.",
    });
  }
};

// Controller to approve a faculty in DB (by faculty)
export const approveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;
    if (!facultyId) {
      return res.status(400).json({
        message: "Faculty ID is required to approve the student",
        error: true,
        success: false,
      });
    }

    const facultyToApprove = await User.findById(facultyId);

    if (!facultyToApprove) {
      return res.status(404).json({
        message: "No such faculty found",
        error: true,
        success: false,
      });
    }
    facultyToApprove.isApproved = true;

    await facultyToApprove.save();

    return res.status(200).json({
      message: "Faculty approved successfully",
      success: true,
      data: facultyToApprove,
    });

  } catch (error) {
    console.error("Error approving student:", error.message);
    return res.status(500).json({
      message: error.message || error || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// Controller to deny (delete) a faculty from DB
export const denyFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    if (!facultyId) {
      return res.status(400).json({
        message: "faculty ID is required to deny the student",
        error: true,
        success: false,
      });
    }

    const deletedFaculty = await User.findByIdAndDelete(facultyId);

    if (!deletedFaculty) {
      return res.status(404).json({
        message: "No such faculty found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Faculty denied and deleted successfully",
      success: true,
    });

  } catch (error) {
    console.error("Error denying student:", error.message);
    return res.status(500).json({
      message: error.message || error || "Internal server error",
      error: true,
      success: false,
    });
  }
};

// Controller to fetch all faculty from the database
export const fetchFaculties = async (req, res) => {
  try {
    const allFaculties = await User.find({ role: "faculty" , isApproved: true}).select("email name");

    if (!allFaculties || allFaculties.length === 0) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "No faculty members found. Please try again.",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully fetched all faculty members.",
      faculties: allFaculties,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || "Server error. Please try again later.",
    });
  }
};

// Controller to delete a faculty member from the database (Admin password required)
export const deletedFaculty = async (req, res) => {
  try {
    const { userId } = req.user;
    const { adminPassword, facultyId } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Unauthorized. Please log in to proceed.",
      });
    }

    if (!adminPassword) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Admin password is required.",
      });
    }

    // Fetching admin user details
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Admin user not found.",
      });
    }

    // Verifying admin password
    const isMatched = await bcrypt.compare(adminPassword, userDetails.password);
    if (!isMatched) {
      return res.status(403).json({
        error: true,
        success: false,
        message: "Incorrect admin password.",
      });
    }

    // Deleting faculty
    const deletedFaculty = await User.findByIdAndDelete(facultyId);
    if (!deletedFaculty) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Faculty member not found.",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Faculty account has been successfully deleted.",
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || "Server error. Please try again later.",
    });
  }
};


// Controller to fetch number of approved students in DB
export const getNumberOfUnapprovedFaculty = async (req, res) => {
  try {
    const facultyCount = await User.countDocuments({ role: "faculty", isApproved: false });

    return res.status(200).json({
      success: true,
      count: facultyCount,
      message: "Approved faculties count fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching faculties count:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error while fetching faculty count",
    });
  }
};