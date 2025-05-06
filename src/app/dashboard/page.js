"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AddTaskForm from "../components/AddTaskForm";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("openTasks");
  const [selectedTask, setSelectedTask] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/getManagerTasks",
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
    }
  };

  // Fetch staff requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staffTaskRequests",
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
        setRequests(data.requests || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch staff for assignment
  const fetchStaffForTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/assign-task?taskId=${taskId}`,
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
        setStaffList(data.staff || []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle assign task
  const handleAssignTask = async () => {
    if (!selectedStaff) {
      setError("Please select a staff member");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/assign-task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId: selectedTask.taskId,
            email: selectedStaff.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Task assigned successfully!");
        setIsAssignModalOpen(false);
        setSelectedTask(null);
        setSelectedStaff(null);
        setStaffList([]);
        await fetchTasks(); // Refresh tasks
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle approve/reject request
  const handleRequestAction = async (taskId, email, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/request-action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId,
            email,
            action, // "approve" or "reject"
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(`Request ${action}d successfully!`);
        await fetchRequests(); // Refresh requests
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Open assign modal
  const openAssignModal = async (task) => {
    setSelectedTask(task);
    setIsAssignModalOpen(true);
    await fetchStaffForTask(task.taskId);
  };

  // Close assign modal
  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedTask(null);
    setSelectedStaff(null);
    setStaffList([]);
    setError(null);
  };

  // Handle task added
  const handleTaskAdded = async () => {
    await fetchTasks();
  };

  // Load data based on active tab
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (activeTab === "openTasks") {
      fetchTasks().finally(() => setLoading(false));
    } else if (activeTab === "staffRequests") {
      fetchRequests().finally(() => setLoading(false));
    } else if (activeTab === "assignedTasks") {
      setLoading(false); // Placeholder
    }
  }, [activeTab]);

  // Open/close add task modal
  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manager Dashboard
            </h1>
            <button
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add Task
            </button>
          </div>

          <div className="flex space-x-2 mb-8 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("openTasks")}
              className={`py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === "openTasks"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Open Tasks
            </button>
            <button
              onClick={() => setActiveTab("staffRequests")}
              className={`py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === "staffRequests"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Staff Requests
            </button>

            {/* <button
              onClick={() => setActiveTab("assignedTasks")}
              className={`py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === "assignedTasks"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Assigned Tasks
            </button> */}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="ml-2 text-gray-600 dark:text-gray-400">
                Loading {activeTab === "openTasks" ? "tasks" : "requests"}...
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}


          {activeTab === "openTasks" && !loading && !error && tasks.length === 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No open tasks found. Create a new task to get started.
              </p>
            </div>
          )}
          {activeTab === "openTasks" && !loading && !error && tasks.length > 0 && (
            <div className="grid gap-6">
              {tasks.map((task) => (
                <div
                  key={task.taskId}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task.taskName}
                      </h2>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>
                          <span className="font-medium">Project ID:</span>{" "}
                          {task.projectId}
                        </p>
                        <p>
                          <span className="font-medium">Schedule:</span>{" "}
                          {task.startDate} to {task.endDate}
                        </p>
                        <p>
                          <span className="font-medium">Skills:</span>{" "}
                          {task.requiredSkills.join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {task.status}
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {task.status === "Open" && (
                      <button
                        onClick={() => openAssignModal(task)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                      >
                        Assign Task
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}


          {activeTab === "staffRequests" &&
            !loading &&
            !error &&
            requests.length === 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No staff requests found.
                </p>
              </div>
            )}
          {activeTab === "staffRequests" &&
            !loading &&
            !error &&
            requests.length > 0 && (
              <div className="grid gap-6">
                {requests.map((request) => (
                  <div
                    key={`${request.taskId}-${request.email}`}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {request.task.taskName}
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium">Task ID:</span>{" "}
                        {request.taskId}
                      </p>
                      <p>
                        <span className="font-medium">Project ID:</span>{" "}
                        {request.task.projectId}
                      </p>
                      <p>
                        <span className="font-medium">Schedule:</span>{" "}
                        {request.task.startDate} to {request.task.endDate}
                      </p>
                      <p>
                        <span className="font-medium">Skills:</span>{" "}
                        {request.task.requiredSkills.join(", ")}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Staff Details
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {request.staff.name}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {request.email}
                        </p>
                        <p>
                          <span className="font-medium">Skills:</span>{" "}
                          {request.staff.skills?.join(", ") || "None"}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-1">
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {request.status}
                      </p>
                      <p>
                        <span className="font-medium">Requested At:</span>{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {request.status === "pending" && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() =>
                            handleRequestAction(
                              request.taskId,
                              request.email,
                              "approve"
                            )
                          }
                          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleRequestAction(
                              request.taskId,
                              request.email,
                              "reject"
                            )
                          }
                          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          {activeTab === "assignedTasks" && !loading && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Assigned tasks will be displayed here.
              </p>
            </div>
          )}

          {isModalOpen && (
            <AddTaskForm onClose={closeModal} onTaskAdded={handleTaskAdded} />
          )}


          {isAssignModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Assign Task: {selectedTask?.taskName}
                </h2>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/50 p-3 rounded-md mb-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                )}
                {staffList.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No staff available for this task.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {staffList.map((staff) => (
                      <div
                        key={staff.email}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedStaff?.email === staff.email
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }`}
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {staff.name} ({staff.email})
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Skills: {staff.skills?.join(", ") || "None"}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {staff.percentageMatch}% Match
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeAssignModal}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignTask}
                    disabled={!selectedStaff}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign
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