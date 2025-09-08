import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  description: string;
  details: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
}

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Sample invoice data - in a real app, this would come from an API
  const invoice: Invoice = {
    id: id as string || '1',
    number: 'INV-2024-001',
    issueDate: 'July 15, 2024',
    dueDate: 'August 14, 2024',
    paymentTerms: 'Net 30',
    companyName: 'Tech Solutions Inc.',
    companyAddress: '123 Innovation Drive, Techville, CA 91234',
    companyContact: 'contact@techsolutions.com',
    clientName: 'Alex Johnson',
    clientCompany: 'Global Innovations Ltd.',
    clientAddress: '456 Business Park, Suite 200, Metro City, NY 10001',
    items: [
      {
        id: '1',
        description: 'Software Development',
        details: 'Custom application development',
        quantity: 1,
        unitPrice: 5000.00,
        amount: 5000.00
      },
      {
        id: '2',
        description: 'Consulting Services',
        details: 'Technical consulting and strategy',
        quantity: 10,
        unitPrice: 200.00,
        amount: 2000.00
      },
      {
        id: '3',
        description: 'Training',
        details: 'On-site training for staff',
        quantity: 5,
        unitPrice: 100.00,
        amount: 500.00
      }
    ],
    subtotal: 7500.00,
    taxRate: 5,
    taxAmount: 375.00,
    total: 7875.00,
    notes: 'Thank you for your business. Please remit payment within 30 days of the invoice date. For any questions, please contact us at billing@techsolutions.com.'
  };

  const handleDownload = () => {
    // In a real app, this would trigger PDF generation
    alert('Download functionality would be implemented here');
  };

  const handleResend = () => {
    // In a real app, this would send the invoice via email
    alert('Resend functionality would be implemented here');
  };

  return (
    <>
      <Head>
        <title>Invoice {invoice.number} - Stitches</title>
        <meta name="description" content={`Invoice details for ${invoice.number}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200/60 px-10 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
            <Link href="/invoices" className="flex items-center gap-3 text-gray-900">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M12 22V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M22 17L17 19.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M2 17L7 19.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight">Stitches</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <Link href="/invoices" className="text-gray-900 font-semibold">Invoices</Link>
              <Link href="/" className="hover:text-gray-900 transition-colors">Clients</Link>
              <Link href="/settings" className="hover:text-gray-900 transition-colors">Settings</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <span className="material-symbols-outlined text-xl">add</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_i8f28qVO1rhQwJ8xvb6vyJJ83ANDSo3FRDvaEvvmMJQp4VWJQPMqJ1RgelwgshPfnAKi-XcHufSfFI2qALBiSb376LKEX_ZUeKW5iPUrpDXCeFkk0pyA8P6_ZHaCr0W7xtVIJSXTZAz2OwkyMy0x9zjP4KuVxwA8yp5SzIUOw-HLLk8xu9HLXRhm7ElOicz2z4JZHzzG1oMkfkU49J1cSZgNYyRFlLGRGNnewMR0qMgInfleWrk_nqSTHcRYqUPhLPaHhT9v13c")'}}></div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tighter text-gray-900">Invoice #{invoice.number}</h1>
                <p className="text-gray-500 mt-1">Issued on {invoice.issueDate}</p>
              </div>

              <div className="space-y-12">
                <div className="glass-effect rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Your Company Info</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                    <div className="space-y-1">
                      <dt className="text-gray-500">Company Name</dt>
                      <dd className="text-gray-800 font-medium">{invoice.companyName}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Address</dt>
                      <dd className="text-gray-800 font-medium">{invoice.companyAddress}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Contact</dt>
                      <dd className="text-gray-800 font-medium">{invoice.companyContact}</dd>
                    </div>
                  </dl>
                </div>

                <div className="glass-effect rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Client Info</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                    <div className="space-y-1">
                      <dt className="text-gray-500">Client Name</dt>
                      <dd className="text-gray-800 font-medium">{invoice.clientName}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Company</dt>
                      <dd className="text-gray-800 font-medium">{invoice.clientCompany}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Address</dt>
                      <dd className="text-gray-800 font-medium">{invoice.clientAddress}</dd>
                    </div>
                  </dl>
                </div>

                <div className="glass-effect rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Invoice Details</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
                    <div className="space-y-1">
                      <dt className="text-gray-500">Invoice Number</dt>
                      <dd className="text-gray-800 font-medium">{invoice.number}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Issue Date</dt>
                      <dd className="text-gray-800 font-medium">{invoice.issueDate}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Due Date</dt>
                      <dd className="text-gray-800 font-medium">{invoice.dueDate}</dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="text-gray-500">Payment Terms</dt>
                      <dd className="text-gray-800 font-medium">{invoice.paymentTerms}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 px-1">Line Items</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-200/80 shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-gray-600 w-2/5">Item</th>
                          <th className="px-6 py-3 text-right font-medium text-gray-600">Quantity</th>
                          <th className="px-6 py-3 text-right font-medium text-gray-600">Unit Price</th>
                          <th className="px-6 py-3 text-right font-medium text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/80 bg-white/60">
                        {invoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{item.description}</div>
                              <div className="text-gray-500">{item.details}</div>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">{item.quantity}</td>
                            <td className="px-6 py-4 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-medium text-gray-800">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-full md:w-1/2 lg:w-1/3 space-y-3 glass-effect rounded-xl shadow-sm p-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-800 font-medium">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
                      <span className="text-gray-800 font-medium">${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200/80">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Notes</h3>
                  <p className="text-gray-600 text-sm">{invoice.notes}</p>
                </div>
              </div>
            </div>
          </main>

          <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/60 sticky bottom-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-end py-4 gap-3">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 min-w-[84px] max-w-[480px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold leading-normal tracking-tight transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  <span className="truncate">Download</span>
                </button>
                <button 
                  onClick={handleResend}
                  className="flex items-center gap-2 min-w-[84px] max-w-[480px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:opacity-90 text-white text-sm font-semibold leading-normal tracking-tight transition-opacity"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span className="truncate">Re-send</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
