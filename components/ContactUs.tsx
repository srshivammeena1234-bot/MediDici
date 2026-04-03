
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { HelpCircleIcon } from './icons/Icons';

interface ContactUsProps {
    session: Session | null;
}

const ContactUs: React.FC<ContactUsProps> = ({ session }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      // Prefill user data if logged in
      setEmail(session.user.email || '');
      // A simple way to get a name from email, can be improved if user profiles are added
      const nameFromEmail = session.user.email?.split('@')[0].replace(/[\._]/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
      setName(nameFromEmail || '');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const inquiryData = {
        name,
        email,
        subject,
        message,
        user_id: session?.user?.id || null,
      };

      const { error } = await supabase.from('inquiries').insert([inquiryData]);
      
      if (error) {
          throw new Error(error.message);
      }

      setSuccess('Your message has been sent successfully! We will get back to you shortly.');
      
      // Clear form fields that are not pre-filled
      if (!session) {
        setName('');
        setEmail('');
      }
      setSubject('');
      setMessage('');

    } catch (err: any) {
        setError('Failed to send your message. Please check your connection and try again. Ensure the "inquiries" table is created in Supabase.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in pb-16">
      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <HelpCircleIcon />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
            <p className="text-gray-500 mt-2">We'd love to hear from you. Please fill out the form below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={!!session}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!session}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue disabled:bg-gray-100"
                    placeholder="you@example.com"
                />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Question about my order"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="Please describe your issue or question in detail..."
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center p-2 bg-green-50 rounded-md">{success}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
