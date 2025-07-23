'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPlusCircle, FiAlertTriangle, FiLogOut } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth/session data here if needed

    // Redirect to login page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1e42] to-[#172b4d] text-[#f6f9fc] p-8 sm:p-12 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#f06595] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 cursor-pointer"
      >
        <FiLogOut className="text-lg" />
        Logout
      </button>

      <h1 className="text-4xl font-extrabold mb-2 text-[#5e72e4] drop-shadow-md">
        Welcome to the Dashboard
      </h1>
      <p className="text-[#a6b1e1] mb-10 max-w-xl">
        Manage your lost and found items efficiently. Report new items or search through existing reports.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Report Found */}
        <Link
          href="/dashboard/report-found"
          className="group bg-gradient-to-tr from-[#324cdd] to-[#5e72e4] rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <FiPlusCircle className="text-white text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-semibold mb-2">Report Found Item</h2>
            <p className="text-[#c1c9ff]">Submit details of items you've found.</p>
          </div>
          <button
            type="button"
            className="cursor-pointer mt-6 w-full py-3 rounded bg-white bg-opacity-20 text-black font-semibold hover:bg-blue-500 transition"
          >
            Go to Report Found
          </button>
        </Link>

        {/* Report Lost */}
        <Link
          href="/dashboard/report-lost"
          className="group bg-gradient-to-tr from-[#24b47e] to-[#2dce89] rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <FiAlertTriangle className="text-white text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-semibold mb-2">Report Lost Item</h2>
            <p className="text-[#c1ffe5]">Report items you've lost on campus.</p>
          </div>
          <button
            type="button"
            className="mt-6 w-full py-3 rounded bg-white bg-opacity-20 text-black font-semibold hover:bg-green-800 transition cursor-pointer"
          >
            Go to Report Lost
          </button>
        </Link>

        {/* Search Items */}
        <Link
          href="/dashboard/search"
          className="group bg-gradient-to-tr from-[#fa3a0e] to-[#fb6340] rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <FiSearch className="text-white text-4xl mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-semibold mb-2">Search Items</h2>
            <p className="text-[#ffc9b3]">Look up lost and found items.</p>
          </div>
          <button
            type="button"
            className="cursor-pointer mt-6 w-full py-3 rounded bg-white bg-opacity-20 text-black font-semibold hover:bg-orange-900 transition"
          >
            Go to Search
          </button>
        </Link>
      </div>
    </div>
  );
}
