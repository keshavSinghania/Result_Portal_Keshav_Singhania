import User from "../models/user.model.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user; //From auth middleware

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized access. Please login to continue.",
      });
    }

    // Fetch user from the database
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found. Please login again.",
      });
    }

    // Check if the user is a faculty
    if (userDetails.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Access denied. Only Admin's are authorized to perform this action.",
      });
    }

    next();

  } catch (error) {
    console.error("Error in verifyFaculty middleware:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error. Please try again later.",
    });
  }
};
