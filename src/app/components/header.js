"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Function to check token and update isLoggedIn
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();

    // Listen for route changes
    const handleRouteChange = () => {
      checkAuthStatus();
    };

    // Subscribe to route change events
    router.events?.on("routeChangeComplete", handleRouteChange);

    // Clean up event listener on unmount
    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="bg-white sticky z-50 top-0 dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Mediphore
          </h1>
        </Link>
        <nav>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <Link href="/">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}