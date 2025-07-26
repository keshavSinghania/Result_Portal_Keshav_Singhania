import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { deletedFacultyApi, fetchFacultiesApi } from '../../axios';

const ManageFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [showConfirmBox, setShowConfirmBox] = useState(null); // facultyId
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const res = await fetchFacultiesApi();
      console.log(res)
      if (res?.data?.success) {
        setFaculties(res.data.faculties || []);
        setMessage('');
      } else {
        setMessage(res?.data?.message || 'Unable to fetch faculties');
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (facultyId) => {
    if (!adminPassword) {
      setMessage('Password required!');
      return;
    }

    try {
      setLoading(true);
      const res = await deletedFacultyApi({ facultyId, adminPassword });

      if (res?.data?.success) {
        setMessage(res?.data?.message || 'Faculty deleted successfully.');
        setShowConfirmBox(null);
        setAdminPassword('');
        fetchFaculties(); // refresh list
      } else {
        setMessage(res?.data?.message || 'Failed to delete.');
      }
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Deletion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Manage Faculty
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 text-center text-sm font-medium rounded ${
              message.toLowerCase().includes('success')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {loading ? 'Processing...' : message}
          </div>
        )}

        {loading && faculties.length === 0 ? (
          <p className="text-center text-gray-600">Loading faculties...</p>
        ) : faculties.length === 0 ? (
          <p className="text-center text-gray-600">No faculties found.</p>
        ) : (
          <div className="space-y-4">
            {faculties.map((faculty) => (
              <div
                key={faculty._id}
                className="flex flex-col md:flex-row justify-between md:items-center bg-purple-50 p-4 rounded-md border border-purple-200 gap-3"
              >
                <div>
                  <p className="font-semibold text-purple-800">{faculty.name}</p>
                  <p className="text-sm text-gray-600">{faculty.email}</p>
                </div>

                <div className="w-full md:w-auto">
                  {showConfirmBox === faculty._id ? (
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <input
                        type="password"
                        placeholder="Enter Admin Password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="px-3 py-1 rounded border border-gray-300 focus:outline-purple-700"
                      />
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmBox(null);
                          setAdminPassword('');
                          setMessage('');
                        }}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowConfirmBox(faculty._id);
                        console.log(faculty._id)
                        setAdminPassword('');
                        setMessage('');
                      }}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirmBox && (
          <p className="mt-6 text-sm text-red-600 font-medium text-center">
            ⚠️ Deleting a faculty is <span className="underline">permanent</span> and cannot be undone.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageFaculty;
