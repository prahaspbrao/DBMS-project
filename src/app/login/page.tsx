'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [usn, setUsn] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    if (!usn.trim() || !dob) {
      setError('Please enter both USN and Date of Birth');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn, dob }),
      });

      if (res.ok) {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error(err);
      toast.error('Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          College Lost & Found
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <label className="block mb-2 font-semibold text-gray-800">USN</label>
        <input
          type="text"
          placeholder="E.g. 4NI23CS167"
          value={usn}
          onChange={(e) => setUsn(e.target.value.toUpperCase())}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block mb-2 font-semibold text-gray-800">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Select your date of birth"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}
