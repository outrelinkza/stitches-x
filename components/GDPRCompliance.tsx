import React, { useState, useEffect } from 'react';

interface GDPRComplianceProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function GDPRCompliance({ onAccept, onDecline }: GDPRComplianceProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('gdpr-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted');
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('gdpr-consent', 'declined');
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
    onDecline?.();
  };

  const handleManagePreferences = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                We use essential cookies for security and functionality, and optional analytics cookies to improve our service. 
                By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleManagePreferences}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Manage Preferences
                </button>
                <span className="text-gray-400">•</span>
                <a href="/privacy" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Privacy Policy
                </a>
                <span className="text-gray-400">•</span>
                <a href="/terms" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Terms of Service
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Cookie Preferences Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Your Privacy Matters:</strong> You can customize your cookie preferences below. 
                  Essential cookies are required for the website to function properly and cannot be disabled.
                </p>
              </div>

              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                    <p className="text-sm text-gray-600">Required for StitchesX to function properly</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Always Active
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>What we use:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Authentication cookies:</strong> Remember your login status and session</li>
                    <li><strong>Security cookies:</strong> Protect against CSRF attacks and maintain security</li>
                    <li><strong>GDPR consent:</strong> Remember your cookie preferences</li>
                    <li><strong>Anonymous tracking:</strong> Prevent abuse of free downloads (IP-based)</li>
                    <li><strong>Form data:</strong> Temporarily store invoice data while creating</li>
                    <li><strong>Payment processing:</strong> Secure Stripe payment session cookies</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    These cookies are necessary for invoice generation, payment processing, and account security. 
                    Without them, StitchesX cannot function properly.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics & Performance</h3>
                    <p className="text-sm text-gray-600">Help us improve StitchesX features</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>What we track:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Usage patterns:</strong> Which features are used most (anonymized)</li>
                    <li><strong>Performance metrics:</strong> Page load times and error rates</li>
                    <li><strong>Feature adoption:</strong> How users interact with invoice templates</li>
                    <li><strong>Conversion tracking:</strong> Free to premium upgrade rates</li>
                    <li><strong>Error monitoring:</strong> Technical issues and bugs (no personal data)</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    All analytics data is anonymized and aggregated. We use this to improve invoice templates, 
                    fix bugs, and enhance user experience.
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Marketing & Personalization</h3>
                    <p className="text-sm text-gray-600">Customize your StitchesX experience</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>What we use for:</strong></p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Personalized recommendations:</strong> Suggest relevant invoice templates</li>
                    <li><strong>Feature announcements:</strong> Show new features you might like</li>
                    <li><strong>Usage reminders:</strong> Helpful tips based on your activity</li>
                    <li><strong>Retargeting:</strong> Show StitchesX ads on other websites (if you visit)</li>
                    <li><strong>A/B testing:</strong> Test different designs to improve usability</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    These cookies help us provide a more personalized experience and show relevant content. 
                    You can opt out anytime without affecting core functionality.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDecline}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Save Essential Only
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save All Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// GDPR Rights Component
export function GDPRRights() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your GDPR Rights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right of Access</h4>
              <p className="text-sm text-gray-600">Request a copy of your personal data</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right to Rectification</h4>
              <p className="text-sm text-gray-600">Correct inaccurate personal data</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right to Erasure</h4>
              <p className="text-sm text-gray-600">Request deletion of your data</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right to Portability</h4>
              <p className="text-sm text-gray-600">Export your data in a portable format</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right to Object</h4>
              <p className="text-sm text-gray-600">Object to certain data processing</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h4 className="font-medium text-gray-900">Right to Restrict</h4>
              <p className="text-sm text-gray-600">Limit how we process your data</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>To exercise your rights:</strong> Contact us at support@stitchesx.com with "GDPR Request" in the subject line. 
          We will respond within 30 days.
        </p>
      </div>
    </div>
  );
}
