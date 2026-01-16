
import React from 'react';
import useGeolocation from '../hooks/useGeolocation';
import { MapPinIcon } from './icons/Icons';

const NearbyServices: React.FC = () => {
  const { loading, error, data } = useGeolocation();

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-8 text-gray-600">Fetching your location...</div>;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
          <p className="font-semibold">Error getting location:</p>
          <p>{error.message}</p>
          <p className="mt-2 text-sm">Please ensure you have enabled location services for this site.</p>
        </div>
      );
    }

    if (data) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-md border text-center">
            <h3 className="font-semibold text-lg">Your Location</h3>
            <p className="text-gray-600 text-sm">
              Lat: {data.latitude.toFixed(4)}, Lon: {data.longitude.toFixed(4)}
            </p>
          </div>
          
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden relative">
            <img src={`https://picsum.photos/seed/map/800/400`} alt="Map placeholder" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                 <p className="text-white font-bold text-xl">Map View Placeholder</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Nearby Pharmacies</h3>
            <div className="space-y-2">
                <LocationCard name="Apollo Pharmacy" distance="0.5 km" isOpen={true} />
                <LocationCard name="Wellness Forever" distance="1.2 km" isOpen={true} />
                <LocationCard name="City Medical" distance="2.1 km" isOpen={false} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Hospitals & Ambulances</h3>
            <div className="space-y-2">
                <LocationCard name="City General Hospital" distance="3.5 km" isOpen={true} />
                <LocationCard name="St. John's Emergency" distance="4.2 km" isOpen={true} />
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  interface LocationCardProps {
    name: string;
    distance: string;
    isOpen: boolean;
  }

  const LocationCard: React.FC<LocationCardProps> = ({ name, distance, isOpen }) => (
      <div className="bg-white p-3 rounded-lg border flex items-center justify-between">
          <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-gray-500">{distance} away</p>
          </div>
          <span className={`text-sm font-bold px-2 py-1 rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isOpen ? 'Open' : 'Closed'}
          </span>
      </div>
  );


  return (
    <div className="animate-fade-in pb-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nearby Services</h2>
      {renderContent()}
    </div>
  );
};

export default NearbyServices;
