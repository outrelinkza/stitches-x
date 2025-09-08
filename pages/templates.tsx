import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Templates() {
  const [activeTemplate, setActiveTemplate] = useState('standard');
  const [templateName, setTemplateName] = useState('Standard Template');
  const [defaultTaxRate, setDefaultTaxRate] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [currency, setCurrency] = useState('USD - United States Dollar');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [currentDefault, setCurrentDefault] = useState('standard');
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplateData, setEditingTemplateData] = useState<any>(null);

  const templates = [
    {
      id: 'standard',
      name: 'Standard Template',
      description: 'Clean and professional design',
      isDefault: true,
      badge: 'Default'
    },
    {
      id: 'recurring',
      name: 'Recurring Clients Template',
      description: 'For repeat customers',
      isDefault: false
    },
    {
      id: 'minimalist',
      name: 'Minimalist Dark',
      description: 'A sleek, modern dark theme',
      isDefault: false
    }
  ];

  const handleSetDefault = (templateId: string) => {
    console.log('Setting default template:', templateId);
    setActiveTemplate(templateId);
    setCurrentDefault(templateId);
    
    // Find the template name for better feedback
    const template = templates.find(t => t.id === templateId);
    const templateName = template ? template.name : templateId;
    
    // Show success message instead of alert
    setShowSuccessMessage(`Template "${templateName}" is now your default template!`);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage('');
    }, 3000);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Template settings saved successfully!');
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  console.log('Search query:', searchQuery);
  console.log('Filtered templates:', filteredTemplates.length);

  return (
    <>
      <Head>
        <title>Templates - Stitches</title>
        <meta name="description" content="Manage your invoice templates and designs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <style jsx global>{`
          :root {
            --primary-color: #137fec;
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
          <Header currentPage="/templates" />

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl w-full">
              <div className="flex items-center justify-between gap-3 p-4 mb-6">
                <h1 className="text-gray-900 text-4xl font-bold tracking-tighter">Templates</h1>
              </div>
              
              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    <p className="text-green-700 font-medium">{showSuccessMessage}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="lg:col-span-2">
                  <div className="glass-effect rounded-2xl p-6 bg-white/60 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Invoice Templates</h2>
                        <p className="text-gray-600 mt-1">View, create, and edit your invoice templates.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                          <input 
                            className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white/80 focus:ring-primary focus:border-primary transition-all focus:w-56" 
                            placeholder="Search templates..." 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => {
                              console.log('Search query changed:', e.target.value);
                              setSearchQuery(e.target.value);
                            }}
                          />
                        </div>
                        <button 
                          className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setShowFilter(!showFilter)}
                        >
                          <span className="material-symbols-outlined text-base">filter_list</span>
                          <span>Filter</span>
                        </button>
                        <button 
                          onClick={() => setShowCreateModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <span className="material-symbols-outlined text-base">add</span>
                          <span>Create New</span>
                        </button>
                      </div>
                    </div>
                    
                    {searchQuery && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Showing {filteredTemplates.length} of {templates.length} templates for "{searchQuery}"
                        </p>
                      </div>
                    )}
                    {filteredTemplates.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">search_off</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or create a new template.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200/80">
                        {filteredTemplates.map((template) => (
                          <li key={template.id} className="py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400 text-3xl">image</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{template.name}</p>
                                <p className="text-sm text-gray-500">{template.description}</p>
                                <div className="flex gap-2 mt-1">
                                  {currentDefault === template.id && (
                                    <span className="text-sm text-white bg-primary px-2 py-0.5 rounded-full font-medium">Default</span>
                                  )}
                                  {activeTemplate === template.id && (
                                    <span className="text-sm text-white bg-green-500 px-2 py-0.5 rounded-full font-medium">Active</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setPreviewTemplate(template)}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Preview
                          </button>
                              {currentDefault !== template.id && (
                                <button 
                                  onClick={() => handleSetDefault(template.id)}
                                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  Set as Default
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  setEditingTemplateData(template);
                                  setShowEditModal(true);
                                }}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Template Settings */}
                <div className="lg:col-span-1">
                  <div className="glass-effect rounded-2xl p-6 bg-white/60 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">Template Settings</h3>
                    <form onSubmit={handleSaveChanges} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="template-name">Template Name</label>
                        <input 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white/80" 
                          id="template-name" 
                          type="text" 
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="default-tax-rate">Default Tax Rate (%)</label>
                        <input 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white/80" 
                          id="default-tax-rate" 
                          type="number" 
                          value={defaultTaxRate}
                          onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="payment-terms">Payment Terms</label>
                        <select 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white/80" 
                          id="payment-terms"
                          value={paymentTerms}
                          onChange={(e) => setPaymentTerms(e.target.value)}
                        >
                          <option value="Net 30">Net 30</option>
                          <option value="Net 15">Net 15</option>
                          <option value="Net 7">Net 7</option>
                          <option value="Due on receipt">Due on receipt</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="currency">Currency</label>
                        <select 
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white/80" 
                          id="currency"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="EUR - Euro">EUR - Euro</option>
                          <option value="USD - United States Dollar">USD - United States Dollar</option>
                          <option value="GBP - British Pound">GBP - British Pound</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button className="px-5 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" type="button">
                          Cancel
                        </button>
                        <button className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" type="submit">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Template Preview</h3>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900">{previewTemplate.name}</h4>
                <p className="text-gray-600">{previewTemplate.description}</p>
              </div>
              
              {/* Mock Invoice Preview */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-gray-600">Invoice #INV-001</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                    <p className="text-gray-600">Your Company Name</p>
                    <p className="text-gray-600">123 Business St</p>
                    <p className="text-gray-600">City, State 12345</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
                    <p className="text-gray-600">Client Company</p>
                    <p className="text-gray-600">456 Client Ave</p>
                    <p className="text-gray-600">Client City, State 67890</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-gray-900">$1,000.00</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    // Actually set this template as the active template
                    setActiveTemplate(previewTemplate.id);
                    setCurrentDefault(previewTemplate.id);
                    
                    // Redirect to the main invoice page with this template selected
                    window.location.href = `/?template=${previewTemplate.id}`;
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Create New Template</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newTemplateName.trim()) {
                  alert(`New template "${newTemplateName}" created successfully!`);
                  setNewTemplateName('');
                  setNewTemplateDescription('');
                  setShowCreateModal(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Template Name</label>
                  <input 
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Enter template name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea 
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Enter template description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showEditModal && editingTemplateData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Edit Template: {editingTemplateData.name}</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invoice Data Editor */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Invoice Data</h4>
                  <div className="space-y-6">
                    {/* Invoice Details */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Invoice Details</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number</label>
                          <input 
                            type="text"
                            defaultValue="INV-001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Date</label>
                          <input 
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                          <input 
                            type="date"
                            defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Payment Terms</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                            <option value="Net 30">Net 30</option>
                            <option value="Net 15">Net 15</option>
                            <option value="Net 7">Net 7</option>
                            <option value="Due on receipt">Due on receipt</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Your Company</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                          <input 
                            type="text"
                            defaultValue="Your Company Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                          <textarea 
                            defaultValue="123 Business Street&#10;City, State 12345"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                          <input 
                            type="tel"
                            defaultValue="(555) 123-4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                          <input 
                            type="email"
                            defaultValue="contact@yourcompany.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                          <input 
                            type="url"
                            defaultValue="www.yourcompany.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Information */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Client Information</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Client Name</label>
                          <input 
                            type="text"
                            defaultValue="Client Company Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Client Address</label>
                          <textarea 
                            defaultValue="456 Client Avenue&#10;Client City, State 67890"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Client Phone</label>
                          <input 
                            type="tel"
                            defaultValue="(555) 987-6543"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Client Email</label>
                          <input 
                            type="email"
                            defaultValue="contact@clientcompany.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Line Items</h5>
                      <div className="space-y-4">
                        {/* Item 1 */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <input 
                              type="text"
                              defaultValue="Web Development Services"
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="1"
                              placeholder="Qty"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="1500.00"
                              placeholder="Rate"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="1500.00"
                              placeholder="Total"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                              readOnly
                            />
                          </div>
                          <div className="col-span-1">
                            <button className="text-red-500 hover:text-red-700">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Item 2 */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <input 
                              type="text"
                              defaultValue="Domain & Hosting"
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="1"
                              placeholder="Qty"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="200.00"
                              placeholder="Rate"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input 
                              type="number"
                              defaultValue="200.00"
                              placeholder="Total"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                              readOnly
                            />
                          </div>
                          <div className="col-span-1">
                            <button className="text-red-500 hover:text-red-700">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Add Item Button */}
                        <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors">
                          <span className="material-symbols-outlined mr-2">add</span>
                          Add Line Item
                        </button>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">$1,700.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax (10%):</span>
                            <span className="font-medium">$170.00</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                            <span>Total:</span>
                            <span>$1,870.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Notes & Terms</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                          <textarea 
                            placeholder="Additional notes or terms..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h4>
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="bg-white p-6 rounded shadow-sm">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                        <p className="text-gray-600">Invoice #INV-001</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                          <p className="text-gray-600">Your Company Name</p>
                          <p className="text-gray-600">123 Business St</p>
                          <p className="text-gray-600">City, State 12345</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
                          <p className="text-gray-600">Client Company</p>
                          <p className="text-gray-600">456 Client Ave</p>
                          <p className="text-gray-600">Client City, State 67890</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Total Amount:</span>
                          <span className="text-xl font-bold text-gray-900">$1,000.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Template updated successfully!');
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
