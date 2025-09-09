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
                      <p>
                        We work with trusted third-party service providers to deliver our Service. These providers are carefully selected 
                        and bound by strict data protection agreements. Here's how we share data with each provider:
                      </p>
                      
                      <div className="space-y-4 mt-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Supabase (Database & Authentication)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Data Shared:</strong> User account information, profile data, invoice data, authentication tokens
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Purpose:</strong> Secure data storage, user authentication, and database management
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> European Union (GDPR compliant)
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Stripe (Payment Processing)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Data Shared:</strong> Payment information, billing details, transaction amounts, customer email
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Purpose:</strong> Secure payment processing, fraud prevention, and transaction management
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> United States (PCI DSS compliant, SOC 2 certified)
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Vercel (Hosting & Deployment)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Data Shared:</strong> Website usage data, performance metrics, error logs (anonymized)
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Purpose:</strong> Website hosting, performance optimization, and technical support
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> Global CDN (GDPR compliant)
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Google Fonts (Typography Services)</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Data Shared:</strong> IP address, browser information (for font loading)
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Purpose:</strong> Display custom typography and improve website appearance
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Location:</strong> Global (Google's privacy policy applies)
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">5.2 Legal Requirements and Compliance</h3>
                      <p>
                        We may disclose your personal data in the following limited circumstances:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Legal Obligations:</strong> When required by law, regulation, or legal process (e.g., court orders, subpoenas)</li>
                        <li><strong>Tax Compliance:</strong> To comply with tax authorities and financial reporting requirements</li>
                        <li><strong>Fraud Prevention:</strong> To prevent, detect, or investigate fraud, security breaches, or illegal activities</li>
                        <li><strong>Safety Protection:</strong> To protect the rights, property, or safety of StitchesX, our users, or the public</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with user notification)</li>
                        <li><strong>Consent:</strong> When you have explicitly consented to the disclosure</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">5.3 Data Sharing Restrictions</h3>
                      <p>
                        <strong>We never sell, rent, or trade your personal information to third parties for marketing purposes.</strong> 
                        We do not share your data with advertisers, data brokers, or other companies for their commercial use.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">6. Data Security Measures</h2>
                      <p>
                        We implement comprehensive security measures to protect your personal data against unauthorized access, 
                        alteration, disclosure, or destruction. Our security approach includes multiple layers of protection:
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.1 Technical Security Measures</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Encryption:</strong> All sensitive data is encrypted using AES-256 encryption both in transit (TLS 1.3) and at rest</li>
                        <li><strong>Secure Connections:</strong> All communications use HTTPS with strong SSL/TLS certificates</li>
                        <li><strong>Database Security:</strong> Database access is restricted with role-based permissions and encrypted connections</li>
                        <li><strong>API Security:</strong> All API endpoints are protected with authentication, rate limiting, and input validation</li>
                        <li><strong>Infrastructure Security:</strong> Our servers are hosted on enterprise-grade cloud infrastructure with built-in security features</li>
                        <li><strong>Network Security:</strong> Firewalls, intrusion detection systems, and network segmentation protect our infrastructure</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.2 Access Control and Authentication</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Multi-Factor Authentication:</strong> Administrative access requires multi-factor authentication</li>
                        <li><strong>Role-Based Access:</strong> Staff access is limited based on job requirements and principle of least privilege</li>
                        <li><strong>Session Management:</strong> User sessions are securely managed with automatic timeout and secure session tokens</li>
                        <li><strong>Password Security:</strong> Strong password requirements and secure password hashing (bcrypt)</li>
                        <li><strong>Access Logging:</strong> All access to personal data is logged and monitored for suspicious activity</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.3 Operational Security</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and vulnerability scans</li>
                        <li><strong>Security Updates:</strong> All systems are kept up-to-date with the latest security patches</li>
                        <li><strong>Incident Response:</strong> We have established procedures for responding to security incidents</li>
                        <li><strong>Data Backup:</strong> Regular encrypted backups ensure data availability and recovery</li>
                        <li><strong>Staff Training:</strong> All team members receive regular training on data protection and security best practices</li>
                        <li><strong>Vendor Security:</strong> We ensure all third-party vendors meet our security standards</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">6.4 Physical Security</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Data Center Security:</strong> Our cloud providers maintain physical security at their data centers</li>
                        <li><strong>Equipment Security:</strong> All devices used to access personal data are secured and encrypted</li>
                        <li><strong>Secure Disposal:</strong> When data is no longer needed, it is securely deleted using industry-standard methods</li>
                      </ul>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">7. Your GDPR Rights</h2>
                      <p>
                        Under the General Data Protection Regulation (GDPR), you have comprehensive rights regarding your personal data. 
                        These rights give you control over how your information is collected, processed, and used.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.1 Right of Access (Article 15)</h3>
                      <p>
                        You have the right to obtain confirmation as to whether or not personal data concerning you is being processed, 
                        and, where that is the case, access to the personal data and the following information:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The purposes of the processing</li>
                        <li>The categories of personal data concerned</li>
                        <li>The recipients or categories of recipients to whom the personal data have been or will be disclosed</li>
                        <li>The envisaged period for which the personal data will be stored</li>
                        <li>The existence of automated decision-making, including profiling</li>
                      </ul>
                      <p className="mt-2">
                        <strong>How to exercise:</strong> Use our GDPR request form at /gdpr-request or email support@stitchesx.com with "Data Access Request"
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.2 Right to Rectification (Article 16)</h3>
                      <p>
                        You have the right to obtain from us the rectification of inaccurate personal data concerning you. 
                        Taking into account the purposes of the processing, you also have the right to have incomplete personal data completed.
                      </p>
                      <p className="mt-2">
                        <strong>How to exercise:</strong> Update your information in your account settings or contact us at support@stitchesx.com
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.3 Right to Erasure (Article 17) - "Right to be Forgotten"</h3>
                      <p>
                        You have the right to obtain from us the erasure of personal data concerning you without undue delay where one of the following grounds applies:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The personal data are no longer necessary in relation to the purposes for which they were collected</li>
                        <li>You withdraw consent and there is no other legal ground for the processing</li>
                        <li>You object to the processing and there are no overriding legitimate grounds for the processing</li>
                        <li>The personal data have been unlawfully processed</li>
                        <li>The personal data have to be erased for compliance with a legal obligation</li>
                      </ul>
                      <p className="mt-2">
                        <strong>How to exercise:</strong> Use the "Delete Account" feature in settings or our GDPR request form
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.4 Right to Restrict Processing (Article 18)</h3>
                      <p>
                        You have the right to obtain from us restriction of processing where one of the following applies:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>The accuracy of the personal data is contested by you</li>
                        <li>The processing is unlawful and you oppose the erasure of the personal data</li>
                        <li>We no longer need the personal data for the purposes of processing, but they are required for legal claims</li>
                        <li>You have objected to processing pending verification of legitimate grounds</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.5 Right to Data Portability (Article 20)</h3>
                      <p>
                        You have the right to receive the personal data concerning you, which you have provided to us, 
                        in a structured, commonly used and machine-readable format and have the right to transmit those data 
                        to another controller without hindrance from us.
                      </p>
                      <p className="mt-2">
                        <strong>How to exercise:</strong> Use our GDPR request form to request your data in a portable format
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.6 Right to Object (Article 21)</h3>
                      <p>
                        You have the right to object, on grounds relating to your particular situation, at any time to processing 
                        of personal data concerning you which is based on legitimate interests or for direct marketing purposes.
                      </p>
                      <p className="mt-2">
                        <strong>How to exercise:</strong> Contact us at support@stitchesx.com or adjust your preferences in account settings
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.7 Rights Related to Automated Decision Making (Article 22)</h3>
                      <p>
                        You have the right not to be subject to a decision based solely on automated processing, including profiling, 
                        which produces legal effects concerning you or similarly significantly affects you.
                      </p>
                      <p className="mt-2">
                        <strong>Note:</strong> StitchesX does not currently use automated decision-making that produces legal effects
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">7.8 Right to Withdraw Consent</h3>
                      <p>
                        Where processing is based on consent, you have the right to withdraw your consent at any time. 
                        The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal.
                      </p>
                      
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                        <p className="text-yellow-800">
                          <strong>To exercise any of these rights:</strong> 
                        </p>
                        <ul className="list-disc pl-4 mt-2 text-yellow-800">
                          <li>Use our GDPR request form at /gdpr-request</li>
                          <li>Email us at support@stitchesx.com with "GDPR Request" in the subject line</li>
                          <li>Use account settings for basic data management</li>
                        </ul>
                        <p className="mt-2 text-yellow-800">
                          We will respond within 30 days and may require identity verification to protect your privacy.
                        </p>
                      </div>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">8. Data Retention</h2>
                      <p>
                        We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                        comply with legal obligations, resolve disputes, and enforce our agreements.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.1 Retention Periods by Data Type</h3>
                      
                      <div className="space-y-4 mt-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Account and Profile Data</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> Until account deletion or 1 year of inactivity
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Name, email, company information, preferences, settings
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Invoice and Business Data</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> 3 years (for business records and user access)
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Generated invoices, client information, transaction records, business communications
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Payment and Financial Data</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> 3 years (for business records and dispute resolution)
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Payment records, billing information, transaction history, financial reports
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Usage Analytics and Logs</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> 1 year (anonymized after 6 months)
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Website usage data, performance metrics, error logs, security logs
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Support Communications</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> 2 years
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Customer support tickets, email communications, chat logs, feedback
                          </p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Marketing and Communication Data</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Retention Period:</strong> Until consent is withdrawn or 1 year of inactivity
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Includes:</strong> Marketing preferences, newsletter subscriptions, promotional communications
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.2 Legal Basis for Retention</h3>
                      <p>
                        We retain data based on the following legal grounds:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Contract Performance:</strong> Data necessary to provide our services</li>
                        <li><strong>Legal Obligation:</strong> Data required for tax, accounting, or regulatory compliance</li>
                        <li><strong>Legitimate Interest:</strong> Data needed for security, fraud prevention, or business operations</li>
                        <li><strong>Consent:</strong> Data retained based on your explicit consent</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.3 Data Deletion Process</h3>
                      <p>
                        When data is no longer needed, we follow a comprehensive deletion process:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Secure Deletion:</strong> Data is permanently deleted using industry-standard secure deletion methods</li>
                        <li><strong>Backup Removal:</strong> Data is removed from all backup systems and archives</li>
                        <li><strong>Third-Party Cleanup:</strong> We ensure data is deleted from all third-party service providers</li>
                        <li><strong>Verification:</strong> We verify that data has been completely removed from our systems</li>
                        <li><strong>Documentation:</strong> We maintain records of data deletion for audit purposes</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">8.4 Exceptions to Deletion</h3>
                      <p>
                        In certain circumstances, we may be required to retain data longer than our standard retention periods:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Legal Requirements:</strong> When required by law, regulation, or court order</li>
                        <li><strong>Active Disputes:</strong> Data relevant to ongoing legal proceedings or disputes</li>
                        <li><strong>Fraud Prevention:</strong> Data needed to prevent or investigate fraudulent activities</li>
                        <li><strong>Public Interest:</strong> Data retention required for public health, safety, or security</li>
                      </ul>
                      
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
