import React, { useState, useEffect } from "react";
import { approveStudentApi, denyStudentApi, fetchUnapprovedStudentsApi } from "../../axios";

const ApproveStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' or 'deny'
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUnapprovedStudentsHandle = async () => {
    try {
      const res = await fetchUnapprovedStudentsApi();
      const data = res?.data;
      const unApprovedStudents = data?.data || [];
      setStudents(unApprovedStudents);
    } catch (error) {
      console.error("Error fetching unapproved students:", error);
    }
  };

  useEffect(() => {
    fetchUnapprovedStudentsHandle();
  }, []);

  const handleAction = (student, type) => {
    setSelectedStudent(student);
    setActionType(type);
  };

  const confirmAction = async () => {
    const payload = {
      studentId: selectedStudent._id,
    };

    try {
      if (actionType === "approve") {
        await approveStudentApi(payload);
        setSuccessMessage(`${selectedStudent.name} has been approved successfully.`);
      }

      if (actionType === "deny") {
        await denyStudentApi(payload);
        setSuccessMessage(`${selectedStudent.name} has been denied and deleted.`);
      }

      setStudents((prev) => prev.filter(s => s._id !== selectedStudent._id));

    } catch (error) {
      console.error("Action failed:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }

    setSelectedStudent(null);
    setActionType("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const cancelAction = () => {
    setSelectedStudent(null);
    setActionType("");
  };

  return (
    <div className="h-full flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Pending Approvals
        </h2>

        {successMessage && (
          <div className="mb-4 text-green-600 font-medium bg-green-100 p-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {students.length === 0 ? (
          <p className="text-gray-600">No students awaiting approval.</p>
        ) : (
          <ul className="space-y-6">
            {students.map((student) => (
              <li
                key={student._id}
                className="flex justify-between items-center bg-purple-50 p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-semibold text-purple-700">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-sm text-gray-500">{student.enrollment}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(student, "approve")}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(student, "deny")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Deny
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Confirm {actionType === "approve" ? "Approval" : "Denial"}
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to{" "}
              <span className="font-bold">{actionType}</span> student{" "}
              <span className="text-purple-700 font-medium">
                {selectedStudent.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-md text-white ${actionType === "approve"
                  ? "bg-purple-700 hover:bg-purple-800"
                  : "bg-red-500 hover:bg-red-600"
                  } transition`}
              >
                Confirm
              </button>
              <button
                onClick={cancelAction}
                className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveStudents;
