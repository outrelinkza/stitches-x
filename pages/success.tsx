import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Success() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (router.query.session_id) {
      setSessionId(router.query.session_id as string);
      verifyPayment(router.query.session_id as string);
    } else if (router.query.payment === 'mock' && router.query.invoice) {
      // Handle mock payment
      setPaymentSuccess(true);
      setIsVerifying(false);
      downloadMockInvoice(router.query.invoice as string);
    }
  }, [router.query]);

  const downloadMockInvoice = async (invoiceId: string) => {
    try {
      // Generate a mock invoice PDF
      const response = await fetch('/api/generate-invoice-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceType: 'product_sales',
          companyInfo: {
            name: 'Your Company',
            address: '123 Business St\nCity, State 12345',
            email: 'contact@yourcompany.com',
            phone: '(555) 123-4567'
          },
          clientInfo: {
            name: 'Client Company',
            address: '456 Client Ave\nClient City, State 67890',
            email: 'contact@client.com',
            phone: '(555) 987-6543'
          },
          invoiceDetails: {
            number: invoiceId,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          lineItems: [
            {
              description: 'Web Development Services',
              quantity: 1,
              rate: 1500,
              total: 1500
            }
          ],
          additionalOptions: {
            taxRate: 10,
            notes: 'Thank you for your business!'
          }
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const { success } = await response.json();
      
      if (success) {
        setPaymentSuccess(true);
        setIsVerifying(false);
      } else {
        setPaymentSuccess(false);
        setIsVerifying(false);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentSuccess(false);
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Payment Success - StitchesX</title>
        <meta name="description" content="Payment successful for your AI-generated invoice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 border border-white/30 shadow-lg text-center max-w-md w-full">
          {isVerifying ? (
            <div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
              <p className="text-gray-600">Please wait while we verify your payment.</p>
            </div>
          ) : paymentSuccess ? (
            <div>
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your invoice has been generated and is ready for download.</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Generate Another Invoice
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
              <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support if you were charged.</p>
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to Invoice Generator
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
