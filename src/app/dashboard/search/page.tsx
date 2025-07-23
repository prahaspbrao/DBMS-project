'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'


export default function SearchItemsPage() {
  const [query, setQuery] = useState('')
  const [lostItems, setLostItems] = useState<any[]>([])
  const [foundItems, setFoundItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [showOtpModal, setShowOtpModal] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')
  const [currentItemId, setCurrentItemId] = useState<number | null>(null)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()

  const fetchItems = async (searchQuery = '') => {
    setLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      const normalizedLost = (data.lostItems || []).map((item: any) => ({
        ...item,
        usn: item.user?.usn || item.usn || 'N/A',
      }))
      const normalizedFound = (data.foundItems || []).map((item: any) => ({
        ...item,
        usn: item.user?.usn || item.usn || 'N/A',
      }))

      setLostItems(normalizedLost)
      setFoundItems(normalizedFound)
    } catch (error) {
      console.error(error)
      alert('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems('')
  }, [])

  const handleSearch = () => {
    fetchItems(query.trim())
  }

  const handleVerifyAndReturn = async (itemId: number) => {
    try {
      const sendRes = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      const sendData = await sendRes.json()
      if (!sendRes.ok) {
        alert(sendData.message || 'Failed to send OTP')
        return
      }

      const email = sendData.email
      setCurrentEmail(email)
      setCurrentItemId(itemId)
      setOtp(['', '', '', '', '', ''])
      setShowOtpModal(true)

      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err) {
      console.error('OTP sending error:', err)
      alert('Something went wrong during OTP sending.')
    }
  }

  const verifyOtp = async () => {
    if (otp.includes('')) {
      alert('Please enter all 6 digits of OTP.')
      return
    }

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: otp.join(''),
          email: currentEmail,
          itemId: currentItemId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('OTP Verified! Item returned successfully.')
        setShowOtpModal(false)
        fetchItems(query)
      } else {
        alert('Verification failed: ' + (data.message || 'Unknown error'))
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      alert('Something went wrong during OTP verification.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] to-[#243b55] text-white p-8 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-6xl mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#00c6ff] to-[#0072ff] bg-clip-text text-transparent">
          Search Lost & Found Items
        </h2>
        <div className="flex gap-4">
          <span className="bg-red-600 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md
                          hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 cursor-pointer">
            Lost: {lostItems.length}
          </span>
          <span className="bg-green-600 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md
                            hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 cursor-pointer">
            Found: {foundItems.length}
          </span>
        </div>
      </div>

      <div className="flex w-full max-w-3xl mb-10">
        <input
          type="text"
          placeholder="Search by description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          className="w-full px-4 py-3 rounded-l-lg bg-[#1e293b] text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          className="ml-3 px-6 py-3 rounded-r-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold cursor-pointer"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-lg text-gray-300">Loading items...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
          {/* LOST ITEMS */}
          <section className="flex-1 bg-[#2a2e45] rounded-xl p-6 shadow-xl border border-red-400/20 hover:border-red-400 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-300">Lost Items</h3>
            {lostItems.length === 0 ? (
              <p className="text-gray-400">No lost items found.</p>
            ) : (
              <ul className="space-y-4">
                {lostItems.map((item) => (
                  <li
                    key={item.id}
                    className="bg-[#353b5c] rounded-lg p-4 shadow-md border border-transparent hover:border-red-400 transition transform hover:scale-[1.02]"
                  >
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Location:</strong> {item.location || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> {item.usn}</p>
                    <p className="mt-2">
                      <strong>Status:</strong>{' '}
                      {item.isReturned ? (
                        <span className="text-green-400 font-semibold">Returned ✅</span>
                      ) : (
                        <span className="text-yellow-300 font-semibold">Pending ❌</span>
                      )}
                    </p>
                    {!item.isReturned && (
                      <button
                        onClick={() => handleVerifyAndReturn(item.id)}
                        className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
                      >
                        Verify & Return
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* FOUND ITEMS */}
          <section className="flex-1 bg-[#2a2e45] rounded-xl p-6 shadow-xl border border-green-400/20 hover:border-green-400 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-green-300">Found Items</h3>
            {foundItems.length === 0 ? (
              <p className="text-gray-400">No found items found.</p>
            ) : (
              <ul className="space-y-4">
                {foundItems.map((item) => (
                  <li
                    key={item.id}
                    className="bg-[#35415e] rounded-lg p-4 shadow-md border border-transparent hover:border-green-400 transition transform hover:scale-[1.02]"
                  >
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Location:</strong> {item.location || 'N/A'}</p>
                    <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> {item.usn}</p>
                    <p className="mt-2">
                      <strong>Status:</strong>{' '}
                      {item.isReturned ? (
                        <span className="text-green-400 font-semibold">Returned ✅</span>
                      ) : (
                        <span className="text-yellow-300 font-semibold">Pending ❌</span>
                      )}
                    </p>
                    {!item.isReturned && (
                      <button
                        onClick={() => handleVerifyAndReturn(item.id)}
                        className="cursor-pointer mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Verify & Get
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e2a3a] text-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <p className="mb-4 text-sm text-gray-300">Enter the OTP sent to <strong>{currentEmail}</strong></p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value
                    if (!/^\d?$/.test(val)) return
                    const newOtp = [...otp]
                    newOtp[idx] = val
                    setOtp(newOtp)
                    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                      inputRefs.current[idx - 1]?.focus()
                    }
                  }}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  className="w-10 h-12 text-2xl text-center rounded bg-[#32325d] focus:ring-2 ring-blue-400"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
