import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - StitchesX</title>
        <meta name="description" content="Privacy Policy for StitchesX AI Invoice Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --primary-color: #137fec;
          }
          body {
            font-family: "Inter", sans-serif;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.6);
            -webkit-backdrop-filter: blur(12px);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50">
        <div className="flex flex-col h-full grow">
          <header className="sticky top-0 z-20 glass-effect border-b border-gray-200/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 bg-black text-white rounded-lg">
                  <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-xl font-semibold leading-tight">StitchesX</h2>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</Link>
                <Link href="/invoices" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Invoices</Link>
                <Link href="/clients" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Customers</Link>
                <Link href="/settings" className="text-gray-900 text-sm font-medium">Settings</Link>
              </nav>
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuBtV06ee4gPlI-hLtZdww17YnF8Vk7ntc3DP3lNAAJ5_r29yvac2v1w1yR-OlUGxfJDxFHwemReQE5mPFvDWPlMrc3R61fHJW3gte1bMaCBb_Juh2TJ5u4YqU89wmU03AFcT7wdW2qHN0V-apOpWfVyGw5Nrbh2rgiZVfqjrkfI0mqKTh7VYBA9aK9rCQKYDq0NA2uwV0dX1OteMyX9cLuEq8adU-UIfVRPB6ymvNFQpwlD25tjS0mKiEneNYUqlrYZ06s-3R24Y")'}}></div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
                  <p className="mt-4 text-lg text-gray-600">Last updated on September 9, 2025</p>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="h-[60vh] max-h-[800px] overflow-y-auto p-8 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm">
                    <div className="prose prose-base max-w-none text-gray-700">
                      <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
                      <p>
                        At StitchesX, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your information when you use our AI Invoice
                        Generator. We collect information such as your name, email address, and payment details to provide our services.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
                      <p>
                        We use this information to generate invoices, process payments, and communicate with you. We do not share your personal information with third parties except as necessary to provide our services or as required by law.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. Data Security</h2>
                      <p>
                        We implement security measures to protect your information from unauthorized access, use, or disclosure. This includes encryption of sensitive data, secure servers, and regular security audits.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Information Sharing</h2>
                      <p>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our website and conducting our business.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Cookies and Tracking</h2>
                      <p>
                        We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Your Rights</h2>
                      <p>
                        You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. To exercise these rights, please contact us at support@stitchesx.com.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Data Retention</h2>
                      <p>
                        We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When we no longer need your information, we will securely delete it.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Changes to This Policy</h2>
                      <p>
                        We may update this policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">9. Contact Us</h2>
                      <p>
                        By using our services, you agree to the terms of this Privacy Policy. For any questions or concerns, please contact us at support@stitchesx.com.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
