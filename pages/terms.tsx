import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - StitchesX</title>
        <meta name="description" content="Terms of Service for StitchesX AI Invoice Generator" />
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
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
                  <p className="mt-4 text-lg text-gray-600">Last updated on October 26, 2023</p>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="h-[60vh] max-h-[800px] overflow-y-auto p-8 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm">
                    <div className="prose prose-base max-w-none text-gray-700">
                      <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                      <p>
                        These Terms of Service govern your use of the StitchesX AI Invoice Generator. By using our services, you agree to these terms. You are responsible for maintaining the
                        confidentiality of your account and password. You agree not to use our services for any unlawful or prohibited purpose.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. Service Description</h2>
                      <p>
                        StitchesX provides an AI-powered invoice generation service that allows users to create professional invoices using artificial intelligence technology. Our service includes
                        invoice templates, automated calculations, and PDF generation capabilities.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. User Responsibilities</h2>
                      <p>
                        You are responsible for maintaining the confidentiality of your account and password. You agree not to use our services for any unlawful or prohibited purpose. You must not,
                        in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Prohibited Uses</h2>
                      <p>
                        You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                        Violation of any of these agreements will result in the termination of your StitchesX Account.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Service Availability</h2>
                      <p>
                        We reserve the right to terminate or suspend your access to our services at any time, with or without cause. Our services are provided 'as is' without any warranties, express or implied.
                        We are not liable for any damages arising from your use of our services.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Limitation of Liability</h2>
                      <p>
                        While StitchesX prohibits such conduct and content on the Service, you understand and agree that StitchesX cannot be responsible for the Content posted on the Service and you nonetheless may be exposed to such materials. 
                        You agree to use the Service at your own risk.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Governing Law</h2>
                      <p>
                        These terms are governed by the laws of the state of California. Any disputes arising from these terms will be resolved through arbitration. By using our services, you acknowledge that you have read, understood, and agree to these Terms of Service.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Contact Information</h2>
                      <p>
                        For any questions or concerns regarding these Terms of Service, please contact us at support@stitchesx.com.
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
