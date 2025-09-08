import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Cancel() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Payment Cancelled - Stitches</title>
        <meta name="description" content="Payment was cancelled for your AI-generated invoice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 border border-white/30 shadow-lg text-center max-w-md w-full">
          <div className="text-orange-500 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">Your payment was cancelled. You can try again anytime or generate a free invoice.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Invoice Generator
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Generate Free Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
