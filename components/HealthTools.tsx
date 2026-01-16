
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HeartPulseIcon } from './icons/Icons';

const bpData = [
  { name: 'Jan', systolic: 120, diastolic: 80 },
  { name: 'Feb', systolic: 122, diastolic: 81 },
  { name: 'Mar', systolic: 118, diastolic: 79 },
  { name: 'Apr', systolic: 125, diastolic: 82 },
  { name: 'May', systolic: 123, diastolic: 80 },
];

const bmiData = [
    { name: 'Jan', bmi: 24.5 },
    { name: 'Feb', bmi: 24.2 },
    { name: 'Mar', bmi: 24.0 },
    { name: 'Apr', bmi: 23.8 },
    { name: 'May', bmi: 23.5 },
];


const HealthTools: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <h2 className="text-2xl font-bold text-gray-800">Health Tools & Records</h2>

      <div className="grid md:grid-cols-3 gap-4 text-center">
        <MetricCard title="Current BMI" value="23.5" unit="kg/m²" status="Normal" />
        <MetricCard title="Blood Sugar (F)" value="95" unit="mg/dL" status="Good" />
        <MetricCard title="Heart Rate" value="72" unit="bpm" status="Resting" />
      </div>
      
      <ChartCard title="Blood Pressure Trend">
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" />
            </LineChart>
        </ResponsiveContainer>
      </ChartCard>

       <ChartCard title="BMI Trend">
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bmi" name="BMI" stroke="#10b981" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
      </ChartCard>

       <div className="bg-white p-4 rounded-xl shadow-md border">
        <h3 className="font-semibold text-lg mb-2">Medicine Reminders</h3>
        <div className="space-y-2">
            <ReminderItem time="08:00 AM" medicine="Aspirin 75mg" note="After breakfast" />
            <ReminderItem time="09:00 PM" medicine="Paracetamol 500mg" note="Before sleep" />
        </div>
        <button className="mt-4 w-full bg-brand-blue text-white p-2 rounded-lg font-semibold hover:bg-brand-blue-light">
          + Add New Reminder
        </button>
      </div>

    </div>
  );
};

interface MetricCardProps {
    title: string;
    value: string;
    unit: string;
    status: string;
}
const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, status }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 my-1">{value}</p>
        <p className="text-sm text-gray-600">{unit}</p>
        <p className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block mt-2">{status}</p>
    </div>
);


interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}
const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border">
        <h3 className="font-semibold text-lg mb-4">{title}</h3>
        {children}
    </div>
);


interface ReminderItemProps {
    time: string;
    medicine: string;
    note: string;
}
const ReminderItem: React.FC<ReminderItemProps> = ({ time, medicine, note }) => (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div>
            <p className="font-bold">{time}</p>
            <p className="text-gray-700">{medicine}</p>
            <p className="text-xs text-gray-500">{note}</p>
        </div>
        {/* Basic toggle switch UI */}
        <div className="w-12 h-6 bg-green-400 rounded-full p-1 flex items-center cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6"></div>
        </div>
    </div>
);


export default HealthTools;
