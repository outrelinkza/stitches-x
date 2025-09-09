import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function InvoiceBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard with premium builder open
    router.push('/dashboard?builder=premium');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to Dashboard - Stitches Invoice Generator</title>
        <meta name="description" content="Redirecting to the premium invoice builder in your dashboard." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    </>
  );
}










