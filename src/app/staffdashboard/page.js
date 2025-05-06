"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function StaffDashboard() {
  const [tasks, setTasks] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({
    startDate: "",
    endDate: "",
  });
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isApprovedTasksModalOpen, setIsApprovedTasksModalOpen] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-tasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved tasks
  const fetchApprovedTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/approved-tasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setApprovedTasks(data.tasks || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details (for availability)
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/user-details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.user?.availability) {
        setAvailability({
          startDate: data.user.availability.startDate || "",
          endDate: data.user.availability.endDate || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // Handle availability form changes
  const handleAvailabilityChange = (e) => {
    setAvailability({
      ...availability,
      [e.target.name]: e.target.value,
    });
  };

  // Submit availability update
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availability }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Availability updated successfully!");
        setIsEditingAvailability(false);
        fetchTasks(); // Refresh tasks to reflect updated availability
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Request task
  const handleRequestTask = async (taskId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Task request submitted successfully!");
        fetchTasks(); // Refresh tasks to update hasRequested status
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserDetails();
    fetchApprovedTasks(); // Fetch approved tasks on mount
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Staff Dashboard
            </h1>
            <button
              onClick={() => setIsApprovedTasksModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Your Tasks ({approvedTasks.length})
            </button>
          </div>

          {/* Availability Section */}
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Availability
            </h2>
            {isEditingAvailability ? (
              <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="startDate"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={availability.startDate}
                      onChange={handleAvailabilityChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="endDate"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      End Date
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={availability.endDate}
                      onChange={handleAvailabilityChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-70"
                  >
                    {loading ? "Updating..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAvailability(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium focus:outline-none transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {availability.startDate && availability.endDate
                    ? `${availability.startDate} to ${availability.endDate}`
                    : "Not set"}
                </p>
                <button
                  onClick={() => setIsEditingAvailability(true)}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                >
                  {availability.startDate ? "Edit Availability" : "Set Availability"}
                </button>
              </div>
            )}
          </div>

          {/* Error and Loading States */}
          {error && (
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          )}

          {loading && (
            <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
          )}

          {/* No Tasks */}
          {!loading && !error && tasks.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              No open tasks match your skills at the moment.
            </p>
          )}

          {/* Tasks List */}
          {!loading && !error && tasks.length > 0 && (
            <div className="space-y-6">
              {tasks.map((task) => (
                <div
                  key={task.taskId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {task.taskName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Project ID: {task.projectId}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Start Date: {task.startDate}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        End Date: {task.endDate}
                      </p>
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Required Skills:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.requiredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {task.percentageMatch}% Match
                      </p>
                      {task.percentageMatch > 30 && !task.hasRequested && !task.isRejected && (
                        <button
                          onClick={() => handleRequestTask(task.taskId)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:opacity-70"
                        >
                          Request Task
                        </button>
                      )}
                      {task.percentageMatch > 30 && task.hasRequested && (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-medium cursor-not-allowed"
                        >
                          Requested
                        </button>
                      )}
                      {task.percentageMatch > 30 && task.isRejected && (
                        <button
                          disabled
                          className="px-4 py-2 bg-red-400 text-white rounded-md text-sm font-medium cursor-not-allowed"
                        >
                          Rejected
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approved Tasks Modal */}
          {isApprovedTasksModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Approved Tasks
                </h2>
                {approvedTasks.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No approved tasks found.</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {approvedTasks.map((task) => (
                      <div
                        key={task.taskId}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {task.taskName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Project ID:</strong> {task.projectId}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Schedule:</strong> {task.startDate} to {task.endDate}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Skills:</strong> {task.requiredSkills.join(", ")}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Approved At:</strong>{" "}
                          {new Date(task.requestedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsApprovedTasksModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}