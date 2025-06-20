"use client";

import React from 'react';
import { LoadingSpinner, LoadingContainer } from '@/components/ui/loading-spinner';
import Navbar from '@/components/Navbar';

interface LoadingPageProps {
  message?: string;
  showNavbar?: boolean;
}

export default function LoadingPage({ message = 'Loading...', showNavbar = false }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex-1 flex items-center justify-center">
        <LoadingContainer className="p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-200">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-lg font-medium text-gray-700">{message}</p>
          <div className="mt-2 text-sm text-indigo-600">Please wait while we prepare your content</div>
        </LoadingContainer>
      </div>
    </div>
  );
}
