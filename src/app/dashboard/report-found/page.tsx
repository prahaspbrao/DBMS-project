'use client';

import { useState } from 'react';

export default function ReportFound() {
  const [usn, setUsn] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usn.trim() || !name.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/report-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn: usn.toUpperCase(), name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to report found item');
      } else {
        setSuccess('Found item reported successfully!');
        setUsn('');
        setName('');
        setDescription('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-semibold text-white text-center">Report Found Item</h2>

        <input
          type="text"
          placeholder="Your USN"
          value={usn}
          onChange={(e) => setUsn(e.target.value.toUpperCase())}
          className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          autoComplete="off"
        />

        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          autoComplete="off"
        />

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={loading}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full py-3 text-white font-semibold rounded-lg transition-colors ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
