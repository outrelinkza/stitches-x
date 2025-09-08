import { useState } from 'react';
import Head from 'next/head';
import NotificationModal from '../components/NotificationModal';

export default function NotificationsDemo() {
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const showSuccessNotification = () => {
    setSuccessModal(true);
  };

  const showErrorNotification = () => {
    setErrorModal(true);
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    // In a real app, you might redirect to dashboard or invoices page
    console.log('Success notification closed');
  };

  const handleErrorClose = () => {
    setErrorModal(false);
    // In a real app, you might redirect to payment page or show retry options
    console.log('Error notification closed');
  };

  return (
    <>
      <Head>
        <title>Notification Demo - Stitches</title>
        <meta name="description" content="Demo of success and error notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --success-color: #16a34a;
            --error-color: #dc2626;
          }
          .success-accent {
            --accent-color: var(--success-color);
          }
          .error-accent {
            --accent-color: var(--error-color);
          }
        `}</style>
      </Head>
      
      <div className="min-h-screen bg-gray-100/50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Notification Components Demo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Success Notification</h2>
              <p className="text-gray-600 mb-6">
                This notification appears when an action is completed successfully, 
                such as generating an invoice or processing a payment.
              </p>
              <button
                onClick={showSuccessNotification}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Show Success Notification
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Notification</h2>
              <p className="text-gray-600 mb-6">
                This notification appears when an action fails, such as payment 
                processing errors or validation failures.
              </p>
              <button
                onClick={showErrorNotification}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Show Error Notification
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Examples</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-medium text-gray-900">Success Scenarios:</h3>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• Invoice generated successfully</li>
                  <li>• Payment processed successfully</li>
                  <li>• Profile updated successfully</li>
                  <li>• Email sent successfully</li>
                </ul>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-medium text-gray-900">Error Scenarios:</h3>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• Payment processing failed</li>
                  <li>• Invoice generation failed</li>
                  <li>• Network connection error</li>
                  <li>• Validation errors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Modal */}
      <NotificationModal
        isOpen={successModal}
        onClose={handleSuccessClose}
        type="success"
        title="Action Successful"
        message="Your invoice has been successfully generated."
        buttonText="OK"
        onButtonClick={handleSuccessClose}
      />

      {/* Error Notification Modal */}
      <NotificationModal
        isOpen={errorModal}
        onClose={handleErrorClose}
        type="error"
        title="Payment Failed"
        message="We couldn't process your payment. Please try again."
        buttonText="Dismiss"
        onButtonClick={handleErrorClose}
      />
    </>
  );
}
