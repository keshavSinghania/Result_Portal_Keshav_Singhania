// UploadSemesterResult.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { getStudentsByYearAndSection, uploadSemesterResult } from "../../../axios";
import { useNavigate } from "react-router-dom";

const UploadSemesterResult = () => {
  const [step, setStep] = useState(1);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [resultYear, setResultYear] = useState("");
  const [marks, setMarks] = useState({});
  const [semesterType, setSemesterType] = useState("odd");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userDetails = useSelector((state) => state.auth.user);
  const navigate = useNavigate()

  const fetchStudents = async () => {
    if (!year || !section) {
      setMessage("Please select both Year and Section.");
      return;
    }

    try {
      setLoading(true);
      const res = await getStudentsByYearAndSection({ year, section });
      const data = res?.data;
      if (data?.success) {
        setStudents(data?.students);
        setMessage(data?.message);
        setStep(2);
      } else {
        setMessage(data?.message || "Failed to fetch students. (No Student found)");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Something went wrong while fetching students.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleNextToMarks = () => {
    const initialMarks = {};
    selectedStudents.forEach((id) => (initialMarks[id] = ""));
    setMarks(initialMarks);
    setStep(3);
  };

  const handleUpload = async () => {
    if (!subject || !totalMarks || !resultYear) {
      setMessage("Fail to submit! ...Please fill in Subject, Total Marks, and Result Year.");
      return;
    }

    try {
      const resultData = selectedStudents.map((id) => ({
        studentId: id,
        subject,
        totalMarks: Number(totalMarks),
        obtainedMarks: Number(marks[id]),
        year: Number(resultYear),
        section,
        semesterType,
      }));

      const res = await uploadSemesterResult(resultData);
      const data = res?.data;

      setMessage(data?.message || "Semester results uploaded successfully.");

      setStep(4);
      setStudents([]);
      setSelectedStudents([]);
      setSubject("");
      setTotalMarks("");
      setMarks({});
      setSemesterType("odd");
      setResultYear("");
      setYear("");
      setSection("");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <section className="bg-white w-full max-w-4xl rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700">Upload Semester Exam Results</h2>
          <p className="text-gray-600">Jai Hind! {userDetails?.name}</p>
        </div>

        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Students Admission Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2020"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Batch(Course Duration)</label>
                <input
                  type="text"
                  value={year && !isNaN(year) ? `${year}-${parseInt(year) + 4}` : ""}
                  readOnly
                  className="border border-gray-300 rounded p-2 w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value.toUpperCase())}
                  placeholder="e.g. A"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={fetchStudents}
                disabled={loading}
                className={`bg-purple-600 text-white px-6 py-2 rounded transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"}`}
              >
                {loading ? "Fetching..." : "Fetch Students"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Year: {year} | Section: {section}</p>
              <button
                className="text-sm text-purple-600 underline mt-2"
                onClick={() => setSelectedStudents(students?.map((s) => s._id))}
              >
                Select All Students
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto divide-y">
              {students.map((student) => (
                <div key={student._id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{student?.name}</p>
                    <p className="text-xs text-gray-500">{student?.enrollment}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student?._id)}
                    onChange={() => handleStudentSelect(student?._id)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextToMarks}
                disabled={selectedStudents.length === 0}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Subject"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="e.g. 100"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Semester Type</label>
                <select
                  value={semesterType}
                  onChange={(e) => setSemesterType(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="odd">Odd</option>
                  <option value="even">Even</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Result Year</label>
                <input
                  type="number"
                  value={resultYear}
                  onChange={(e) => setResultYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto divide-y">
              {selectedStudents.map((id) => {
                const student = students.find((s) => s._id === id);
                return (
                  <div key={id} className="flex justify-between items-center py-2">
                    <div>
                      <p>{student?.name}</p>
                      <p className="text-xs text-gray-500">{student?.enrollment}</p>
                    </div>
                    <div>
                      <p>Subject</p>
                      <p className="text-xs text-gray-500">{subject}</p>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        max={totalMarks}
                        value={marks[id]}
                        onChange={(e) =>
                          setMarks({ ...marks, [id]: e.target.value })
                        }
                        placeholder="Marks"
                        className="border border-gray-300 rounded p-1 w-24 text-center"
                      /> / {totalMarks}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpload}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Upload Result
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="text-center mt-10 p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Upload Successful!</h2>
            <p className="text-green-700 text-base mb-6">
              All semester exam marks have been uploaded successfully.
            </p>
            <button
              onClick={() => {
                navigate(-1)
                setStep(1)
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Upload Another Result
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 text-sm ${message.toLowerCase().includes("fail") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </div>
        )}
      </section>
    </div>
  );
};

export default UploadSemesterResult;
