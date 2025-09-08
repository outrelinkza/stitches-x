import React, { useState } from 'react';
import Link from 'next/link';
import InvoiceTemplates from './InvoiceTemplates';
import BrandingCustomization from './BrandingCustomization';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  id: string;
  template: string;
  branding: {
    logo: string | null;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    companyName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  paymentTerms: string;
  dueDate: string;
  issueDate: string;
}

export default function InvoiceBuilder() {
  const [currentStep, setCurrentStep] = useState<'template' | 'branding' | 'details' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal');
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    id: 'INV-001',
    template: 'modern-minimal',
    branding: {
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
    },
    client: {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    paymentTerms: 'Net 30',
    dueDate: '',
    issueDate: new Date().toISOString().split('T')[0]
  });

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => ({ ...prev, ...updates }));
  };

  const updateBranding = (branding: InvoiceData['branding']) => {
    setInvoiceData(prev => ({ ...prev, branding }));
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateInvoiceItem = (id: string, updates: Partial<InvoiceItem>) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id 
          ? { ...item, ...updates, amount: (updates.quantity || item.quantity) * (updates.rate || item.rate) }
          : item
      )
    }));
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [invoiceData.items, invoiceData.taxRate]);

  const steps = [
    { 
      id: 'template', 
      name: 'Template', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    },
    { 
      id: 'branding', 
      name: 'Branding', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'details', 
      name: 'Details', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      id: 'preview', 
      name: 'Preview', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">Stitches</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Simple Invoice
              </Link>
              <Link 
                href="/invoices" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Invoices
              </Link>
              <Link 
                href="/templates" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Templates
              </Link>
            </div>

            {/* Back Button */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Professional Invoices
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Design beautiful, branded invoices that get you paid faster. 
            Choose from premium templates and customize everything to match your brand.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id as any)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div className="flex-shrink-0">{step.icon}</div>
                  <div className="text-left">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs opacity-75">Step {index + 1}</div>
                  </div>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep === step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 'template' && (
            <InvoiceTemplates
              selectedTemplate={selectedTemplate}
              onTemplateSelect={(template) => {
                setSelectedTemplate(template);
                updateInvoiceData({ template });
              }}
            />
          )}

          {currentStep === 'branding' && (
            <BrandingCustomization
              branding={invoiceData.branding}
              onBrandingChange={updateBranding}
            />
          )}

          {currentStep === 'details' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoice Details</h2>
                <p className="text-gray-600">Fill in the invoice information and client details</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Client Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                      <input
                        type="text"
                        value={invoiceData.client.name}
                        onChange={(e) => updateInvoiceData({
                          client: { ...invoiceData.client, name: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Client or Company Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={invoiceData.client.email}
                        onChange={(e) => updateInvoiceData({
                          client: { ...invoiceData.client, email: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="client@company.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={invoiceData.client.address}
                        onChange={(e) => updateInvoiceData({
                          client: { ...invoiceData.client, address: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Client address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={invoiceData.client.phone}
                        onChange={(e) => updateInvoiceData({
                          client: { ...invoiceData.client, phone: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Settings */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Invoice Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={invoiceData.id}
                        onChange={(e) => updateInvoiceData({ id: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                        <input
                          type="date"
                          value={invoiceData.issueDate}
                          onChange={(e) => updateInvoiceData({ issueDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={invoiceData.dueDate}
                          onChange={(e) => updateInvoiceData({ dueDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                      <select
                        value={invoiceData.paymentTerms}
                        onChange={(e) => updateInvoiceData({ paymentTerms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Net 15">Net 15</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 60">Net 60</option>
                        <option value="Due on Receipt">Due on Receipt</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={invoiceData.taxRate}
                        onChange={(e) => updateInvoiceData({ taxRate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Invoice Items</h3>
                  <button
                    onClick={addInvoiceItem}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(item.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Item description"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <button
                          onClick={() => removeInvoiceItem(item.id)}
                          className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>${invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax ({invoiceData.taxRate}%):</span>
                      <span>${invoiceData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-2">
                      <span>Total:</span>
                      <span>${invoiceData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={invoiceData.notes}
                  onChange={(e) => updateInvoiceData({ notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes or terms..."
                />
              </div>
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Invoice Preview</h2>
                <p className="text-gray-600">Review your invoice before generating the PDF</p>
              </div>

              {/* Invoice Preview */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      {invoiceData.branding.logo && (
                        <img src={invoiceData.branding.logo} alt="Logo" className="h-12 mb-4" />
                      )}
                      <h1 
                        className="text-2xl font-bold mb-2"
                        style={{ 
                          fontFamily: invoiceData.branding.fontFamily,
                          color: invoiceData.branding.primaryColor 
                        }}
                      >
                        {invoiceData.branding.companyName || 'Your Company'}
                      </h1>
                      {invoiceData.branding.tagline && (
                        <p className="text-gray-600 mb-4">{invoiceData.branding.tagline}</p>
                      )}
                      <div className="text-sm text-gray-600 space-y-1">
                        {invoiceData.branding.address && <p>{invoiceData.branding.address}</p>}
                        {invoiceData.branding.phone && <p>{invoiceData.branding.phone}</p>}
                        {invoiceData.branding.email && <p>{invoiceData.branding.email}</p>}
                        {invoiceData.branding.website && <p>{invoiceData.branding.website}</p>}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                      <p className="text-gray-600">#{invoiceData.id}</p>
                      <div className="mt-4 text-sm text-gray-600 space-y-1">
                        <p><strong>Issue Date:</strong> {new Date(invoiceData.issueDate).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> {invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'Not set'}</p>
                        <p><strong>Payment Terms:</strong> {invoiceData.paymentTerms}</p>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
                    <div className="text-gray-700">
                      <p className="font-semibold">{invoiceData.client.name || 'Client Name'}</p>
                      {invoiceData.client.email && <p>{invoiceData.client.email}</p>}
                      {invoiceData.client.phone && <p>{invoiceData.client.phone}</p>}
                      {invoiceData.client.address && <p className="whitespace-pre-line">{invoiceData.client.address}</p>}
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Qty</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Rate</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-700">{item.description || 'Item description'}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-gray-700">${item.rate.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-gray-700">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>${invoiceData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>${invoiceData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
                        <span>Total:</span>
                        <span>${invoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoiceData.notes && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                      <p className="text-gray-700 whitespace-pre-line">{invoiceData.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200">
                  Save Draft
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200">
                  Generate PDF
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200">
                  Send Invoice
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const currentIndex = steps.findIndex(step => step.id === currentStep);
              if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1].id as any);
              }
            }}
            disabled={currentStep === 'template'}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          
          <button
            onClick={() => {
              const currentIndex = steps.findIndex(step => step.id === currentStep);
              if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1].id as any);
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
  );
}
