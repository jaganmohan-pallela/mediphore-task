"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftPanel from "./components/LeftPanel";
import ManagerStaffLogin from "./components/ManagerStaffLogin";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState("staff-login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check for existing token and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          return;
        }
        if (decoded.role === "staff") {
          router.push("/staffdashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  // Authentication handler
  const handleAuth = async (formData) => {
    setLoading(true);

    try {
      const endpoint =
        authMode === "manager-login"
          ? "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/manager-login"
          : "https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT in localStorage
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);
        // Redirect to appropriate dashboard
        if (authMode === "manager-login") {
          router.push("/dashboard");
        } else {
          router.push("/staffdashboard");
        }
      } else {
        console.error("Login failed:", data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left decorative panel */}
      <LeftPanel />

      {/* Right panel - auth forms */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Auth Type Selector */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 mb-8 overflow-hidden">
            <button
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                authMode === "manager-login"
                  ? "bg-gray-900 text-white dark:bg-gray-800"
                  : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setAuthMode("manager-login")}
            >
              Manager Login
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                authMode === "staff-login"
                  ? "bg-gray-900 text-white dark:bg-gray-800"
                  : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
              }`}
              onClick={() => setAuthMode("staff-login")}
            >
              Staff
            </button>
          </div>

          {/* Render ManagerStaffLogin */}
          <ManagerStaffLogin
            mode={authMode}
            onSubmit={handleAuth}
            loading={loading}
            onToggleMode={() => {}}
          />
        </div>
      </div>
    </div>
  );
}