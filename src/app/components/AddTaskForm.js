"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AddTaskForm({ onClose, onTaskAdded }) {
    const [formData, setFormData] = useState({
        taskId: "",
        projectId: "",
        taskName: "",
        startDate: "",
        endDate: "",
        requiredSkills: "",
        status: "Open",
    });
    const [formError, setFormError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmitTask = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");


            const skillsArray = formData.requiredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill);

            if (skillsArray.length === 0) {
                throw new Error("At least one skill is required");
            }

            const payload = {
                ...formData,
                requiredSkills: skillsArray,
            };

            const response = await fetch(
                "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/add-task",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (response.ok) {

                onTaskAdded();

                setFormData({
                    taskId: "",
                    projectId: "",
                    taskName: "",
                    startDate: "",
                    endDate: "",
                    requiredSkills: "",
                    status: "Open",
                });
                onClose();
                alert("Task created successfully!");
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Create New Task
                </h2>
                <form onSubmit={handleSubmitTask} className="space-y-6">
                    {/* Task ID and Project ID in same row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Task ID
                            </label>
                            <input
                                type="text"
                                name="taskId"
                                value={formData.taskId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., TASK005"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Project ID
                            </label>
                            <input
                                type="text"
                                name="projectId"
                                value={formData.projectId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., PROJ001"
                            />
                        </div>
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Task Name
                        </label>
                        <input
                            type="text"
                            name="taskName"
                            value={formData.taskName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., Develop Login Module"
                        />
                    </div>

                    {/* Start Date and End Date in same row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Required Skills (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo asio-500 focus:border-transparent transition-all duration-200"
                            placeholder="e.g., React, Node.js, MongoDB"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="Open">Open</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {formError && (
                        <div className="bg-red-50 dark:bg-red-900/50 p-3 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 text-sm">{formError}</p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {formLoading ? "Submitting..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}