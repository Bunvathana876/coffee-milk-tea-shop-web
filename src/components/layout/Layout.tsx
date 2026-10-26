import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 print:p-0 print:max-w-none">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

