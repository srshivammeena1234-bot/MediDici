
import React from 'react';
import { View } from '../App';
import { StethoscopeIcon, PillIcon, MapPinIcon, HeartPulseIcon, MessageSquareIcon, HelpCircleIcon } from './icons/Icons';

interface HomeProps {
  setActiveView: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveView }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome to MediDici</h2>
        <p className="text-gray-600 mt-2">Your one-stop solution for health and wellness, right at your fingertips.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FeatureCard
          title="Symptom Checker"
          description="Get AI-powered health guidance"
          icon={<MessageSquareIcon />}
          onClick={() => setActiveView('symptom-checker')}
          color="bg-purple-100 text-purple-600"
          highlight
        />
        <FeatureCard
          title="Order Medicines"
          description="Fast delivery from local pharmacies"
          icon={<PillIcon />}
          onClick={() => setActiveView('order')}
          color="bg-blue-100 text-brand-blue"
        />
        <FeatureCard
          title="Consult a Doctor"
          description="Video & chat with specialists"
          icon={<StethoscopeIcon />}
          onClick={() => setActiveView('consult')}
          color="bg-green-100 text-brand-green"
        />
        <FeatureCard
          title="Nearby Services"
          description="Find pharmacies & hospitals"
          icon={<MapPinIcon />}
          onClick={() => setActiveView('nearby')}
          color="bg-yellow-100 text-yellow-600"
        />
        <FeatureCard
          title="Health Tools"
          description="Track your vitals & records"
          icon={<HeartPulseIcon />}
          onClick={() => setActiveView('tools')}
          color="bg-red-100 text-red-600"
        />
         <FeatureCard
          title="Contact Us"
          description="Questions? Get in touch with us"
          icon={<HelpCircleIcon />}
          onClick={() => setActiveView('contact')}
          color="bg-indigo-100 text-indigo-600"
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  highlight?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick, color, highlight = false }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 text-left flex flex-col justify-between h-full ${highlight ? 'bg-brand-blue text-white' : 'bg-white'}`}
  >
    <div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${highlight ? 'bg-white text-brand-blue' : color }`}>
            {icon}
        </div>
        <h3 className={`mt-4 font-bold text-md ${highlight ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
    </div>
    <p className={`text-sm mt-1 ${highlight ? 'text-blue-200' : 'text-gray-500'}`}>{description}</p>
  </button>
);

export default Home;
