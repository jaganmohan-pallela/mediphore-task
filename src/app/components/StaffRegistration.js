"use client";

import { useState } from "react";

export default function ManagerStaffLogin({ mode, onSubmit, loading, onToggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const isManagerMode = mode === 'manager-login';
  const title = isManagerMode ? 'Manager Login' : 'Staff Login';
  const subtitle = isManagerMode 
    ? 'Sign in to your management account' 
    : 'Access your staff dashboard';

  return (
    <>
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
              placeholder="name@company.com"
            />
          </div>
        </div>
        
        {/* Password field */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        {/* Submit button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-70 shadow-sm"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            <>
              {isManagerMode ? 'Sign in as Manager' : 'Sign in as Staff'}
            </>
          )}
        </button>
        
        {/* Toggle between login/register for staff - always render but hide when in manager mode */}
        <div className={`text-center text-sm ${isManagerMode ? 'invisible' : ''}`}>
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              disabled={isManagerMode}
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
            >
              Register now
            </button>
          </p>
        </div>
      </form>
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}