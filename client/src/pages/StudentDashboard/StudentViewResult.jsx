import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaFileAlt } from "react-icons/fa";
import { viewResultApi } from "../../axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import watermarkLogo from "../../assets/subharti-logo.png";

const StudentViewResult = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState([]);
  const [selectedYear, setSelectedYear] = useState();

  const resultRef = useRef(); // Ref for result section

  const fetchStudentResult = async () => {
    try {
      setLoading(true);
      const res = await viewResultApi();
      const data = res?.data;

      if (data?.success) {
        setResult(data?.result || []);
        setMessage(data.message || "Result fetched successfully.");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleDownloadPdf = async () => {
  //   const input = resultRef.current;
  //   if (!input) return;

  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //     backgroundColor: "#fff",
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //   // Add result image
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  //   // Optional text watermark
  //   pdf.setTextColor(150);
  //   pdf.setFontSize(30);
  //   pdf.text("SUBHARTI UNIVERSITY", pdfWidth / 2, pdfHeight / 2, {
  //     align: "center",
  //     angle: 45,
  //   });

  //   // Optional image watermark (replace text if using this)
  //   // pdf.setGState(new pdf.GState({ opacity: 0.1 }));
  //   // pdf.addImage(watermarkLogo, "PNG", 30, 100, 150, 150);

  //   pdf.save(`${userDetails?.name || "student"}_result.pdf`);
  // };

  const handleDownloadPdf = async () => {
    const input = resultRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * (pdfWidth - 20)) / imgProps.width;

    const margin = 10;
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin,
      pdfWidth - margin * 2,
      pdfHeight
    );

    // Watermark image in center with low opacity
    pdf.setGState(new pdf.GState({ opacity: 0.1 }));
    pdf.addImage(watermarkLogo, "PNG", pdfWidth / 2 - 40, pdfHeight / 2, 80, 80);

    pdf.save(`${userDetails?.name || "student"}_result.pdf`);
  };


  const uniqueYears = Array.from(new Set(result.map((r) => r.year))).sort();
  const filteredResults = selectedYear
    ? result.filter((r) => r.year === Number(selectedYear))
    : result;

  return (
    <div className="min-h-screen bg-purple-100 flex justify-center items-start pt-24 px-4 sm:px-6 lg:px-8">
      {step === 1 && (
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4 text-center">
            Result Dashboard
          </h2>

          <p className="text-center text-gray-600 mb-8 text-base sm:text-lg">
            Welcome, <span className="font-semibold">{userDetails?.name || "Student"}</span>
            <br />
            Enrollment No:{" "}
            <span className="text-purple-700 font-medium">{userDetails?.enrollment || "N/A"}</span>
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => {
                setStep(2);
                fetchStudentResult();
              }}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl shadow transition text-sm sm:text-base"
            >
              <FaFileAlt className="text-xl" />
              <span className="font-bold">View Your Result</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-6xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Your Results</h2>

          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {!loading && message && (
            <p className="text-center text-green-600 mb-4">{message}</p>
          )}

          {!loading && result.length > 0 && (
            <>
              <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
                <select
                  className="border border-gray-300 rounded px-3 py-1"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Filter by Year</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (!selectedYear) {
                      setStep(3);
                      return;
                    }
                    handleDownloadPdf()
                  }}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg shadow"
                >
                  Download Result as PDF
                </button>
              </div>

              <div ref={resultRef}>
                <div>
                  <h2 className="text-xl font-bold text-purple-700 mb-2  pb-1">{userDetails.name}</h2>
                  <h2 className="text-xl font-bold text-purple-700 mb-2 pb-1">{userDetails.enrollment}</h2>
                  <h2 className="text-xl font-bold text-purple-700 mb-2 pb-1">Batch: {userDetails?.year} - {Number(userDetails?.year)+4}</h2>
                </div>
                {filteredResults.map((res, i) => (
                  <div key={i} className="mb-10">
                    <h3 className="text-xl font-bold text-purple-700 mb-2 border-b pb-1">
                      Year: {res.year} — Semester: {res.semesterType}
                    </h3>

                    {/* Sessional Table */}
                    {res.sessionals?.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-600 mb-1">Sessional Exams</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full table-auto border border-gray-300 text-sm mb-4">
                            <thead>
                              <tr className="bg-purple-100 text-left font-semibold">
                                <th className="border px-3 py-2">Sessional No.</th>
                                <th className="border px-3 py-2">Subject</th>
                                <th className="border px-3 py-2">Total</th>
                                <th className="border px-3 py-2">Obtained</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.sessionals.map((sessional, sIdx) =>
                                sessional.marks.map((mark, mIdx) => (
                                  <tr key={`sess-${sIdx}-${mIdx}`} className="hover:bg-purple-50">
                                    <td className="border px-3 py-2">{sessional.sessionalNumber}</td>
                                    <td className="border px-3 py-2">{mark.subject}</td>
                                    <td className="border px-3 py-2">{mark.totalMarks}</td>
                                    <td
                                      className={`border px-3 py-2 ${mark.obtainedMarks < mark.totalMarks / 2
                                        ? "text-red-600 font-semibold"
                                        : "text-green-700"
                                        }`}
                                    >
                                      {mark.obtainedMarks}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Semester Table */}
                    {res.semesterExam?.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-purple-600 mb-1">Semester Exam</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full table-auto border border-gray-300 text-sm">
                            <thead>
                              <tr className="bg-purple-100 text-left font-semibold">
                                <th className="border px-3 py-2">Subject</th>
                                <th className="border px-3 py-2">Total</th>
                                <th className="border px-3 py-2">Obtained</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.semesterExam.map((mark, mIdx) => (
                                <tr key={`sem-${mIdx}`} className="hover:bg-purple-50">
                                  <td className="border px-3 py-2">{mark.subject}</td>
                                  <td className="border px-3 py-2">{mark.totalMarks}</td>
                                  <td
                                    className={`border px-3 py-2 ${mark.obtainedMarks < mark.totalMarks / 2
                                      ? "text-red-600 font-semibold"
                                      : "text-green-700"
                                      }`}
                                  >
                                    {mark.obtainedMarks}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && result.length === 0 && (
            <p className="text-center text-gray-600">No result found.</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Select result year to download.</h3>
          <div className="flex flex-wrap gap-3">
            {uniqueYears.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setStep(2);
                  setTimeout(() => {
                    handleDownloadPdf()
                  }, 100)
                }}
                className={`px-4 py-2 rounded-md text-white transition ${selectedYear === year ? "bg-purple-600" : "bg-purple-400 hover:bg-purple-500"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentViewResult;
