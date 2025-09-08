import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import InvoiceTemplates from '../components/InvoiceTemplates';
import BrandingCustomization from '../components/BrandingCustomization';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('6months');
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [invoiceMode, setInvoiceMode] = useState<'simple' | 'premium'>('simple');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal');
  const [currentStep, setCurrentStep] = useState<'template' | 'branding' | 'details' | 'preview'>('template');
  const [branding, setBranding] = useState({
    logo: null,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter',
    companyName: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  const stats = {
    totalInvoices: 120,
    totalRevenue: 15000,
    overdueInvoices: 15,
    invoiceTypes: 3
  };

  return (
    <>
      <Head>
        <title>Dashboard - Stitches</title>
        <meta name="description" content="View your invoice analytics and business insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --primary-color: #1380ec;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-900" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/dashboard" />
          
          {/* Floating Navigation Button */}
          {showInvoiceBuilder && (
            <div className="fixed top-20 right-6 z-50">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Simple Invoice
                  </Link>
                  <Link 
                    href="/invoices" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Invoices
                  </Link>
                  <Link 
                    href="/templates" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    Templates
                  </Link>
                </div>
              </div>
            </div>
          )}

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl w-full">
              <div className="flex items-center justify-between gap-3 p-4 mb-4">
                <h1 className="text-gray-900 text-4xl font-bold tracking-tighter">Dashboard</h1>
                <div className="flex gap-3">
                  <Link 
                    href="/" 
                    className="bg-[var(--primary-color)] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Simple Invoice
                  </Link>
                  <button 
                    onClick={() => setShowInvoiceBuilder(!showInvoiceBuilder)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {showInvoiceBuilder ? 'Hide' : 'Premium'} Builder
                  </button>
                </div>
              </div>

              {/* Premium Invoice Builder Section */}
              {showInvoiceBuilder && (
                <div className="mb-8 p-4">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowInvoiceBuilder(false)}
                          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Dashboard
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">Create Professional Invoice</h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setInvoiceMode('simple')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            invoiceMode === 'simple'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Simple Form
                        </button>
                        <button
                          onClick={() => setInvoiceMode('premium')}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            invoiceMode === 'premium'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Premium Builder
                        </button>
                        <button
                          onClick={() => setShowInvoiceBuilder(false)}
                          className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {invoiceMode === 'simple' ? (
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Invoice Form</h3>
                          <p className="text-gray-600 mb-6">Create invoices quickly with our simple form</p>
                        </div>
                        <Link 
                          href="/" 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                          Go to Simple Form
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Breadcrumb Navigation */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/dashboard" className="hover:text-gray-900 transition-colors duration-200">
                              Dashboard
                            </Link>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium">Premium Builder</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-gray-900 font-medium capitalize">{currentStep}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link 
                              href="/" 
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                              Simple Invoice
                            </Link>
                            <Link 
                              href="/invoices" 
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                              Invoices
                            </Link>
                            <Link 
                              href="/templates" 
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                              Templates
                            </Link>
                          </div>
                        </div>

                        {/* Step Navigation */}
                        <div className="flex items-center justify-center space-x-4 mb-8">
                          {[
                            { 
                              id: 'template', 
                              name: 'Template', 
                              icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                </svg>
                              )
                            },
                            { 
                              id: 'branding', 
                              name: 'Branding', 
                              icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )
                            },
                            { 
                              id: 'details', 
                              name: 'Details', 
                              icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )
                            },
                            { 
                              id: 'preview', 
                              name: 'Preview', 
                              icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )
                            }
                          ].map((step, index) => (
                            <div key={step.id} className="flex items-center">
                              <button
                                onClick={() => setCurrentStep(step.id as any)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                  currentStep === step.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {step.icon}
                                <span className="font-medium">{step.name}</span>
                              </button>
                              {index < 3 && (
                                <div className={`w-6 h-0.5 mx-2 ${
                                  currentStep === step.id ? 'bg-blue-600' : 'bg-gray-300'
                                }`} />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Step Content */}
                        {currentStep === 'template' && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Template</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                { 
                                  id: 'modern-minimal', 
                                  name: 'Modern Minimal', 
                                  description: 'Clean, professional design perfect for tech and creative businesses',
                                  color: 'from-blue-500 to-blue-600',
                                  category: 'modern'
                                },
                                { 
                                  id: 'corporate-classic', 
                                  name: 'Corporate Classic', 
                                  description: 'Traditional business layout ideal for established companies',
                                  color: 'from-gray-500 to-gray-600',
                                  category: 'classic'
                                },
                                { 
                                  id: 'creative-bold', 
                                  name: 'Creative Bold', 
                                  description: 'Eye-catching design for creative agencies and freelancers',
                                  color: 'from-purple-500 to-purple-600',
                                  category: 'creative'
                                },
                                { 
                                  id: 'elegant-luxury', 
                                  name: 'Elegant Luxury', 
                                  description: 'Sophisticated design for high-end services and luxury brands',
                                  color: 'from-yellow-500 to-yellow-600',
                                  category: 'luxury'
                                }
                              ].map((template) => (
                                <div
                                  key={template.id}
                                  onClick={() => setSelectedTemplate(template.id)}
                                  className={`relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                    selectedTemplate === template.id
                                      ? 'border-blue-500 shadow-xl scale-105'
                                      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                                  }`}
                                >
                                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                    <div className="p-3 h-full flex flex-col">
                                      <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                                        {/* Template-specific designs */}
                                        {template.id === 'modern-minimal' && (
                                          <>
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="w-12 h-6 bg-blue-600 rounded"></div>
                                              <div className="text-xs text-gray-500 font-mono">INV-001</div>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                                              <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                                              <div className="h-1.5 bg-gray-300 rounded w-2/3"></div>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                              <div className="h-1 bg-gray-200 rounded"></div>
                                              <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                              <div className="h-1.5 bg-gray-300 rounded w-1/3"></div>
                                              <div className="h-1.5 bg-blue-600 rounded w-1/4"></div>
                                            </div>
                                          </>
                                        )}
                                        
                                        {template.id === 'corporate-classic' && (
                                          <>
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="w-12 h-6 bg-gray-700 rounded-sm"></div>
                                              <div className="text-xs text-gray-600 font-serif">INV-001</div>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 space-y-2">
                                              <div className="h-1.5 bg-gray-400 rounded w-4/5"></div>
                                              <div className="h-1.5 bg-gray-400 rounded w-3/5"></div>
                                              <div className="h-1.5 bg-gray-400 rounded w-5/6"></div>
                                            </div>
                                            <div className="mt-4 border-t border-gray-200 pt-2 space-y-1">
                                              <div className="h-1 bg-gray-300 rounded w-full"></div>
                                              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                                            </div>
                                            <div className="mt-4 border-t border-gray-300 pt-2 flex justify-between">
                                              <div className="h-1.5 bg-gray-400 rounded w-1/3"></div>
                                              <div className="h-1.5 bg-gray-700 rounded w-1/4"></div>
                                            </div>
                                          </>
                                        )}
                                        
                                        {template.id === 'creative-bold' && (
                                          <>
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="w-12 h-6 bg-purple-600 rounded-full"></div>
                                              <div className="text-xs text-purple-600 font-bold">INV-001</div>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="h-1.5 bg-purple-200 rounded-full w-3/4"></div>
                                              <div className="h-1.5 bg-purple-200 rounded-full w-1/2"></div>
                                              <div className="h-1.5 bg-purple-200 rounded-full w-2/3"></div>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                              <div className="h-1 bg-purple-100 rounded-full"></div>
                                              <div className="h-1 bg-purple-100 rounded-full w-4/5"></div>
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                              <div className="h-1.5 bg-purple-200 rounded-full w-1/3"></div>
                                              <div className="h-1.5 bg-purple-600 rounded-full w-1/4"></div>
                                            </div>
                                          </>
                                        )}
                                        
                                        {template.id === 'elegant-luxury' && (
                                          <>
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="w-12 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
                                              <div className="text-xs text-yellow-600 font-light">INV-001</div>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="h-1.5 bg-yellow-100 rounded w-4/5"></div>
                                              <div className="h-1.5 bg-yellow-100 rounded w-3/5"></div>
                                              <div className="h-1.5 bg-yellow-100 rounded w-5/6"></div>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                              <div className="h-1 bg-yellow-50 rounded"></div>
                                              <div className="h-1 bg-yellow-50 rounded w-4/5"></div>
                                            </div>
                                            <div className="mt-4 flex justify-between">
                                              <div className="h-1.5 bg-yellow-100 rounded w-1/3"></div>
                                              <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded w-1/4"></div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4 bg-white">
                                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        template.category === 'modern' ? 'bg-blue-100 text-blue-800' :
                                        template.category === 'classic' ? 'bg-gray-100 text-gray-800' :
                                        template.category === 'creative' ? 'bg-purple-100 text-purple-800' :
                                        'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {template.category}
                                      </span>
                                      
                                      {selectedTemplate === template.id && (
                                        <div className="flex items-center text-blue-600">
                                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-sm font-medium">Selected</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentStep === 'branding' && (
                          <BrandingCustomization
                            branding={branding}
                            onBrandingChange={setBranding}
                          />
                        )}

                        {currentStep === 'details' && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="INV-001"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                <input
                                  type="date"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div className="mt-6">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Client Information</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Client Name"
                                />
                                <input
                                  type="email"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Client Email"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 'preview' && (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Invoice Preview</h3>
                            <div className="bg-gray-50 rounded-lg p-6">
                              <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
                                {/* Template-specific preview */}
                                {selectedTemplate === 'modern-minimal' && (
                                  <>
                                    <div className="flex justify-between items-center mb-8">
                                      {branding.logo && (
                                        <img src={branding.logo} alt="Logo" className="h-10" />
                                      )}
                                      <div className="text-sm text-gray-500 font-mono">INV-001</div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                      <div>
                                        <h2 
                                          className="text-2xl font-bold mb-2"
                                          style={{ 
                                            fontFamily: branding.fontFamily,
                                            color: branding.primaryColor 
                                          }}
                                        >
                                          {branding.companyName || 'Your Company'}
                                        </h2>
                                        {branding.tagline && (
                                          <p className="text-gray-600">{branding.tagline}</p>
                                        )}
                                      </div>
                                      
                                      <div className="text-sm text-gray-600 space-y-1">
                                        {branding.address && <p>{branding.address}</p>}
                                        {branding.phone && <p>{branding.phone}</p>}
                                        {branding.email && <p>{branding.email}</p>}
                                        {branding.website && <p>{branding.website}</p>}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {selectedTemplate === 'corporate-classic' && (
                                  <>
                                    <div className="border-b border-gray-300 pb-4 mb-6">
                                      <div className="flex justify-between items-center">
                                        {branding.logo && (
                                          <img src={branding.logo} alt="Logo" className="h-10" />
                                        )}
                                        <div className="text-sm text-gray-600 font-serif">INV-001</div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <h2 
                                          className="text-2xl font-bold mb-2"
                                          style={{ 
                                            fontFamily: 'serif',
                                            color: branding.primaryColor 
                                          }}
                                        >
                                          {branding.companyName || 'Your Company'}
                                        </h2>
                                        {branding.tagline && (
                                          <p className="text-gray-600 font-serif">{branding.tagline}</p>
                                        )}
                                      </div>
                                      
                                      <div className="text-sm text-gray-600 space-y-1 font-serif">
                                        {branding.address && <p>{branding.address}</p>}
                                        {branding.phone && <p>{branding.phone}</p>}
                                        {branding.email && <p>{branding.email}</p>}
                                        {branding.website && <p>{branding.website}</p>}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {selectedTemplate === 'creative-bold' && (
                                  <>
                                    <div className="flex justify-between items-center mb-8">
                                      {branding.logo && (
                                        <img src={branding.logo} alt="Logo" className="h-10" />
                                      )}
                                      <div className="text-sm font-bold" style={{ color: branding.primaryColor }}>INV-001</div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                      <div>
                                        <h2 
                                          className="text-2xl font-bold mb-2"
                                          style={{ 
                                            fontFamily: branding.fontFamily,
                                            color: branding.primaryColor 
                                          }}
                                        >
                                          {branding.companyName || 'Your Company'}
                                        </h2>
                                        {branding.tagline && (
                                          <p className="text-gray-600 font-semibold">{branding.tagline}</p>
                                        )}
                                      </div>
                                      
                                      <div className="text-sm text-gray-600 space-y-1 font-medium">
                                        {branding.address && <p>{branding.address}</p>}
                                        {branding.phone && <p>{branding.phone}</p>}
                                        {branding.email && <p>{branding.email}</p>}
                                        {branding.website && <p>{branding.website}</p>}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {selectedTemplate === 'elegant-luxury' && (
                                  <>
                                    <div className="flex justify-between items-center mb-8">
                                      {branding.logo && (
                                        <img src={branding.logo} alt="Logo" className="h-10" />
                                      )}
                                      <div className="text-sm font-light" style={{ color: branding.primaryColor }}>INV-001</div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                      <div>
                                        <h2 
                                          className="text-2xl font-light mb-2"
                                          style={{ 
                                            fontFamily: 'serif',
                                            color: branding.primaryColor 
                                          }}
                                        >
                                          {branding.companyName || 'Your Company'}
                                        </h2>
                                        {branding.tagline && (
                                          <p className="text-gray-600 font-light">{branding.tagline}</p>
                                        )}
                                      </div>
                                      
                                      <div className="text-sm text-gray-600 space-y-1 font-light">
                                        {branding.address && <p>{branding.address}</p>}
                                        {branding.phone && <p>{branding.phone}</p>}
                                        {branding.email && <p>{branding.email}</p>}
                                        {branding.website && <p>{branding.website}</p>}
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Typography Preview */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">Typography Preview</h4>
                                  <div className="space-y-2">
                                    <p 
                                      className="text-lg font-bold"
                                      style={{ 
                                        fontFamily: branding.fontFamily,
                                        color: branding.primaryColor 
                                      }}
                                    >
                                      Company Name - Bold
                                    </p>
                                    <p 
                                      className="text-base font-medium"
                                      style={{ 
                                        fontFamily: branding.fontFamily,
                                        color: branding.secondaryColor 
                                      }}
                                    >
                                      Subtitle - Medium
                                    </p>
                                    <p 
                                      className="text-sm"
                                      style={{ 
                                        fontFamily: branding.fontFamily,
                                        color: '#6B7280'
                                      }}
                                    >
                                      Body text - Regular
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                          <button
                            onClick={() => {
                              const steps = ['template', 'branding', 'details', 'preview'];
                              const currentIndex = steps.indexOf(currentStep);
                              if (currentIndex > 0) {
                                setCurrentStep(steps[currentIndex - 1] as any);
                              }
                            }}
                            disabled={currentStep === 'template'}
                            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Previous
                          </button>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowInvoiceBuilder(false)}
                              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                            >
                              Close Builder
                            </button>
                            <button
                              onClick={() => {
                                const steps = ['template', 'branding', 'details', 'preview'];
                                const currentIndex = steps.indexOf(currentStep);
                                if (currentIndex < steps.length - 1) {
                                  setCurrentStep(steps[currentIndex + 1] as any);
                                }
                              }}
                              disabled={currentStep === 'preview'}
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                <div className="flex flex-col gap-2 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
                  <p className="text-gray-900 text-3xl font-bold tracking-tight">{stats.totalInvoices}</p>
                  <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">arrow_upward</span> 
                    <span>10%</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-gray-900 text-3xl font-bold tracking-tight">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">arrow_upward</span> 
                    <span>15%</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <p className="text-gray-600 text-sm font-medium">Overdue Invoices</p>
                  <p className="text-gray-900 text-3xl font-bold tracking-tight">{stats.overdueInvoices}</p>
                  <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">arrow_downward</span> 
                    <span>5%</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <p className="text-gray-600 text-sm font-medium">Invoices by Type</p>
                  <p className="text-gray-900 text-3xl font-bold tracking-tight">{stats.invoiceTypes} Types</p>
                  <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">arrow_upward</span> 
                    <span>20%</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                <div className="flex flex-col gap-4 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Revenue Over Time</p>
                      <p className="text-gray-900 text-4xl font-bold tracking-tighter truncate">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <p className="text-gray-500 font-normal">Last 6 Months</p>
                      <p className="text-green-600 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">arrow_upward</span>15%
                      </p>
                    </div>
                  </div>
                  <div className="flex min-h-[220px] flex-1 flex-col gap-4 py-4">
                    <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear_1131_5935_2)"></path>
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="var(--primary-color)" strokeLinecap="round" strokeWidth="3"></path>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1131_5935_2" x1="236" x2="236" y1="1" y2="149">
                          <stop stopColor="var(--primary-color)" stopOpacity="0.3"></stop>
                          <stop offset="1" stopColor="var(--primary-color)" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex justify-around">
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Jan</p>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Feb</p>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Mar</p>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Apr</p>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">May</p>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Jun</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 rounded-2xl p-6 glass-effect bg-white/60 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Invoice Status</p>
                      <p className="text-gray-900 text-4xl font-bold tracking-tighter truncate">{stats.totalInvoices}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <p className="text-gray-500 font-normal">This Year</p>
                      <p className="text-green-600 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">arrow_upward</span>10%
                      </p>
                    </div>
                  </div>
                  <div className="grid min-h-[220px] grid-cols-3 gap-6 items-end justify-items-center px-4 py-4">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="bg-[var(--primary-color)]/20 w-full rounded-t-lg" style={{height: '120px'}}></div>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Paid</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="bg-[var(--primary-color)]/50 w-full rounded-t-lg" style={{height: '160px'}}></div>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Unpaid</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="bg-[var(--primary-color)] w-full rounded-t-lg" style={{height: '90px'}}></div>
                      <p className="text-gray-500 text-xs font-medium tracking-wide">Overdue</p>
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
