"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthSidebar from "./components/LeftPanel";
import ManagerStaffLogin from "./components/ManagerStaffLogin";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState("staff-login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        localStorage.setItem("token", data.token);
        console.log("Login successful:", data);
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
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <AuthSidebar />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${authMode === "manager-login"
                ? "bg-indigo-600 text-white"
                : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => setAuthMode("manager-login")}
            >
              Manager Login
            </button>
            <button nus
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${authMode === "staff-login"
                ? "bg-indigo-600 text-white"
                : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              onClick={() => setAuthMode("staff-login")}
            >
              Staff Login
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <ManagerStaffLogin
              mode={authMode}
              onSubmit={handleAuth}
              loading={loading}
              onToggleMode={() => { }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}