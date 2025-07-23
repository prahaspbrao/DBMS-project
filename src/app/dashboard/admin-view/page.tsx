'use client';

import { useEffect, useState } from 'react';

export default function AdminViewPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/items/all');
      const data = await res.json();
      setItems(data.items);
    };
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Reported Items</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border p-4 rounded shadow bg-white">
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>USN:</strong> {item.usn}</p>
            <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {item.isReturned ? '✅ Returned' : '❌ Not Returned'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
