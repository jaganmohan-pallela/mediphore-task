"use client";

import { useState } from "react";

export default function ManagerStaffLogin({ mode, onSubmit, loading, onToggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [otp, setOtp] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState(null);

  const isManagerMode = mode === 'manager-login';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const skillsArray = skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      if (skillsArray.length === 0) {
        throw new Error('At least one skill is required');
      }

      const response = await fetch('https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          skills: skillsArray,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistering(false);
        setIsVerifyingOtp(true);
        setName('');
        setSkills('');
        setPassword('');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://o7lxjiq842.execute-api.ap-south-1.amazonaws.com/prod/staff-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerifyingOtp(false);
        setEmail('');
        setOtp('');
        alert('OTP verified successfully! You can now log in.');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
    setSkills('');
  };

  const title = isManagerMode
    ? 'Manager Login'
    : isRegistering
      ? 'Staff Registration'
      : isVerifyingOtp
        ? 'Verify OTP'
        : 'Staff Login';
  const subtitle = isManagerMode
    ? 'Sign in to your management account'
    : isRegistering
      ? 'Create your staff account'
      : isVerifyingOtp
        ? `Enter the OTP sent to ${email}`
        : 'Access your staff dashboard';

  return (
    <>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>


      {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}


      {!isRegistering && !isVerifyingOtp && (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
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
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                Forgot password?
              </a>
            </div>
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
              isManagerMode ? 'Sign in as Manager' : 'Sign in as Staff'
            )}
          </button>
          {!isManagerMode && (
            <div className="text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
                >
                  Register now
                </button>
              </p>
            </div>
          )}
        </form>
      )}


      {isRegistering && !isVerifyingOtp && (
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
              placeholder="Enter your Name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
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
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
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
          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Skills (comma-separated)
            </label>
            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
              placeholder="e.g., React, Node.js, Python"
            />
          </div>
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
              'Register as Staff'
            )}
          </button>
          <div className="text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleForm}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      )}


      {isVerifyingOtp && (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              OTP (sent to {email})
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 shadow-sm"
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-70 shadow-sm"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      )}
    </>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}