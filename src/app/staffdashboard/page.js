"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { Calendar, Clock, Award, ChevronRight, X, Check, AlertCircle } from "lucide-react";

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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Staff Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage your tasks and availability
                            </p>
                        </div>
                        <button
                            onClick={() => setIsApprovedTasksModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
                        >
                            <Award className="mr-2 h-4 w-4" />
                            Your Tasks
                            <span className="ml-1 bg-indigo-500 px-2 py-0.5 rounded-full text-xs">
                                {approvedTasks.length}
                            </span>
                        </button>
                    </div>

                    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Your Availability
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            {isEditingAvailability ? (
                                <form onSubmit={handleAvailabilitySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="startDate"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Start Date
                                            </label>
                                            <input
                                                id="startDate"
                                                name="startDate"
                                                type="date"
                                                value={availability.startDate}
                                                onChange={handleAvailabilityChange}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="endDate"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                End Date
                                            </label>
                                            <input
                                                id="endDate"
                                                name="endDate"
                                                type="date"
                                                value={availability.endDate}
                                                onChange={handleAvailabilityChange}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 px-3"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 mt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Save
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingAvailability(false)}
                                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Clock className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                                        {availability.startDate && availability.endDate ? (
                                            <span>Available from <span className="font-medium">{availability.startDate}</span> to <span className="font-medium">{availability.endDate}</span></span>
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400 italic">Not set</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsEditingAvailability(true)}
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {availability.startDate ? "Edit Availability" : "Set Availability"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                                    <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                        {error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && !error && (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Loading tasks...</span>
                            </div>
                        </div>
                    )}


                    {!loading && !error && tasks.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No matching tasks</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                No open tasks match your skills at the moment.
                            </p>
                        </div>
                    )}

                    {!loading && !error && tasks.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Available Tasks ({tasks.length})
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {tasks.map((task) => (
                                    <div
                                        key={task.taskId}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="px-6 py-4">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                            {task.taskName}
                                                        </h3>
                                                        <span
                                                            className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${task.percentageMatch >= 70
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                                                    : task.percentageMatch >= 50
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'}`}
                                                        >
                                                            {task.percentageMatch}% Match
                                                        </span>
                                                    </div>

                                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                            Project ID: {task.projectId}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {task.startDate} to {task.endDate}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Required Skills:
                                                        </span>
                                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                            {task.requiredSkills.map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end">
                                                    {task.percentageMatch > 30 && !task.hasRequested && !task.isRejected && (
                                                        <button
                                                            onClick={() => handleRequestTask(task.taskId)}
                                                            disabled={loading}
                                                            className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                                                        >
                                                            <Check className="mr-1.5 h-4 w-4" />
                                                            Request Task
                                                        </button>
                                                    )}
                                                    {task.percentageMatch > 30 && task.hasRequested && (
                                                        <span className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Requested
                                                        </span>
                                                    )}
                                                    {task.percentageMatch > 30 && task.isRejected && (
                                                        <span className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                                            <X className="mr-1.5 h-4 w-4" />
                                                            Rejected
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isApprovedTasksModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Award className="h-5 w-5 text-indigo-500 mr-2" />
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Your Approved Tasks
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setIsApprovedTasksModalOpen(false)}
                                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-6 py-4">
                                    {approvedTasks.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No approved tasks</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                You don't have any approved tasks at the moment.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-96 overflow-y-auto px-1">
                                            {approvedTasks.map((task) => (
                                                <div
                                                    key={task.taskId}
                                                    className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                                                >
                                                    <div className="px-4 py-4">
                                                        <div>
                                                            <div className="flex justify-between">
                                                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                                                    {task.taskName}
                                                                </h3>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                                    Approved
                                                                </span>
                                                            </div>

                                                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                                    </svg>
                                                                    Project ID: {task.projectId}
                                                                </div>
                                                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {task.startDate} to {task.endDate}
                                                                </div>
                                                            </div>

                                                            <div className="mt-2 flex flex-wrap gap-1 items-center">
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">Skills:</span>
                                                                {task.requiredSkills.map((skill) => (
                                                                    <span
                                                                        key={skill}
                                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Approved: {new Date(task.requestedAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <button
                                        onClick={() => setIsApprovedTasksModalOpen(false)}
                                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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
    )
}