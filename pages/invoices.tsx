import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

interface Invoice {
  id: string;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: 'paid' | 'sent' | 'draft' | 'overdue';
}

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'INV-2023-001',
      client: 'Acme Corp',
      date: 'Jan 15, 2023',
      amount: 500.00,
      status: 'paid'
    },
    {
      id: '2',
      number: 'INV-2023-002',
      client: 'Tech Solutions Inc.',
      date: 'Feb 20, 2023',
      amount: 750.00,
      status: 'sent'
    },
    {
      id: '3',
      number: 'INV-2023-003',
      client: 'Global Services Ltd.',
      date: 'Mar 25, 2023',
      amount: 1200.00,
      status: 'draft'
    },
    {
      id: '4',
      number: 'INV-2023-004',
      client: 'Innovative Designs Co.',
      date: 'Apr 30, 2023',
      amount: 300.00,
      status: 'paid'
    },
    {
      id: '5',
      number: 'INV-2023-005',
      client: 'Creative Minds Agency',
      date: 'May 05, 2023',
      amount: 900.00,
      status: 'sent'
    }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Paid' },
      sent: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500', label: 'Sent' },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'Draft' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', label: 'Overdue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`size-2 ${config.dot} rounded-full mr-1.5`}></span>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Invoice History - Stitches</title>
        <meta name="description" content="View and manage your past invoices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50">
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/invoices" />

          <main className="px-8 sm:px-16 md:px-24 lg:px-40 flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col w-full max-w-6xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-gray-900 tracking-tight text-3xl font-bold">Invoice History</h1>
                  <p className="text-gray-500 text-base font-normal">View and manage your past invoices.</p>
                </div>
                <Link href="/" className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold bg-primary text-white shadow-sm hover:bg-opacity-90 transition-all">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span>Create Invoice</span>
                </Link>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-auto md:flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input 
                    className="form-input w-full rounded-lg border-gray-300 bg-white h-10 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" 
                    placeholder="Search by invoice #, client, or status" 
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-gray-600 text-base">filter_list</span>
                    <span>Filter</span>
                  </button>
                  <button 
                    onClick={() => setShowSort(!showSort)}
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-gray-600 text-base">swap_vert</span>
                    <span>Sort</span>
                  </button>
                </div>
              </div>

              {showFilter && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary">
                        <option>All Status</option>
                        <option>Paid</option>
                        <option>Sent</option>
                        <option>Draft</option>
                        <option>Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Date Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary">
                        <option>All Time</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Amount Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary">
                        <option>All Amounts</option>
                        <option>$0 - $500</option>
                        <option>$500 - $1000</option>
                        <option>$1000+</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => setShowFilter(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => setShowFilter(false)}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-opacity-90"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {showSort && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary">
                        <option>Date Created</option>
                        <option>Invoice Number</option>
                        <option>Client Name</option>
                        <option>Amount</option>
                        <option>Status</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Order</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary">
                        <option>Descending</option>
                        <option>Ascending</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => setShowSort(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setShowSort(false)}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-opacity-90"
                    >
                      Apply Sort
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="w-full">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600 font-medium">
                        <th className="px-6 py-4">Invoice #</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{invoice.number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{invoice.client}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{invoice.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-right font-medium">${invoice.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getStatusBadge(invoice.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link href={`/invoice/${invoice.id}`} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </Link>
                            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-base">more_horiz</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">Showing 1 to {filteredInvoices.length} of {invoices.length} results</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center rounded-lg h-9 px-3 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                  <button className="flex items-center justify-center rounded-lg h-9 px-3 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition-colors">Next</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
