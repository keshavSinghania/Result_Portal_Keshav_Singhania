import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import sendOtpEmail from "../utils/sendOtp.js";
dotenv.config();

//Environment variable secrets
const JWT_SECRET = process.env.JWT_SECRET;

//register controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role, dob, branch, year, section, enrollment } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Please fill necessary details before registration",
        error: true,
        success: false,
      });
    }

    // Block restricted roles
    if (["admin", "examcell"].includes(role)) {
      return res.status(403).json({
        message: `You cannot register as ${role} directly.`,
        error: true,
        success: false,
      });
    }

    let existingUser;

    if (role === "student") {
      if (!dob) {
        return res.status(400).json({
          message: "Please provide Date of Birth (DOB)",
          error: true,
          success: false,
        });
      }
      if (!enrollment) {
        return res.status(400).json({
          message: "Please provide enrollment number",
          error: true,
          success: false,
        });
      }

      existingUser = await User.findOne({
        $or: [
          { email },
          { enrollment }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User with this email or enrollment already exists, please login",
          error: true,
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(dob.toString(), 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        dob,
        branch,
        year,
        section,
        enrollment
      });

      return res.status(201).json({
        message: "Student successfully registered",
        error: false,
        success: true,
      });
    }

    if (role === "faculty") {
      existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists, please login",
          error: true,
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password.toString(), 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return res.status(201).json({
        message: "Faculty successfully registered",
        error: false,
        success: true,
      });
    }

    return res.status(400).json({
      message: "Invalid role provided",
      error: true,
      success: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Error during registration: ${error.message || error}`,
      error: true,
      success: false,
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    const { email, password, role, enrollment } = req.body;

    // Role-based validation
    if (role === "student") {
      if (!enrollment || !password) {
        return res.status(400).json({
          message: "Enrollment and password are required for students.",
          success: false,
          error: true,
        });
      }
    } else if (role === "faculty") {
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required for faculty.",
          success: false,
          error: true,
        });
      }
    }

    // Find the user
    let user;
    if (role === "student") {
      user = await User.findOne({ enrollment, role });
    } else {
      user = await User.findOne({ email, role });
    }

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please register first.",
        success: false,
        error: true,
      });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong password or enrollment.",
        success: false,
        error: true,
      });
    }

    if (user.isApproved === false) {
      return res.status(401).json({
        message: user.role === "faculty"
          ? "Approval needed, contact exam cell"
          : "Approval needed, contact your faculty",
        success: false,
        error: true,
      });
    }

    //lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Set token in cookie (HttpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    return res.status(200).json({
      message: `Login successful as ${user.role}`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        enrollment: user.enrollment || null,
        lastLogin: user.lastLogin,
      },
      token: token,
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Login failed: ${error.message}`,
      success: false,
      error: true,
    });
  }
};


//logout controller
export const logoutController = async (req, res) => {
  try {
    //clearing the jwt cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Logged out successfully.",
      success: true,
      error: false,
    })
  } catch (error) {
    return res.status(500).json({
      message: `Error during logout: ${error.message || error}`,
      success: false,
      error: true,
    });
  }
}

//forget password otp sender
export const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
        error: true,
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: `Account not found with this email.`,
        error: true,
        success: false,
      });
    }

    if (existingUser.role !== "faculty") {
      return res.status(403).json({
        message: "Only faculty can reset their password manually.",
        error: true,
        success: false,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 mins

    // Save OTP & expiry in user
    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    // Send OTP via email
    await sendOtpEmail(existingUser.email, otp);

    return res.status(200).json({
      message: "OTP has been sent to your email.",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Error sending OTP: ${error.message}`,
      success: false,
      error: true,
    });
  }
};

//checking otp and changing password
export const verifyOtpAndResetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required.",
        success: false,
        error: true,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    // Check if user is faculty
    if (user.role !== "faculty") {
      return res.status(403).json({
        message: "Only faculty can reset password using OTP.",
        success: false,
        error: true,
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        success: false,
        error: true,
      });
    }

    // Check if OTP expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
        success: false,
        error: true,
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password successfully reset.",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Error resetting password: ${error.message}`,
      success: false,
      error: true,
    });
  }
};

//get user details using token
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please login again.",
        error: true,
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password -otp -otpExpiry -result");


    if (!user) {
      return res.status(404).json({
        message: "User not found. Please login again.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully.",
      success: true,
      error: false,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Server error: ${error.message}`,
      success: false,
      error: true,
    });
  }
};
//controller to change password using old password
export const changePasswordController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    // Check if userId exists
    if (!userId) {
      return res.status(400).json({
        message: "Something went wrong. Try again later.",
        error: true,
        success: false,
      });
    }

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old and new passwords are required.",
        error: true,
        success: false,
      });
    }

    // Prevent using same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password.",
        error: true,
        success: false,
      });
    }

    // Fetch user from DB
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        message: "User not found.",
        error: true,
        success: false,
      });
    }

    // Match old password
    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect old password.",
        error: true,
        success: false,
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    userDetails.password = hashedNewPassword;
    await userDetails.save();

    return res.status(200).json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: true,
      success: false,
    });
  }
};

// Controller to update faculty details
export const updateFacultyAndAdminDetailsController = async (req, res) => {
  try {
    const { userId } = req.user; // Extracted from protectedRoute middleware
    const { name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Current password is required to update details.",
        success: false,
        error: true,
      });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    if (user.role !== "faculty" && user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized: Only faculty and admin can update their profile.",
        success: false,
        error: true,
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect current password.",
        success: false,
        error: true,
      });
    }

    // Only check email uniqueness if user is trying to update it
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: "This email is already in use.",
          success: false,
          error: true,
        });
      }
      user.email = email;
    }

    // Update name if provided
    if (name) user.name = name;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Update Faculty Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      success: false,
      error: true,
    });
  }
};

