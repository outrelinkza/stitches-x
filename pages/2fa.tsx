import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

export default function TwoFactorAuth() {
  const [method, setMethod] = useState<'sms' | 'app'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSendCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would send SMS or generate TOTP
      // For now, we'll simulate the process
      setTimeout(() => {
        setCodeSent(true);
        setSuccess('Verification code sent!');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to send verification code');
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would verify the code
      // For now, we'll accept any 6-digit code
      if (verificationCode.length === 6) {
        setSuccess('2FA verified successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Please enter a valid 6-digit verification code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>StitchesX - Two-Factor Authentication</title>
        <meta name="description" content="Complete two-factor authentication" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          as="style"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;600;700;900&family=Noto+Sans:wght@400;500;600;700;900"
          onLoad={() => {}}
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center size-8 bg-black text-white rounded-lg">
                <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Stitches</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
            <p className="text-gray-600">
              Choose your preferred verification method
            </p>
          </div>

          {/* 2FA Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Method Selection */}
            <div className="mb-6">
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="method"
                    value="sms"
                    checked={method === 'sms'}
                    onChange={(e) => setMethod(e.target.value as 'sms')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">SMS Verification</div>
                    <div className="text-sm text-gray-500">Receive a code via text message</div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="method"
                    value="app"
                    checked={method === 'app'}
                    onChange={(e) => setMethod(e.target.value as 'app')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Authenticator App</div>
                    <div className="text-sm text-gray-500">Use Google Authenticator or similar</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Phone Number Input (for SMS) */}
            {method === 'sms' && !codeSent && (
              <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
                <button
                  onClick={handleSendCode}
                  disabled={isLoading || !phoneNumber}
                  className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            )}

            {/* Verification Code Input */}
            {codeSent && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the 6-digit code sent to your {method === 'sms' ? 'phone' : 'authenticator app'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>
            )}

            {/* Skip for now */}
            <div className="mt-6 text-center">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                Skip for now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
