import User from "../models/user.model.js";

// Get students by year and section
export const getStudentsByYearAndSection = async (req, res) => {
  try {
    const { year, section } = req.query;

    if (!year || !section) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Year and section are required parameters.",
      });
    }

    const students = await User.find({
      role: "student",
      year,
      section,
    }).select("-password");

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No students found for the specified year and section.",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Students fetched successfully.",
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error. Please try again later.",
    });
  }
};

//Upload sessional resullt controller
export const uploadSessionalResult = async (req, res) => {
  try {
    const results = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid input. Expecting an array of result data." });
    }

    for (const result of results) {
      const {
        studentId,
        subject,
        totalMarks,
        obtainedMarks,
        semesterType,
        year,
        sessionalNumber,
      } = result;

      const student = await User.findById(studentId);
      if (!student) continue;

      // STEP 1: Find or create result entry
      let resultIndex = student.result.findIndex(
        (r) => r.year === Number(year) && r.semesterType === semesterType
      );

      if (resultIndex === -1) {
        student.result.push({
          year: Number(year),
          semesterType,
          sessionals: [],
          semesterExam: [],
        });
        resultIndex = student.result.length - 1;
      }

      const resultEntry = student.result[resultIndex];

      // STEP 2: Find or create sessional inside that result
      let sessionalIndex = resultEntry.sessionals.findIndex(
        (s) => s.sessionalNumber === Number(sessionalNumber)
      );

      if (sessionalIndex === -1) {
        resultEntry.sessionals.push({
          sessionalNumber: Number(sessionalNumber),
          marks: [],
        });
        sessionalIndex = resultEntry.sessionals.length - 1;
      }

      // STEP 3: Push new mark entry
      resultEntry.sessionals[sessionalIndex].marks.push({
        subject,
        totalMarks: Number(totalMarks),
        obtainedMarks: Number(obtainedMarks),
      });

      // STEP 4: Manually mark modified (important)
      student.markModified("result");

      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: "Sessional results uploaded successfully.",
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading sessional results.",
    });
  }
};

//upload semester result controller
export const uploadSemesterResult = async (req, res) => {
  try {
    const results = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Expecting an array of result data.",
      });
    }

    for (const result of results) {
      const {
        studentId,
        subject,
        totalMarks,
        obtainedMarks,
        semesterType,
        year,
      } = result;

      const student = await User.findById(studentId);
      if (!student) continue;

      // STEP 1: Find or create result entry
      let resultIndex = student.result.findIndex(
        (r) => r.year === Number(year) && r.semesterType === semesterType
      );

      if (resultIndex === -1) {
        student.result.push({
          year: Number(year),
          semesterType,
          sessionals: [],
          semesterExam: [],
        });
        resultIndex = student.result.length - 1;
      }

      const resultEntry = student.result[resultIndex];

      // STEP 2: Push semester exam mark
      resultEntry.semesterExam.push({
        subject,
        totalMarks: Number(totalMarks),
        obtainedMarks: Number(obtainedMarks),
      });

      // STEP 3: Mark modified and save
      student.markModified("result");
      await student.save();
    }

    return res.status(200).json({
      success: true,
      message: "Semester results uploaded successfully.",
    });
  } catch (error) {
    console.error("Semester Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading semester results.",
    });
  }
};



