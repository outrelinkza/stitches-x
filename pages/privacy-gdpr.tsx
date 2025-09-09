import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyGDPR() {
  return (
    <>
      <Head>
        <title>Privacy Policy - StitchesX</title>
        <meta name="description" content="GDPR-Compliant Privacy Policy for StitchesX AI Invoice Generator" />
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
                          <strong>GDPR Compliance Notice:</strong> This Privacy Policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws. 
                          We are committed to protecting your privacy and ensuring transparency in how we handle your personal data.
                        </p>
                      </div>

                      <h2 className="text-2xl font-semibold text-gray-900">1. Data Controller Information</h2>
                      <p>
                        <strong>Company:</strong> StitchesX<br/>
                        <strong>Email:</strong> support@stitchesx.com<br/>
                        <strong>Website:</strong> stixches.vercel.app<br/>
                        <strong>Data Protection Officer:</strong> support@stitchesx.com
                      </p>
                      <p>
                        StitchesX is the data controller responsible for processing your personal data in accordance with this Privacy Policy and applicable data protection laws.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. Types of Personal Data We Collect</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.1 Account Information</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Name and email address (for account creation)</li>
                        <li>Password (encrypted and hashed)</li>
                        <li>Profile information (company name, phone, address)</li>
                        <li>Account preferences and settings</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.2 Invoice Data</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Company information (name, address, contact details)</li>
                        <li>Client information (name, address, email, phone)</li>
                        <li>Invoice details (numbers, dates, amounts, line items)</li>
                        <li>Payment information (processed securely through Stripe)</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.3 Usage Data</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>IP address and browser fingerprint (for anonymous tracking)</li>
                        <li>Download counts and usage patterns</li>
                        <li>Session data and user interactions</li>
                        <li>Device information and browser type</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.4 Payment Data</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Payment method information (processed by Stripe)</li>
                        <li>Transaction history and billing records</li>
                        <li>Subscription status and premium features usage</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. Legal Basis for Processing</h2>
                      <p>We process your personal data based on the following legal grounds under GDPR:</p>
                      <ul className="list-disc pl-6 mt-2">
                        <li><strong>Contract Performance (Article 6(1)(b)):</strong> To provide invoice generation services</li>
                        <li><strong>Legitimate Interest (Article 6(1)(f)):</strong> For security, fraud prevention, and service improvement</li>
                        <li><strong>Consent (Article 6(1)(a)):</strong> For marketing communications and non-essential cookies</li>
                        <li><strong>Legal Obligation (Article 6(1)(c)):</strong> For tax and accounting compliance</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. How We Use Your Data</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.1 Service Provision</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Generate and customize invoices</li>
                        <li>Process payments and manage subscriptions</li>
                        <li>Provide customer support</li>
                        <li>Maintain account security</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.2 Service Improvement</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Analyze usage patterns to improve features</li>
                        <li>Monitor system performance and security</li>
                        <li>Develop new features and services</li>
                        <li>Prevent fraud and abuse</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">5. Data Sharing and Third Parties</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">5.1 Service Providers</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li><strong>Supabase:</strong> Database and authentication services</li>
                        <li><strong>Stripe:</strong> Payment processing</li>
                        <li><strong>Vercel:</strong> Hosting and deployment</li>
                        <li><strong>Google Fonts:</strong> Typography services</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">5.2 Legal Requirements</h3>
                      <p>We may disclose your data when required by law, court order, or to protect our rights and safety.</p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Data Security Measures</h2>
                      <ul className="list-disc pl-6 mt-2">
                        <li>End-to-end encryption for sensitive data</li>
                        <li>Secure HTTPS connections</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and authentication</li>
                        <li>Data backup and recovery procedures</li>
                        <li>Staff training on data protection</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Your GDPR Rights</h2>
                      <p>Under GDPR, you have the following rights regarding your personal data:</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.1 Right of Access (Article 15)</h3>
                      <p>You can request a copy of all personal data we hold about you.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.2 Right to Rectification (Article 16)</h3>
                      <p>You can request correction of inaccurate or incomplete data.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.3 Right to Erasure (Article 17)</h3>
                      <p>You can request deletion of your personal data in certain circumstances.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.4 Right to Restrict Processing (Article 18)</h3>
                      <p>You can request limitation of how we process your data.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.5 Right to Data Portability (Article 20)</h3>
                      <p>You can request your data in a structured, machine-readable format.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.6 Right to Object (Article 21)</h3>
                      <p>You can object to processing based on legitimate interests or for marketing.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.7 Rights Related to Automated Decision Making (Article 22)</h3>
                      <p>You have rights regarding automated processing and profiling.</p>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                        <p className="text-yellow-800">
                          <strong>To exercise any of these rights:</strong> Contact us at support@stitchesx.com. 
                          We will respond within 30 days and may require identity verification.
                        </p>
                      </div>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Data Retention</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.1 Retention Periods</h3>
                      <ul className="list-disc pl-6 mt-2">
                        <li><strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
                        <li><strong>Invoice Data:</strong> 7 years (for tax compliance)</li>
                        <li><strong>Payment Records:</strong> 7 years (for accounting compliance)</li>
                        <li><strong>Usage Analytics:</strong> 2 years (anonymized after 1 year)</li>
                        <li><strong>Support Communications:</strong> 3 years</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.2 Data Deletion</h3>
                      <p>When data is no longer needed, we securely delete it using industry-standard methods.</p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">9. International Data Transfers</h2>
                      <p>
                        Your data may be transferred to and processed in countries outside the EEA. We ensure adequate protection through:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Standard Contractual Clauses (SCCs)</li>
                        <li>Adequacy decisions by the European Commission</li>
                        <li>Appropriate safeguards and security measures</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">10. Cookies and Tracking</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">10.1 Essential Cookies</h3>
                      <p>Required for basic website functionality and security.</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">10.2 Analytics Cookies</h3>
                      <p>Help us understand how you use our website (with your consent).</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">10.3 Marketing Cookies</h3>
                      <p>Used for personalized advertising (with your consent).</p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">11. Children's Privacy</h2>
                      <p>
                        Our service is not intended for children under 16. We do not knowingly collect personal data from children under 16. 
                        If we become aware of such collection, we will delete the data immediately.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">12. Data Breach Notification</h2>
                      <p>
                        In the event of a data breach that poses a risk to your rights and freedoms, we will:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Notify the relevant supervisory authority within 72 hours</li>
                        <li>Inform affected individuals without undue delay</li>
                        <li>Provide details of the breach and mitigation measures</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">13. Changes to This Policy</h2>
                      <p>
                        We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice. 
                        Continued use of our services constitutes acceptance of the updated policy.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">14. Supervisory Authority</h2>
                      <p>
                        You have the right to lodge a complaint with your local data protection supervisory authority if you believe we have violated your data protection rights.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">15. Contact Information</h2>
                      <p>
                        For any questions about this Privacy Policy or to exercise your rights, contact us:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li><strong>Email:</strong> support@stitchesx.com</li>
                        <li><strong>Subject Line:</strong> "GDPR Request" for data protection inquiries</li>
                        <li><strong>Response Time:</strong> Within 30 days</li>
                      </ul>
                      
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
                        <p className="text-green-800">
                          <strong>This Privacy Policy is effective as of September 9, 2025.</strong> 
                          By using StitchesX, you acknowledge that you have read, understood, and agree to this Privacy Policy.
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

