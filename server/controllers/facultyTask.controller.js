
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

// controller to fetch all students who are not approved
export const fetchUnapprovedStudents = async (req, res) => {
  try {
    const unapprovedStudents = await User.find({
      isApproved: false,
      role: "student",
    }).select("-password");

    if (unapprovedStudents.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No unapproved students found.",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: unapprovedStudents,
    });
  } catch (error) {
    console.error("Error fetching unapproved students:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error. Could not fetch unapproved students.",
    });
  }
};


// Controller to approve a student in DB (by faculty)
export const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
        error: true,
        success: false,
      });
    }

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { isApproved: true },
      { new: true } 
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Student approved successfully",
      success: true,
      data: updatedStudent,
    });

  } catch (error) {
    console.error("Error approving student:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};
   
// Controller to deny (delete) a student from DB
export const denyStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required to deny the student",
        error: true,
        success: false,
      });
    }

    const deletedStudent = await User.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "No such student found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Student denied and deleted successfully",
      success: true,
    });

  } catch (error) {
    console.error("Error denying student:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

// Controller to update a student's marks using subject mark ID and student ID
// Extra security: faculty must re-enter password to confirm

export const updateStudentMarks = async (req, res) => {
  try {
    const { studentId, subjectMarkId, newObtainedMarks, enteredPassword } = req.body;
    const { userId} = req.user; // Authenticated from middleware

    // Verifying faculty by re-entered password
    const facultyDetails = await User.findById(userId);
    if (!facultyDetails) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    const isMatched = await bcrypt.compare(enteredPassword, facultyDetails.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Cannot update student marks.",
      });
    }
    
    // Updating the student's obtained marks
    const updatedStudent = await User.findOneAndUpdate(
      {
        _id: studentId,
        "result.sessionals.marks._id": subjectMarkId,
      },
      {
        $set: {
          "result.$[].sessionals.$[].marks.$[mark].obtainedMarks": newObtainedMarks,
        },
      },
      {
        arrayFilters: [
          { "mark._id": subjectMarkId }
        ],
        new: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student or subject mark not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marks updated successfully.",
      updatedStudent,
    });

  } catch (error) {
    console.error("Error updating student marks:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


// Controller to fetch number of approved students in DB
export const getNumberOfApprovedStudents = async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: "student", isApproved: true });

    return res.status(200).json({
      success: true,
      count: studentsCount,
      message: "Approved students count fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching student count:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error while fetching student count",
    });
  }
};


// Controller to fetch number of approved students in DB
export const getNumberOfUnapprovedStudents = async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: "student", isApproved: false });

    return res.status(200).json({
      success: true,
      count: studentsCount,
      message: "Unapproved students count fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching unapproved student count:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error while fetching unapproved student count",
    });
  }
};

