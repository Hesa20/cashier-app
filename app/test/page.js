"use client";
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log('Testing API fetch...');
        const response = await api.get('products');
        console.log('Response received:', response);
        console.log('Response.data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
        console.log('Response.data length:', response.data?.length);
        setData(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response?.data);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testFetch();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <p style={{ color: 'green' }}>Success! Received {data.length} products</p>
          <pre>{JSON.stringify(data.slice(0, 2), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
