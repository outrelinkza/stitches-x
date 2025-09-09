import Head from 'next/head';
import Link from 'next/link';

export default function TermsGDPR() {
  return (
    <>
      <Head>
        <title>Terms of Service - StitchesX</title>
        <meta name="description" content="GDPR-Compliant Terms of Service for StitchesX AI Invoice Generator" />
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
                  <p className="mt-4 text-lg text-gray-600">Last updated on September 9, 2025</p>
                  <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    GDPR Compliant
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="h-[70vh] max-h-[900px] overflow-y-auto p-8 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm">
                    <div className="prose prose-base max-w-none text-gray-700">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                        <p className="text-blue-800 font-medium">
                          <strong>Legal Notice:</strong> These Terms of Service govern your use of StitchesX and comply with applicable laws including GDPR. 
                          By using our services, you agree to be bound by these terms.
                        </p>
                      </div>

                      <h2 className="text-2xl font-semibold text-gray-900">1. Agreement to Terms</h2>
                      <p>
                        By accessing or using StitchesX ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                        If you disagree with any part of these terms, you may not access the Service.
                      </p>
                      <p>
                        These Terms constitute a legally binding agreement between you and StitchesX. We reserve the right to modify these Terms at any time, 
                        and your continued use of the Service constitutes acceptance of any changes.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. Service Description</h2>
                      <p>
                        StitchesX is an AI-powered invoice generation platform that provides:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Professional invoice creation and customization</li>
                        <li>PDF generation and download capabilities</li>
                        <li>Client and company information management</li>
                        <li>Payment processing integration</li>
                        <li>Template and branding customization</li>
                        <li>Invoice history and management</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. User Accounts and Registration</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">3.1 Account Creation</h3>
                      <p>
                        To access certain features, you must create an account. You agree to:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and update your information</li>
                        <li>Keep your password secure and confidential</li>
                        <li>Accept responsibility for all activities under your account</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">3.2 Account Security</h3>
                      <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
                        You must notify us immediately of any unauthorized use of your account.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Acceptable Use Policy</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.1 Permitted Uses</h3>
                      <p>You may use the Service for lawful business purposes, including:</p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Creating professional invoices for legitimate business transactions</li>
                        <li>Managing client and company information</li>
                        <li>Processing payments for goods and services</li>
                        <li>Maintaining business records and documentation</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.2 Prohibited Uses</h3>
                      <p>You agree not to use the Service for:</p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Any unlawful or fraudulent activities</li>
                        <li>Creating false or misleading invoices</li>
                        <li>Violating any applicable laws or regulations</li>
                        <li>Infringing on intellectual property rights</li>
                        <li>Transmitting malicious code or harmful content</li>
                        <li>Attempting to gain unauthorized access to our systems</li>
                        <li>Interfering with the proper functioning of the Service</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Data Protection and Privacy</h2>
                      <p>
                        Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
                        which complies with GDPR and other applicable data protection laws.
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>We implement appropriate security measures to protect your data</li>
                        <li>You have rights regarding your personal data under GDPR</li>
                        <li>We do not sell your personal information to third parties</li>
                        <li>Data is processed lawfully, fairly, and transparently</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Intellectual Property Rights</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.1 Our Intellectual Property</h3>
                      <p>
                        The Service and its original content, features, and functionality are owned by StitchesX and are protected by international 
                        copyright, trademark, patent, trade secret, and other intellectual property laws.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.2 Your Content</h3>
                      <p>
                        You retain ownership of all content you upload or create using the Service. By using the Service, you grant us a limited, 
                        non-exclusive license to process, store, and display your content as necessary to provide the Service.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Payment Terms</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.1 Free Tier</h3>
                      <p>
                        We offer a free tier with limited features:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Anonymous users: 1 free invoice download</li>
                        <li>Registered users: 2 free invoice downloads</li>
                        <li>Basic templates and features</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.2 Premium Subscription</h3>
                      <p>
                        Premium features are available for a one-time payment of $9.99, which includes:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Unlimited invoice downloads</li>
                        <li>Premium templates and customization</li>
                        <li>Advanced branding options</li>
                        <li>Priority customer support</li>
                        <li>Invoice history and management</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.3 Payment Processing</h3>
                      <p>
                        Payments are processed securely through Stripe. All payment information is handled according to PCI DSS standards. 
                        We do not store your payment card information on our servers.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Service Availability and Modifications</h2>
                      <p>
                        We strive to maintain high service availability but cannot guarantee uninterrupted access. We reserve the right to:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Modify or discontinue the Service with reasonable notice</li>
                        <li>Perform maintenance and updates</li>
                        <li>Implement security measures</li>
                        <li>Suspend accounts for violations of these Terms</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">9. Limitation of Liability</h2>
                      <p>
                        To the maximum extent permitted by law, StitchesX shall not be liable for any indirect, incidental, special, consequential, 
                        or punitive damages, including but not limited to loss of profits, data, or business opportunities.
                      </p>
                      <p>
                        Our total liability to you for any claims arising from or related to the Service shall not exceed the amount you paid us 
                        for the Service in the 12 months preceding the claim.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">10. Indemnification</h2>
                      <p>
                        You agree to indemnify and hold harmless StitchesX from any claims, damages, or expenses arising from:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Your use of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any third-party rights</li>
                        <li>Any content you submit or transmit through the Service</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">11. Termination</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">11.1 Termination by You</h3>
                      <p>
                        You may terminate your account at any time by contacting us at support@stitchesx.com. 
                        Upon termination, your right to use the Service will cease immediately.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">11.2 Termination by Us</h3>
                      <p>
                        We may terminate or suspend your account immediately, without prior notice, for any reason, including:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Violation of these Terms</li>
                        <li>Fraudulent or illegal activity</li>
                        <li>Non-payment of fees</li>
                        <li>Extended periods of inactivity</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">12. Dispute Resolution</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">12.1 Governing Law</h3>
                      <p>
                        These Terms shall be governed by and construed in accordance with the laws of the United States, 
                        without regard to conflict of law principles.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">12.2 Dispute Resolution Process</h3>
                      <p>
                        Any disputes arising from these Terms or your use of the Service shall be resolved through:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Good faith negotiations</li>
                        <li>Mediation if negotiations fail</li>
                        <li>Binding arbitration as a last resort</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">13. Force Majeure</h2>
                      <p>
                        We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, 
                        including but not limited to acts of God, natural disasters, war, terrorism, or government actions.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">14. Severability</h2>
                      <p>
                        If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall remain in full force and effect.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">15. Entire Agreement</h2>
                      <p>
                        These Terms, together with our Privacy Policy, constitute the entire agreement between you and StitchesX regarding the Service.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">16. Contact Information</h2>
                      <p>
                        For questions about these Terms of Service, please contact us:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li><strong>Email:</strong> support@stitchesx.com</li>
                        <li><strong>Website:</strong> stixches.vercel.app</li>
                        <li><strong>Response Time:</strong> Within 48 hours</li>
                      </ul>
                      
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
                        <p className="text-green-800">
                          <strong>These Terms of Service are effective as of September 9, 2025.</strong> 
                          By using StitchesX, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                        </p>
                      </div>
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
