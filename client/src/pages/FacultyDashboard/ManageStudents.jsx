import React, { useState } from "react";
import { getStudentsByYearAndSection, updateStudentMarksApi } from "../../axios";
import { FaUserEdit } from "react-icons/fa";

const ManageStudents = () => {
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("No students found");
  const [step, setStep] = useState(1);
  const [detailedStudent, setDetailedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateStudentMarksPayload, setUpdateStudentMarksPayload] = useState({
    studentId: "",
    subjectMarkId: "",
    newObtainedMarks: "",
    enteredPassword: "",
  });

  const fetchFilteredStudents = async () => {
    if (!year || !section) {
      setMessage("Please enter both Year and Section");
      return;
    }

    setStudents([]);
    setMessage("");
    try {
      const res = await getStudentsByYearAndSection({ year, section });
      setStudents(res?.data?.students || []);
      if (!res?.data?.students?.length) setMessage("No students found.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const moreDetailsHandler = (studentId) => {
    const selectedStudent = students.find((s) => s._id === studentId);
    setDetailedStudent(selectedStudent);
    setStep(2);
    setUpdateStudentMarksPayload((prev) => ({
      ...prev,
      studentId: studentId,
    }));
  };

  const updateStudentMarksHandler = async () => {
    const { studentId, subjectMarkId, newObtainedMarks, enteredPassword } = updateStudentMarksPayload;

    if (!studentId || !subjectMarkId || !newObtainedMarks || !enteredPassword) {
      setMessage("Please enter all required details.");
      return;
    }

    try {
      const res = await updateStudentMarksApi(updateStudentMarksPayload);
      if (res?.data?.success) {
        setShowModal(false);
        setMessage(res?.data?.message || "Marks updated successfully.");

        // ✅ Locally update the marks in detailedStudent
        const updatedResults = detailedStudent.result.map((result) => {
          return {
            ...result,
            sessionals: result.sessionals?.map((sess) => ({
              ...sess,
              marks: sess.marks?.map((mark) => {
                if (mark._id === subjectMarkId) {
                  return { ...mark, obtainedMarks: newObtainedMarks };
                }
                return mark;
              }),
            })),
          };
        });

        setDetailedStudent((prev) => ({
          ...prev,
          result: updatedResults,
        }));

        // Reset payload (except studentId)
        setUpdateStudentMarksPayload((prev) => ({
          studentId: prev.studentId,
          subjectMarkId: "",
          newObtainedMarks: "",
          enteredPassword: "",
        }));
      } else {
        setMessage(res?.data?.message || "Update failed.");
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || error.message || "Failed to update marks.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 px-4 py-12">
      {step === 1 && (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Manage Students</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-purple-700 mb-1">Admission Year</label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-purple-700 mb-1">Section</label>
              <input
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full border border-purple-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-purple-600 hover:bg-purple-700 rounded-md p-2 text-white"
                onClick={fetchFilteredStudents}
              >
                Find Students
              </button>
            </div>
          </div>

          {students.length === 0 ? (
            <p className="text-center text-red-600">{message}</p>
          ) : (
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Batch</th>
                  <th className="px-4 py-2">Enrollment</th>
                  <th className="px-4 py-2">Branch</th>
                  <th className="px-4 py-2">More Details</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="text-center odd:bg-purple-50 even:bg-white">
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.year} - {Number(student.year) + 4}</td>
                    <td className="px-4 py-2">{student.enrollment}</td>
                    <td className="px-4 py-2">{student.branch}</td>
                    <td className="px-4 py-2 flex justify-center cursor-pointer">
                      <FaUserEdit onClick={() => moreDetailsHandler(student._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {step === 2 && detailedStudent && (
        <div className="bg-white max-w-4xl mx-auto mt-6 p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-purple-700">Student Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>Name:</strong> {detailedStudent.name}</p>
            <p><strong>DOB:</strong> {detailedStudent.dob}</p>
            <p><strong>Email:</strong> {detailedStudent.email}</p>
            <p><strong>Enrollment:</strong> {detailedStudent.enrollment}</p>
            <p><strong>Branch:</strong> {detailedStudent.branch}</p>
            <p><strong>Section:</strong> {detailedStudent.section}</p>
            <p><strong>Year:</strong> {detailedStudent.year}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-purple-600">Academic Results</h3>
            {detailedStudent.result?.length > 0 ? (
              [...detailedStudent.result].sort((a, b) => b.year - a.year).map((res) => (
                <div key={res._id} className="border rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-bold text-purple-700">
                    Year: {res.year} | Semester: {res.semesterType || "N/A"}
                  </h4>

                  <h5 className="mt-2 font-semibold">Sessionals:</h5>
                  {res.sessionals?.length ? res.sessionals.map((sess, i) => (
                    <div key={i} className="mb-4">
                      <p className="font-medium text-sm mb-1">Sessional {sess.sessionalNumber}</p>
                      <table className="w-full text-sm border border-collapse">
                        <thead className="bg-gray-100 text-gray-800">
                          <tr>
                            <th className="border px-2 py-1">Subject</th>
                            <th className="border px-2 py-1">Obtained</th>
                            <th className="border px-2 py-1">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sess.marks.map((mark, mi) => (
                            <tr key={mi} className="text-center">
                              <td className="border px-2 py-1">{mark.subject}</td>
                              <td className="border py-1 flex justify-between items-center ">
                                {mark.obtainedMarks}
                                <FaUserEdit
                                  className="ml-2 cursor-pointer text-purple-600"
                                  onClick={() => {
                                    setUpdateStudentMarksPayload((prev) => ({
                                      ...prev,
                                      subjectMarkId: mark._id,
                                    }));
                                    setShowModal(true);
                                  }}
                                />
                              </td>
                              <td className="border px-2 py-1">{mark.totalMarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )) : <p className="text-sm text-gray-500">No sessionals available.</p>}

                  <h5 className="mt-2 font-semibold">Semester Exams:</h5>
                  {res.semesterExam?.length ? (
                    <table className="w-full text-sm border border-collapse">
                      <thead className="bg-gray-100 text-gray-800">
                        <tr>
                          <th className="border px-2 py-1">Subject</th>
                          <th className="border px-2 py-1">Obtained</th>
                          <th className="border px-2 py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.semesterExam.map((exam, ei) => (
                          <tr key={ei} className="text-center">
                            <td className="border px-2 py-1">{exam.subject}</td>
                            <td className="border px-2 py-1">{exam.obtainedMarks}</td>
                            <td className="border px-2 py-1">{exam.totalMarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : <p className="text-sm text-gray-500">No semester exam data available.</p>}
                </div>
              ))
            ) : <p className="mt-3 text-gray-500">No result data found.</p>}
          </div>

          <button
            className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            onClick={() => setStep(1)}
          >
            ⬅ Back
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-purple-700">Update Marks</h2>
            <div>
              <label className="block text-sm mb-1">New Obtained Marks:</label>
              <input
                type="number"
                value={updateStudentMarksPayload.newObtainedMarks}
                onChange={(e) => setUpdateStudentMarksPayload((prev) => ({
                  ...prev,
                  newObtainedMarks: e.target.value,
                }))}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block text-sm mb-1">Enter Your Password:</label>
              <input
                type="password"
                value={updateStudentMarksPayload.enteredPassword}
                onChange={(e) => setUpdateStudentMarksPayload((prev) => ({
                  ...prev,
                  enteredPassword: e.target.value,
                }))}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <div className="flex justify-end space-x-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  onClick={updateStudentMarksHandler}
                >
                  Update
                </button>
              </div>
              <p className="text-sm text-red-600 mt-2">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
