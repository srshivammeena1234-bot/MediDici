
import React, { useState } from 'react';
import { PillIcon, UploadIcon, VerifiedIcon } from './icons/Icons';
import { Medicine } from '../types';
import { getMedicineSubstitutes } from '../services/geminiService';

const mockMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', price: 20, salt: 'Paracetamol', isAvailable: true },
  { id: '2', name: 'Aspirin 75mg', price: 15, salt: 'Aspirin', isAvailable: true },
  { id: '3', name: 'Cetirizine 10mg', price: 35, salt: 'Cetirizine', isAvailable: false },
  { id: '4', name: 'Amoxicillin 250mg', price: 80, salt: 'Amoxicillin', isAvailable: true },
];

interface Substitute {
    name: string;
    salt: string;
    price: number;
    reason: string;
}

const OrderMedicine: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>(mockMedicines);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFindingSubstitutes, setIsFindingSubstitutes] = useState<string | null>(null);
  const [substitutes, setSubstitutes] = useState<Substitute[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = mockMedicines.filter(med =>
        med.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockMedicines);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFindSubstitutes = async (medicine: Medicine) => {
    setIsFindingSubstitutes(medicine.id);
    setError('');
    setSubstitutes([]);
    try {
        const resultJson = await getMedicineSubstitutes(medicine.name, medicine.salt);
        const result = JSON.parse(resultJson);
        if (result.error) {
            setError(result.error);
        } else {
            setSubstitutes(result.substitutes || []);
        }
    } catch(e) {
        setError('Failed to parse substitute data. Please try again.');
    } finally {
        setIsFindingSubstitutes(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <h2 className="text-2xl font-bold text-gray-800">Order Medicines</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-md border">
        <h3 className="font-semibold mb-2">Upload Prescription</h3>
        <div className="flex items-center space-x-4">
          <label htmlFor="prescription-upload" className="flex-1 cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-200 transition">
            <div className="flex flex-col items-center justify-center">
              <UploadIcon />
              <span className="mt-2 text-sm text-gray-600">{selectedFile ? selectedFile.name : 'Tap to upload'}</span>
            </div>
            <input id="prescription-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
          </label>
          <button className="bg-brand-green text-white px-6 py-4 rounded-lg font-semibold self-stretch hover:bg-opacity-90">
            Order Now
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Get your medicines delivered in 30-60 minutes.</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search for medicines..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 pl-10 border rounded-lg focus:ring-2 focus:ring-brand-blue"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <PillIcon />
        </div>
      </div>

      <div className="space-y-4">
        {searchResults.map(med => (
          <div key={med.id} className="bg-white p-4 rounded-xl shadow-md border transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{med.name}</p>
                <p className="text-sm text-gray-500">Contains: {med.salt}</p>
                <p className="font-semibold text-brand-green mt-1">₹{med.price.toFixed(2)}</p>
              </div>
              <button className={`px-4 py-2 rounded-lg font-semibold ${med.isAvailable ? 'bg-brand-blue text-white hover:bg-brand-blue-light' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}>
                {med.isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => handleFindSubstitutes(med)}
                disabled={isFindingSubstitutes === med.id}
                className="w-full text-sm font-semibold text-brand-blue hover:underline disabled:opacity-50 disabled:cursor-wait"
              >
                {isFindingSubstitutes === med.id ? 'Finding Substitutes...' : 'Find Cheaper Substitutes (AI)'}
              </button>
              {isFindingSubstitutes === med.id && <div className="text-center p-2 text-gray-500">AI is working its magic...</div>}
              {error && <div className="text-center p-2 text-red-500">{error}</div>}
              {substitutes.length > 0 && (
                <div className="mt-2 space-y-2 bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm">AI Suggestions:</h4>
                    {substitutes.map((sub, index) => (
                        <div key={index} className="text-sm border-b last:border-b-0 pb-1">
                            <p className="font-bold">{sub.name} - <span className="text-brand-green font-semibold">₹{sub.price.toFixed(2)}</span></p>
                            <p className="text-gray-600">{sub.reason}</p>
                        </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-2 p-4 text-brand-green">
        <VerifiedIcon />
        <span className="font-semibold">All pharmacies are 100% verified & genuine.</span>
      </div>
    </div>
  );
};

export default OrderMedicine;
