"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        router.push('/');
      }
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/');
    }
  }, [router]);

  return children;
}