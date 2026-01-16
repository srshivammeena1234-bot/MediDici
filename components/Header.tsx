
import React from 'react';
import { HeartPulseIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-brand-blue">
            <HeartPulseIcon />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            Medi<span className="text-brand-blue">Dici</span>
          </h1>
        </div>
        <button className="hidden md:inline-block bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-blue-light transition-colors">
          Login / Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
