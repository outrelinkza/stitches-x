import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // General Settings
    companyName: 'Stitches',
    email: 'admin@stitches.com',
    timezone: 'UTC-8 (Pacific Time)',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    invoiceReminders: true,
    paymentNotifications: true,
    marketingEmails: false,
    
    // Payment Settings
    defaultCurrency: 'USD',
    defaultTaxRate: 10,
    paymentTerms: 'Net 15',
    lateFeeEnabled: false,
    lateFeeAmount: 0,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    
    // Billing Settings
    plan: 'Pro',
    billingCycle: 'Monthly',
    nextBillingDate: '2024-02-15'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'payments', label: 'Payments', icon: 'payments' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'billing', label: 'Billing', icon: 'account_balance' }
  ];

  return (
    <>
      <Head>
        <title>Settings - Stitches</title>
        <meta name="description" content="Manage your account settings and preferences" />
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
          <Header currentPage="/settings" />

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl w-full">
              <div className="flex items-center justify-between gap-3 p-4 mb-6">
                <h1 className="text-gray-900 text-4xl font-bold tracking-tighter">Settings</h1>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="glass-effect rounded-2xl p-4 bg-white/60 shadow-sm">
                    <nav className="space-y-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="glass-effect rounded-2xl p-6 bg-white/60 shadow-sm">
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      {/* General Settings */}
                      {activeTab === 'general' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-900">General Settings</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                              <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                              <select
                                value={formData.timezone}
                                onChange={(e) => handleInputChange('timezone', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                                <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                                <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                                <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                              <select
                                value={formData.language}
                                onChange={(e) => handleInputChange('language', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notification Settings */}
                      {activeTab === 'notifications' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
                          <div className="space-y-4">
                            {[
                              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                              { key: 'invoiceReminders', label: 'Invoice Reminders', description: 'Get reminded about overdue invoices' },
                              { key: 'paymentNotifications', label: 'Payment Notifications', description: 'Notify when payments are received' },
                              { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content and updates' }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                                  <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData[item.key as keyof typeof formData] as boolean}
                                    onChange={(e) => handleInputChange(item.key, e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Settings */}
                      {activeTab === 'payments' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-900">Payment Settings</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                              <select
                                value={formData.defaultCurrency}
                                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
                              <input
                                type="number"
                                value={formData.defaultTaxRate}
                                onChange={(e) => handleInputChange('defaultTaxRate', parseFloat(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                              <select
                                value={formData.paymentTerms}
                                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="Net 15">Net 15</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Due on Receipt">Due on Receipt</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Amount ($)</label>
                              <input
                                type="number"
                                value={formData.lateFeeAmount}
                                onChange={(e) => handleInputChange('lateFeeAmount', parseFloat(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Security Settings */}
                      {activeTab === 'security' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-900">Security Settings</h2>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.twoFactorAuth}
                                  onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                              <input
                                type="number"
                                value={formData.sessionTimeout}
                                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Billing Settings */}
                      {activeTab === 'billing' && (
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold text-gray-900">Billing Settings</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Current Plan</label>
                              <div className="p-4 bg-primary/10 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-primary">{formData.plan}</span>
                                  <span className="text-sm text-gray-500">$29/month</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                              <select
                                value={formData.billingCycle}
                                onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly (Save 20%)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Next Billing Date</label>
                              <input
                                type="date"
                                value={formData.nextBillingDate}
                                onChange={(e) => handleInputChange('nextBillingDate', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Cancel Subscription
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      <div className="flex justify-end pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          Save Settings
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
    </>
  );
}