import React, { useState, useEffect } from "react";
import {
  approveFacultyApi,
  denyFacultyApi,
  fetchUnapprovedFacultyApi,
} from "../../axios";

const ApproveFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [actionType, setActionType] = useState(""); // 'approve' or 'deny'
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUnapprovedFacultyHandle = async () => {
    try {
      const res = await fetchUnapprovedFacultyApi();
      const data = res?.data;
      const unApprovedFaculties = data?.data || [];
      setFaculties(unApprovedFaculties);
    } catch (error) {
      console.error("Error fetching unapproved faculties:", error);
    }
  };

  useEffect(() => {
    fetchUnapprovedFacultyHandle();
  }, []);

  const handleAction = (faculty, type) => {
    setSelectedFaculty(faculty);
    setActionType(type);
  };

  const confirmAction = async () => {
    const payload = {
      facultyId: selectedFaculty._id,
    };
    try {
      if (actionType === "approve") {
        await approveFacultyApi(payload);
        setSuccessMessage(`${selectedFaculty.name} has been approved successfully.`);
      }

      if (actionType === "deny") {
        await denyFacultyApi(payload);
        setSuccessMessage(`${selectedFaculty.name} has been denied and deleted.`);
      }

      setFaculties((prev) =>
        prev.filter((f) => f._id !== selectedFaculty._id)
      );
    } catch (error) {
      console.error("Action failed:", error);
      setSuccessMessage("Something went wrong. Please try again.");
    }

    setSelectedFaculty(null);
    setActionType("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const cancelAction = () => {
    setSelectedFaculty(null);
    setActionType("");
  };

  return (
    <div className="h-full flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Pending Faculty Approvals
        </h2>

        {successMessage && (
          <div className="mb-4 text-green-600 font-medium bg-green-100 p-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {faculties.length === 0 ? (
          <p className="text-gray-600">No faculties awaiting approval.</p>
        ) : (
          <ul className="space-y-6">
            {faculties.map((faculty) => (
              <li
                key={faculty._id}
                className="flex justify-between items-center bg-purple-50 p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-semibold text-purple-700">
                    {faculty.name}
                  </p>
                  <p className="text-sm text-gray-600">{faculty.email}</p>
                  <p className="text-sm text-gray-500">{faculty.facultyId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(faculty, "approve")}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(faculty, "deny")}
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
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Confirm {actionType === "approve" ? "Approval" : "Denial"}
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to{" "}
              <span className="font-bold">{actionType}</span> faculty{" "}
              <span className="text-purple-700 font-medium">
                {selectedFaculty.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === "approve"
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

export default ApproveFaculty;
