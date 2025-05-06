"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const checkAuthStatus = () => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    };

    useEffect(() => {

        checkAuthStatus();

        const handleRouteChange = () => {
            checkAuthStatus();
        };

        router.events?.on("routeChangeComplete", handleRouteChange);


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
        <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                        Mediphore
                    </span>
                </Link>
                <nav className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    ) : (
                        <Link href="/">
                            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 ease-in-out">
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}