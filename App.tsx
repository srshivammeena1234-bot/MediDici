
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import OrderMedicine from './components/OrderMedicine';
import ConsultDoctor from './components/ConsultDoctor';
import NearbyServices from './components/NearbyServices';
import HealthTools from './components/HealthTools';
import SymptomChecker from './components/SymptomChecker';
import Auth from './components/Auth';
import ContactUs from './components/ContactUs';
import { StethoscopeIcon, PillIcon, MapPinIcon, HeartPulseIcon, MessageSquareIcon, HomeIcon } from './components/icons/Icons';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

export type View = 'home' | 'order' | 'consult' | 'nearby' | 'tools' | 'symptom-checker' | 'auth' | 'contact';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        setCurrentView('home');
      }
      if (_event === 'SIGNED_OUT') {
        setCurrentView('home');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const renderView = () => {
    switch (currentView) {
      case 'order':
        return <OrderMedicine />;
      case 'consult':
        return <ConsultDoctor />;
      case 'nearby':
        return <NearbyServices />;
      case 'tools':
        return <HealthTools />;
      case 'symptom-checker':
        return <SymptomChecker />;
      case 'auth':
        return <Auth />;
      case 'contact':
        return <ContactUs session={session} />;
      case 'home':
      default:
        return <Home setActiveView={setCurrentView} />;
    }
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-brand-background">
              <div className="text-brand-blue animate-pulse">
                  <HeartPulseIcon />
              </div>
          </div>
      )
  }

  return (
    <div className="bg-brand-background min-h-screen font-sans text-gray-800 flex flex-col">
      <Header session={session} setCurrentView={setCurrentView} />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {renderView()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-lg border-t border-gray-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <NavItem icon={<HomeIcon />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
          <NavItem icon={<PillIcon />} label="Order" active={currentView === 'order'} onClick={() => setCurrentView('order')} />
          <NavItem icon={<StethoscopeIcon />} label="Consult" active={currentView === 'consult'} onClick={() => setCurrentView('consult')} />
          <NavItem icon={<MessageSquareIcon />} label="AI" active={currentView === 'symptom-checker'} onClick={() => setCurrentView('symptom-checker')} />
          <NavItem icon={<MapPinIcon />} label="Nearby" active={currentView === 'nearby'} onClick={() => setCurrentView('nearby')} />
        </div>
      </nav>
       <footer className="hidden md:block bg-white border-t mt-auto p-4 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center space-x-4">
            <p>&copy; 2024 MediDici. All rights reserved.</p>
            <button onClick={() => setCurrentView('contact')} className="hover:text-brand-blue hover:underline">Contact Us</button>
            <p>For informational purposes only. Consult a doctor for medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 text-sm transition-colors duration-200 ${active ? 'text-brand-blue' : 'text-gray-500 hover:text-brand-blue'}`}
  >
    <div className="w-6 h-6">{icon}</div>
    <span>{label}</span>
  </button>
);


export default App;
