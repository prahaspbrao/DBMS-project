'use client';

import { useRouter } from 'next/navigation';
import { FaSignInAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    toast.success('Redirecting to login...');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-800 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Welcome to College Lost & Found System
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Easily report and search for lost and found items within the campus.
        </p>
        <button
          onClick={handleLoginClick}
          className="inline-flex items-center bg-indigo-600 text-white text-lg font-semibold py-4 px-8 rounded-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
        >
          <FaSignInAlt className="mr-3 text-2xl" />
          Login
        </button>
      </div>
    </div>
  );
}
