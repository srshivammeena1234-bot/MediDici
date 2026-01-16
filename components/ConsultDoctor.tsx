
import React, { useState } from 'react';
import { Doctor } from '../types';
import { StethoscopeIcon } from './icons/Icons';

const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Anjali Sharma', specialty: 'Cardiologist', isAvailable: true, rating: 4.9 },
  { id: '2', name: 'Dr. Rohan Verma', specialty: 'Dermatologist', isAvailable: false, rating: 4.7 },
  { id: '3', name: 'Dr. Priya Singh', specialty: 'Pediatrician', isAvailable: true, rating: 4.8 },
  { id: '4', name: 'Dr. Sameer Khan', specialty: 'General Physician', isAvailable: true, rating: 4.6 },
];

const ConsultDoctor: React.FC = () => {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  const handleBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    alert(`Appointment with ${doctor.name} booked! A confirmation will be sent shortly.`);
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <h2 className="text-2xl font-bold text-gray-800">Consult a Doctor</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-md border flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="text-center sm:text-left">
          <h3 className="font-bold text-lg text-gray-800">Instant Consultation</h3>
          <p className="text-gray-600">Connect with a doctor in under 60 seconds.</p>
        </div>
        <div className="flex space-x-4">
            <button className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-light transition-colors">Start Video Call</button>
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Start Chat</button>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Book an Appointment</h3>
        <div className="space-y-4">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white p-4 rounded-xl shadow-md border transition-shadow hover:shadow-lg flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                  <img src={`https://picsum.photos/seed/${doctor.id}/100`} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-lg">{doctor.name}</p>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <div className="flex items-center mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 font-bold text-gray-700">{doctor.rating}</span>
                </div>
              </div>
              <button 
                onClick={() => handleBooking(doctor)}
                disabled={!doctor.isAvailable} 
                className={`px-4 py-2 rounded-lg font-semibold ${doctor.isAvailable ? 'bg-brand-green text-white hover:bg-opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {doctor.isAvailable ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>

       <div className="bg-white p-4 rounded-xl shadow-md border">
        <h3 className="font-semibold text-lg mb-2">My Digital Prescriptions</h3>
        <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
            <p>You have no digital prescriptions yet.</p>
            <p className="text-sm">They will appear here after your consultations.</p>
        </div>
      </div>

    </div>
  );
};

export default ConsultDoctor;
