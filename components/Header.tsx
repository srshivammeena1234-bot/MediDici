
import React from 'react';
import { HeartPulseIcon, UserIcon } from './icons/Icons';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { View } from '../App';

interface HeaderProps {
    session: Session | null;
    setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ session, setCurrentView }) => {

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="text-brand-blue">
            <HeartPulseIcon />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            Medi<span className="text-brand-blue">Dici</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
            {session ? (
                <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <UserIcon />
                        <span>{session.user.email}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => setCurrentView('auth')}
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-blue-light transition-colors"
                >
                  Login / Sign Up
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
