import { useState } from 'react';
import Head from 'next/head';

export default function Test() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setCount(count + 1);
    setMessage(`Button clicked ${count + 1} times!`);
  };

  return (
    <>
      <Head>
        <title>Test Page - Stitches</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">React Test Page</h1>
          <p className="mb-4">Count: {count}</p>
          <p className="mb-4">Message: {message}</p>
          <button 
            onClick={handleClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Click Me
          </button>
        </div>
      </div>
    </>
  );
}
