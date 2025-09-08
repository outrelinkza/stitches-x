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
                      <h2 className="text-2xl font-bold text-gray-900">Create Professional Invoice</h2>
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
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Invoice Builder</h3>
                          <p className="text-gray-600">Choose templates, customize branding, and create professional invoices</p>
                        </div>
                        
                        {/* Template Selection */}
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                              { id: 'modern-minimal', name: 'Modern Minimal', color: 'from-blue-500 to-blue-600' },
                              { id: 'corporate-classic', name: 'Corporate Classic', color: 'from-gray-500 to-gray-600' },
                              { id: 'creative-bold', name: 'Creative Bold', color: 'from-purple-500 to-purple-600' },
                              { id: 'elegant-luxury', name: 'Elegant Luxury', color: 'from-yellow-500 to-yellow-600' }
                            ].map((template) => (
                              <button
                                key={template.id}
                                className="group relative p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
                              >
                                <div className={`w-full h-24 bg-gradient-to-br ${template.color} rounded-lg mb-3 flex items-center justify-center`}>
                                  <span className="text-white font-semibold text-sm">Preview</span>
                                </div>
                                <h5 className="font-medium text-gray-900 text-sm">{template.name}</h5>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Premium Templates</h4>
                            <p className="text-sm text-gray-600 mb-4">Choose from beautiful, professional templates</p>
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                              Browse Templates →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Brand Customization</h4>
                            <p className="text-sm text-gray-600 mb-4">Upload logo, choose colors, and customize fonts</p>
                            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                              Customize Brand →
                            </button>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Smart Features</h4>
                            <p className="text-sm text-gray-600 mb-4">Auto-numbering, tax calculations, and more</p>
                            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                              Start Building →
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 pt-6">
                          <Link 
                            href="/invoice-builder" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Open Full Builder
                          </Link>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors duration-200">
                            Save as Draft
                          </button>
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
