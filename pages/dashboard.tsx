import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('6months');

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
              </div>
              
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
