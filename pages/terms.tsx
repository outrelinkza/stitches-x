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
                        Welcome to StitchesX, a professional invoice generation platform operated by StitchesX ("Company," "we," "us," or "our"). 
                        These Terms of Service ("Terms") govern your use of our website, mobile application, and related services (collectively, the "Service") 
                        operated by StitchesX.
                      </p>
                      <p>
                        By accessing, browsing, or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms 
                        and our Privacy Policy, which is incorporated herein by reference. If you do not agree to these Terms, you may not access or use our Service.
                      </p>
                      <p>
                        These Terms constitute a legally binding agreement between you ("User," "you," or "your") and StitchesX. We reserve the right to modify, 
                        update, or change these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes 
                        your acceptance of the new Terms. We will notify you of any material changes via email or through a notice on our website.
                      </p>
                      <p>
                        You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years old 
                        and have the legal capacity to enter into this agreement.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">2. Service Description</h2>
                      <p>
                        StitchesX is a comprehensive, AI-powered invoice generation and business management platform designed to streamline 
                        the invoicing process for businesses, freelancers, and entrepreneurs. Our Service provides a complete suite of tools 
                        for professional invoice creation, client management, and business operations.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.1 Core Features</h3>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Professional Invoice Creation:</strong> Generate professional, customizable invoices with our advanced template system, including multiple design options, branding elements, and industry-specific formats</li>
                        <li><strong>PDF Generation and Download:</strong> Convert invoices to high-quality PDF format with secure download capabilities, ensuring professional presentation and easy sharing</li>
                        <li><strong>Client and Company Management:</strong> Comprehensive database for storing client information, company details, contact information, and business relationships</li>
                        <li><strong>Payment Processing Integration:</strong> Secure payment processing through Stripe, supporting multiple payment methods including credit cards, bank transfers, and digital wallets</li>
                        <li><strong>Template and Branding Customization:</strong> Extensive customization options including logo upload, color schemes, typography, and personalized branding elements</li>
                        <li><strong>Invoice History and Management:</strong> Complete audit trail of all invoices, payment status tracking, and comprehensive reporting capabilities</li>
                        <li><strong>Multi-Currency Support:</strong> Support for various international currencies and exchange rate calculations</li>
                        <li><strong>Tax Calculation:</strong> Automated tax calculations based on location and business type</li>
                        <li><strong>Recurring Invoices:</strong> Automated recurring invoice generation for subscription-based businesses</li>
                        <li><strong>Invoice Analytics:</strong> Detailed analytics and reporting on invoice performance, payment trends, and business metrics</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.2 Service Availability</h3>
                      <p>
                        Our Service is available 24/7 through our web-based platform accessible at stixches.vercel.app. We strive to maintain 
                        high availability but cannot guarantee uninterrupted access. We reserve the right to perform maintenance, updates, and 
                        improvements that may temporarily affect service availability.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">2.3 Service Limitations</h3>
                      <p>
                        While we provide comprehensive invoice generation services, we do not provide accounting, tax advice, or legal services. 
                        Users are responsible for ensuring compliance with applicable laws, regulations, and tax requirements in their jurisdiction. 
                        Our Service is designed to assist with invoice creation but should not be considered a substitute for professional accounting or legal advice.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">3. User Accounts and Registration</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">3.1 Account Creation and Eligibility</h3>
                      <p>
                        To access the full range of StitchesX features, you must create a user account. Account creation is free and provides access to our 
                        basic invoice generation capabilities. You may also use certain features without creating an account, but with limited functionality.
                      </p>
                      <p>
                        To create an account, you must provide accurate, current, and complete information including:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Valid email address for account verification and communication</li>
                        <li>Secure password meeting our security requirements</li>
                        <li>Business or personal information as required for invoice generation</li>
                        <li>Contact information for customer support and service updates</li>
                      </ul>
                      <p>
                        You agree to maintain and promptly update your account information to keep it accurate, current, and complete. 
                        You are responsible for all activities that occur under your account, whether authorized by you or not.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">3.2 Account Security and Responsibilities</h3>
                      <p>
                        You are solely responsible for maintaining the confidentiality and security of your account credentials, including your username, 
                        password, and any other authentication information. You agree to:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Use a strong, unique password that is not easily guessable</li>
                        <li>Not share your account credentials with any third parties</li>
                        <li>Log out of your account when using shared or public computers</li>
                        <li>Immediately notify us of any unauthorized access or security breaches</li>
                        <li>Change your password immediately if you suspect unauthorized access</li>
                        <li>Not use another user's account without their explicit permission</li>
                      </ul>
                      <p>
                        We implement industry-standard security measures to protect your account, but you are responsible for maintaining the security 
                        of your login credentials. We are not liable for any loss or damage arising from your failure to comply with these security obligations.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">3.3 Account Verification and Identity</h3>
                      <p>
                        We may require you to verify your identity or provide additional information to access certain features or to comply with 
                        applicable laws and regulations. This may include:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Email verification through a confirmation link</li>
                        <li>Phone number verification for enhanced security</li>
                        <li>Identity verification for premium features or high-volume usage</li>
                        <li>Business registration verification for commercial accounts</li>
                      </ul>
                      <p>
                        Failure to complete required verification may result in limited access to certain features or account suspension.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">4. Acceptable Use Policy</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.1 Permitted Uses</h3>
                      <p>
                        You may use StitchesX for legitimate business and personal purposes, including but not limited to:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Professional Invoice Creation:</strong> Creating accurate, professional invoices for legitimate business transactions, services rendered, or products sold</li>
                        <li><strong>Client and Business Management:</strong> Managing client information, company details, and business relationships in accordance with applicable privacy laws</li>
                        <li><strong>Payment Processing:</strong> Processing legitimate payments for goods and services through our integrated payment systems</li>
                        <li><strong>Business Record Keeping:</strong> Maintaining accurate business records, transaction history, and financial documentation</li>
                        <li><strong>Tax Compliance:</strong> Generating invoices that comply with applicable tax laws and regulations in your jurisdiction</li>
                        <li><strong>Business Analytics:</strong> Using our reporting and analytics features to understand business performance and trends</li>
                        <li><strong>Template Customization:</strong> Customizing invoice templates and branding to reflect your business identity</li>
                        <li><strong>Multi-Currency Operations:</strong> Creating invoices in various currencies for international business transactions</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.2 Prohibited Uses</h3>
                      <p>
                        You agree not to use StitchesX for any unlawful, fraudulent, or prohibited activities. The following activities are strictly prohibited:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Illegal Activities:</strong> Any use that violates applicable local, state, national, or international laws, regulations, or ordinances</li>
                        <li><strong>Fraudulent Invoicing:</strong> Creating false, misleading, or fraudulent invoices, including invoices for non-existent goods or services</li>
                        <li><strong>Tax Evasion:</strong> Using the Service to evade taxes, avoid tax obligations, or create misleading tax documentation</li>
                        <li><strong>Money Laundering:</strong> Using the Service to facilitate money laundering, terrorist financing, or other financial crimes</li>
                        <li><strong>Intellectual Property Infringement:</strong> Infringing on copyrights, trademarks, patents, or other intellectual property rights</li>
                        <li><strong>Spam and Unsolicited Communications:</strong> Using the Service to send spam, unsolicited commercial communications, or harassing messages</li>
                        <li><strong>Malicious Activities:</strong> Transmitting viruses, malware, or other harmful code, or attempting to compromise system security</li>
                        <li><strong>Unauthorized Access:</strong> Attempting to gain unauthorized access to our systems, other users' accounts, or restricted areas</li>
                        <li><strong>Service Interference:</strong> Interfering with the proper functioning of the Service, including through excessive usage or automated systems</li>
                        <li><strong>Reverse Engineering:</strong> Attempting to reverse engineer, decompile, or disassemble any part of the Service</li>
                        <li><strong>Commercial Resale:</strong> Reselling, sublicensing, or redistributing the Service without our explicit written permission</li>
                        <li><strong>Child Exploitation:</strong> Any content or activity involving the exploitation of minors</li>
                        <li><strong>Hate Speech and Harassment:</strong> Creating content that promotes hate speech, harassment, or discrimination</li>
                        <li><strong>Regulated Industries:</strong> Using the Service for activities in heavily regulated industries without proper compliance measures</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">4.3 Content Standards</h3>
                      <p>
                        All content you create, upload, or transmit through the Service must comply with the following standards:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Be accurate, truthful, and not misleading</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Not infringe on the rights of third parties</li>
                        <li>Be appropriate for business and professional use</li>
                        <li>Not contain offensive, defamatory, or inappropriate material</li>
                        <li>Respect privacy and confidentiality requirements</li>
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
                        You may terminate your account at any time through the following methods:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Account Settings:</strong> Use the "Delete Account" option in your account settings dashboard</li>
                        <li><strong>Email Request:</strong> Contact us at support@stitchesx.com with "Account Deletion Request" in the subject line</li>
                        <li><strong>GDPR Request:</strong> Use our GDPR request form at /gdpr-request for data deletion</li>
                      </ul>
                      <p>
                        Upon termination, your right to use the Service will cease immediately. We will delete your personal data 
                        within 30 days, except where we are required to retain certain information for legal or regulatory purposes 
                        (such as invoice records for tax compliance).
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
                        These Terms shall be governed by and construed in accordance with the laws of England and Wales, 
                        without regard to conflict of law principles. Any legal proceedings shall be subject to the exclusive 
                        jurisdiction of the courts of England and Wales.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">12.2 Dispute Resolution</h3>
                      <p>
                        If you have any concerns or disputes regarding these Terms or our Service, please contact us first 
                        at support@stitchesx.com. We will work with you in good faith to resolve any issues. If we cannot 
                        resolve the matter through direct communication, you may pursue legal remedies as provided under 
                        English law.
                      </p>
                      
                      <h2 className="mt-8 text-2xl font-semibold text-gray-900">13. Privacy and Data Security</h2>
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">13.1 Data Protection Commitment</h3>
                      <p>
                        We are committed to protecting your privacy and personal information. We will never sell, rent, trade, or otherwise 
                        transfer your personal information to third parties for marketing purposes. Your data is secure with us.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">13.2 Data Security Measures</h3>
                      <p>
                        We implement industry-standard security measures to protect your information:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256 encryption</li>
                        <li><strong>Secure Infrastructure:</strong> Our servers are hosted on secure, enterprise-grade cloud infrastructure</li>
                        <li><strong>Access Controls:</strong> Strict access controls and authentication protocols protect your data</li>
                        <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
                        <li><strong>Staff Training:</strong> Our team is trained on data protection and security best practices</li>
                        <li><strong>Backup Systems:</strong> Regular backups ensure your data is never lost</li>
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">13.3 Data Sharing Policy</h3>
                      <p>
                        We only share your personal information in the following limited circumstances:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Service Providers:</strong> With trusted third-party service providers (like Stripe for payments) who help us operate our service</li>
                        <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets (with notice to users)</li>
                        <li><strong>Consent:</strong> When you explicitly consent to sharing your information</li>
                      </ul>
                      <p>
                        <strong>We never sell your personal information to third parties for marketing or any other purposes.</strong>
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
