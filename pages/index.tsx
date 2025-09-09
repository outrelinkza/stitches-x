import React, { useState, useRef, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { useAuth } from '../lib/auth';
import { sendInvoiceEmail } from '../lib/email';

// Initialize Stripe only when needed
const getStripePromise = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_stripe')) {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return null;
};

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  total: number;
  blob: Blob;
  companyInfo: any;
  clientInfo: any;
  lineItems: LineItem[];
  template: string;
}

export default function Home() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [invoiceType, setInvoiceType] = useState('product_sales');
  const [logo, setLogo] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  
  // User account system - now using real authentication
  const [user, setUser] = useState({
    id: authUser?.id || 'anonymous',
    email: authUser?.email || 'guest@example.com',
    name: authUser?.user_metadata?.name || 'Guest User',
    freeDownloadsUsed: 0,
    freeDownloadsLimit: authUser ? 2 : 1, // Authenticated users get 2, anonymous get 1
    isPremium: false,
    invoices: [] as Invoice[]
  });
  
  // Load user data from database
  const loadUserData = async (userId: string) => {
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(prev => ({
          ...prev,
          freeDownloadsUsed: userData.freeDownloadsUsed || 0,
          isPremium: userData.isPremium || false,
        }));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Check anonymous user limits
  const checkAnonymousLimits = async () => {
    if (!authUser) {
      try {
        const response = await fetch('/api/anonymous-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'check_limit' }),
        });
        
        if (response.ok) {
          const limitData = await response.json();
          setUser(prev => ({
            ...prev,
            freeDownloadsUsed: limitData.downloadsUsed,
            freeDownloadsLimit: limitData.limit,
          }));
        }
      } catch (error) {
        console.error('Failed to check anonymous limits:', error);
      }
    }
  };

  // Update user when authentication changes
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        id: authUser.id,
        email: authUser.email || 'user@example.com',
        name: authUser.user_metadata?.name || 'User',
        freeDownloadsLimit: 2,
      }));
      // Load user data from database
      loadUserData(authUser.id);
    } else {
      setUser(prev => ({
        ...prev,
        id: 'anonymous',
        email: 'guest@example.com',
        name: 'Guest User',
        freeDownloadsLimit: 1,
        isPremium: false,
      }));
      // Check anonymous user limits
      checkAnonymousLimits();
    }
  }, [authUser]);

  // Handle template parameter from URL
  useEffect(() => {
    if (router.query.template) {
      setSelectedTemplate(router.query.template as string);
      // Show a success notification instead of alert
      setNotification({ type: 'success', message: `Template "${router.query.template}" is now active!` });
    }
  }, [router.query.template]);
  
  const [showTotals, setShowTotals] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });
  
  const [invoiceDetails, setInvoiceDetails] = useState({
    number: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'USD',
  });
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, rate: 0, total: 0 }
  ]);
  
  const [additionalOptions, setAdditionalOptions] = useState({
    taxRate: 10,
    discount: 0,
    notes: 'Thank you for your business.',
    terms: '',
    recurring: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, total: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      updated[index].total = updated[index].quantity * updated[index].rate;
    }
    
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * additionalOptions.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoice = async () => {
    setIsGenerating(true);
    
    try {
      // Check if we have real API keys, otherwise use mock API
      const hasRealKeys = typeof window !== 'undefined' && 
                         process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
                         !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_stripe');
      
      const apiEndpoint = hasRealKeys ? '/api/generate-invoice' : '/api/generate-invoice-mock';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceType,
          companyInfo,
          clientInfo,
          invoiceDetails,
          lineItems,
          additionalOptions,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Create invoice object
        const invoice = {
          id: `inv_${Date.now()}`,
          number: invoiceDetails.number,
          date: new Date().toISOString(),
          total: calculateTotal(),
          blob: blob,
          companyInfo,
          clientInfo,
          lineItems,
          template: selectedTemplate
        };
        
        setGeneratedInvoice(invoice);
        
        // Check if user can download for free
        if (user.freeDownloadsUsed < user.freeDownloadsLimit || user.isPremium) {
          // Allow free download
          downloadInvoice(invoice);
          updateUserDownloads();
          // Show success notification instead of alert
          setNotification({ type: 'success', message: `Invoice generated and downloaded! ${user.freeDownloadsUsed + 1}/${user.freeDownloadsLimit} free downloads used.` });
        } else {
          // Show payment modal
          setShowPaymentModal(true);
          // Show info notification instead of alert
          setNotification({ type: 'info', message: 'Invoice generated! Payment required to download.' });
        }

        // Send invoice email to client if email is provided
        if (clientInfo.email && clientInfo.email.trim()) {
          try {
            const invoiceData = {
              invoice_number: invoiceDetails.number,
              company_name: companyInfo.name,
              company_address: companyInfo.address,
              client_name: clientInfo.name,
              client_address: clientInfo.address,
              client_email: clientInfo.email,
              invoice_date: invoiceDetails.date,
              due_date: invoiceDetails.dueDate,
              line_items: lineItems,
              subtotal: calculateSubtotal(),
              tax_rate: additionalOptions.taxRate,
              tax_amount: calculateTax(),
              total: calculateTotal(),
              notes: additionalOptions.notes
            };

            await sendInvoiceEmail({
              to_email: clientInfo.email,
              to_name: clientInfo.name,
              invoice_data: invoiceData,
              user_id: authUser?.id
            });

            setNotification({ 
              type: 'success', 
              message: 'Invoice generated and sent to client via email!' 
            });
          } catch (emailError) {
            console.error('Failed to send invoice email:', emailError);
            // Don't show error to user as invoice was generated successfully
          }
        }
        
        // Warn anonymous users about account benefits
        if (!authUser) {
          setNotification({ 
            type: 'info', 
            message: 'Guest users get only 1 free download. Create an account for 2 free downloads and premium features!' 
          });
        }
        
        setIsFormValid(true);
      } else {
        alert('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    const url = window.URL.createObjectURL(invoice.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.number}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const updateUserDownloads = async () => {
    if (generatedInvoice) {
      // Update local state
      setUser(prev => ({
        ...prev,
        freeDownloadsUsed: prev.freeDownloadsUsed + 1,
        invoices: [...prev.invoices, generatedInvoice]
      }));

      // Track in database
      try {
        if (authUser) {
          // Track authenticated user
          await fetch('/api/user-tracking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: authUser.id,
              action: 'invoice_download',
              invoiceId: generatedInvoice.id,
              amount: generatedInvoice.total
            }),
          });
        } else {
          // Track anonymous user
          await fetch('/api/anonymous-tracking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'track_download',
              invoiceId: generatedInvoice.id,
              amount: generatedInvoice.total
            }),
          });
        }
      } catch (error) {
        console.error('Failed to track user activity:', error);
      }
    }
  };

  const handlePayment = async () => {
    // Check if we have real API keys
    const hasRealKeys = typeof window !== 'undefined' && 
                       process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
                       !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_stripe');
    
    if (!hasRealKeys) {
      // Use mock payment for demo
      try {
        const response = await fetch('/api/create-payment-mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 9.99, // £9.99 per invoice
            invoiceNumber: invoiceDetails.number,
          }),
        });

        const { url } = await response.json();
        window.location.href = url; // Redirect to success page
        return;
      } catch (error) {
        alert('Demo payment failed. Please try again.');
        return;
      }
    }

    const stripePromise = getStripePromise();
    if (!stripePromise) {
      alert('Stripe is not configured. Please add your Stripe keys to .env.local');
      return;
    }

    const stripe = await stripePromise;
    
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 9.99, // £9.99 per invoice
          invoiceNumber: invoiceDetails.number,
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePerInvoicePayment = async () => {
    // Check if we have real API keys
    const hasRealKeys = typeof window !== 'undefined' && 
                       process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
                       !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('your_stripe');
    
    if (!hasRealKeys) {
      // Use mock payment for demo
      try {
        const response = await fetch('/api/create-payment-mock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 2.00, // £2.00 per invoice
            invoiceNumber: invoiceDetails.number,
          }),
        });

        const { url } = await response.json();
        window.location.href = url; // Redirect to success page
        return;
      } catch (error) {
        alert('Demo payment failed. Please try again.');
        return;
      }
    }

    const stripePromise = getStripePromise();
    if (!stripePromise) {
      alert('Stripe is not configured. Please add your Stripe keys to .env.local');
      return;
    }

    const stripe = await stripePromise;
    
    try {
      const response = await fetch('/api/create-per-invoice-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceNumber: invoiceDetails.number,
          userId: authUser?.id,
          customerEmail: authUser?.email || clientInfo.email,
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setCompanyInfo({ name: '', address: '', email: '', phone: '' });
    setClientInfo({ name: '', address: '', email: '', phone: '' });
    setInvoiceDetails({ 
      number: `INV-${Date.now()}`, 
      date: new Date().toISOString().split('T')[0], 
      dueDate: '', 
      currency: 'USD' 
    });
    setLineItems([{ description: '', quantity: 1, rate: 0, total: 0 }]);
    setAdditionalOptions({ 
      taxRate: 10, 
      discount: 0, 
      notes: 'Thank you for your business.', 
      terms: '', 
      recurring: false 
    });
    setLogo(null);
    setIsFormValid(false);
    setShowTotals(true);
    setShowResetModal(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <>
      <Head>
        <title>StitchesX - Professional Invoices in Seconds</title>
        <meta name="description" content="Generate professional invoices instantly with premium templates. Support for freelancers, businesses, and all invoice types." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-100">
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/" />
          
          {/* User Status Bar */}
          <div className="bg-blue-50 border-b border-blue-200 px-10 py-3">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">person</span>
                  <span className="text-sm font-medium text-blue-900">{user.name}</span>
                  {!authUser && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                      Guest
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">download</span>
                  <span className="text-sm text-blue-700">
                    {user.freeDownloadsUsed}/{user.freeDownloadsLimit} free downloads used
                    {!authUser && (
                      <span className="text-orange-600 font-medium"> (Guest limit)</span>
                    )}
                  </span>
                </div>
                {user.isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!authUser ? (
                  <>
                    <Link 
                      href="/onboarding" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      How It Works
                    </Link>
                    <Link 
                      href="/auth" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/invoice-builder" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Premium Builder
                    </Link>
                    {user.freeDownloadsUsed >= user.freeDownloadsLimit && !user.isPremium && (
                      <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Upgrade to Premium
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter text-slate-900">StitchesX</h1>
                <p className="mt-2 text-lg text-slate-600">Create professional invoices with ease, powered by AI.</p>
              </div>

              <div className="glass-effect rounded-2xl shadow-lg p-8 space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Your Company Info</h3>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        {logo ? (
                          <div className="relative group">
                            <img src={logo} alt="Company Logo" className="h-20 w-20 rounded-full object-cover"/>
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={removeLogo} className="text-white">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="cursor-pointer" htmlFor="logo-upload">
                            <div className="h-20 w-20 rounded-full bg-white/50 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                              </svg>
                            </div>
                          </label>
                        )}
                        <input 
                          ref={logoInputRef}
                          onChange={handleLogoUpload} 
                          accept="image/*" 
                          className="hidden" 
                          id="logo-upload" 
                          type="file" 
                        />
                      </div>
                      <div className="space-y-4 flex-1">
                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">Company Name</span>
                          <input 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="Acme Inc." 
                            type="text"
                            value={companyInfo.name}
                            onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">Email/Phone</span>
                          <input 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="contact@acme.com" 
                            type="text"
                            value={companyInfo.email}
                            onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                          />
                        </label>
                      </div>
                    </div>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Address</span>
                      <textarea 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                        placeholder="123 Main St, Anytown, USA" 
                        rows={2}
                        value={companyInfo.address}
                        onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      ></textarea>
                    </label>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800">Client Info</h3>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Client Name</span>
                        <input 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                          placeholder="John Doe" 
                          type="text"
                          value={clientInfo.name}
                          onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Address</span>
                        <textarea 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                          placeholder="456 Oak Ave, Somecity, USA" 
                          rows={2}
                          value={clientInfo.address}
                          onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                        ></textarea>
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email/Phone</span>
                        <input 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                          placeholder="john.doe@example.com" 
                          type="text"
                          value={clientInfo.email}
                          onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        />
                      </label>
                    </div>
                  </section>
                </div>

                <section className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">Invoice Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Invoice Number</span>
                      <input 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                        placeholder="INV-001" 
                        type="text"
                        value={invoiceDetails.number}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, number: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Invoice Date</span>
                      <input 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow text-slate-500" 
                        type="date"
                        value={invoiceDetails.date}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, date: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Due Date</span>
                      <input 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow text-slate-500" 
                        type="date"
                        value={invoiceDetails.dueDate}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, dueDate: e.target.value})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Invoice Type</span>
                      <select 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                        value={invoiceType}
                        onChange={(e) => setInvoiceType(e.target.value)}
                      >
                        <option value="product_sales">Product/Sales</option>
                        <option value="freelance_consulting">Freelance/Consulting</option>
                        <option value="simple_receipt">Simple Receipt</option>
                      </select>
                    </label>
                  </div>
                </section>

                {invoiceType === 'product_sales' && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Line Items</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5"><span className="text-sm font-medium text-slate-700">Item Description</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Quantity</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Price</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Total</span></div>
                      </div>
                      {lineItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center">
                          <input 
                            className="col-span-5 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="e.g., iPhone 15 Pro" 
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                          <input 
                            className="col-span-2 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="1" 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                          />
                          <input 
                            className="col-span-2 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="999" 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                          />
                          <span className="col-span-2 text-sm text-slate-800">£{item.total.toFixed(2)}</span>
                          <button 
                            onClick={() => removeLineItem(index)}
                            className="col-span-1 text-slate-500 hover:text-red-500 transition-transform duration-200 hover:scale-110"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addLineItem}
                        className="text-sm font-medium text-primary hover:text-blue-700 transition-transform duration-200 hover:scale-105"
                      >
                        + Add Line Item
                      </button>
                    </div>
                  </section>
                )}

                {invoiceType === 'freelance_consulting' && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Services</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5"><span className="text-sm font-medium text-slate-700">Service Description</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Hours</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Rate</span></div>
                        <div className="col-span-2"><span className="text-sm font-medium text-slate-700">Total</span></div>
                      </div>
                      {lineItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center">
                          <input 
                            className="col-span-5 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="e.g., UI/UX Design" 
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                          <input 
                            className="col-span-2 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="10" 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                          />
                          <input 
                            className="col-span-2 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="150" 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                          />
                          <span className="col-span-2 text-sm text-slate-800">£{item.total.toFixed(2)}</span>
                          <button 
                            onClick={() => removeLineItem(index)}
                            className="col-span-1 text-slate-500 hover:text-red-500 transition-transform duration-200 hover:scale-110"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addLineItem}
                        className="text-sm font-medium text-primary hover:text-blue-700 transition-transform duration-200 hover:scale-105"
                      >
                        + Add Service
                      </button>
                    </div>
                  </section>
                )}

                {invoiceType === 'simple_receipt' && (
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">Receipt Details</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">Description</span>
                          <input 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="Payment for services rendered" 
                            type="text"
                            value={lineItems[0]?.description || ''}
                            onChange={(e) => updateLineItem(0, 'description', e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-slate-700">Amount</span>
                          <input 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                            placeholder="500" 
                            type="number"
                            value={lineItems[0]?.rate || 0}
                            onChange={(e) => updateLineItem(0, 'rate', Number(e.target.value))}
                          />
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                <section className="space-y-6 pt-4 border-t border-white/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Totals</h3>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm font-medium text-slate-700">Show Details</span>
                      <div onClick={() => setShowTotals(!showTotals)} className="relative">
                        <input className="sr-only" type="checkbox" checked={showTotals} readOnly />
                        <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showTotals ? 'translate-x-full !bg-primary' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  {showTotals && (
                    <div className="space-y-4">
                      <div className="flex justify-end items-center">
                        <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Subtotal</span>
                            <span className="text-sm text-slate-800 font-medium">${calculateSubtotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Tax (%)</span>
                            <div className="relative w-24">
                              <input 
                                className="w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow text-right pr-2" 
                                placeholder="10" 
                                type="number"
                                value={additionalOptions.taxRate}
                                onChange={(e) => setAdditionalOptions({...additionalOptions, taxRate: Number(e.target.value)})}
                              />
                            </div>
                          </div>
                          <div className="border-t border-gray-300/80 my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-lg font-bold text-slate-900">${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Payment Options</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-700">Recurring Invoice:</span>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-sm text-slate-600">Off</span>
                      <div className="relative">
                        <input 
                          className="sr-only" 
                          type="checkbox"
                          checked={additionalOptions.recurring}
                          onChange={(e) => setAdditionalOptions({...additionalOptions, recurring: e.target.checked})}
                        />
                        <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${additionalOptions.recurring ? 'translate-x-full !bg-primary' : ''}`}></div>
                      </div>
                      <span className="text-sm text-slate-600">On</span>
                    </label>
                    <span className="text-xs text-slate-500 italic">(Coming Soon)</span>
                  </div>
                </section>

                <section>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Additional Notes</span>
                    <textarea 
                      className="mt-1 block w-full rounded-md border-gray-300 bg-white/50 shadow-sm focus:ring-0 input-focus-glow" 
                      placeholder="Thank you for your business." 
                      rows={3}
                      value={additionalOptions.notes}
                      onChange={(e) => setAdditionalOptions({...additionalOptions, notes: e.target.value})}
                    ></textarea>
                  </label>
                </section>

                <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
                  <button 
                    onClick={generateInvoice}
                    disabled={isGenerating}
                    className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Invoice'}
                  </button>
                  <button 
                    className={`w-full rounded-lg px-6 py-3 text-sm font-bold shadow-lg sm:w-auto btn-hover-effect ${isFormValid ? 'btn-glass-enabled text-slate-800' : 'btn-disabled'}`}
                    disabled={!isFormValid}
                    onClick={handlePayment}
                    title="Click to pay and download invoice"
                  >
                    Pay & Download Invoice
                  </button>
                  <button 
                    onClick={() => setShowResetModal(true)}
                    className="w-full rounded-lg bg-transparent px-6 py-3 text-sm font-bold text-slate-600 sm:w-auto btn-hover-effect hover:bg-slate-100"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Pricing Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-lg text-gray-600">Choose the plan that works best for your business</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="glass-effect rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">£0</div>
                    <p className="text-gray-600">Perfect for getting started</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">2 free invoice downloads</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Basic templates</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">PDF generation</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Email support</span>
                    </li>
                  </ul>
                  <Link 
                    href="/auth"
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-block"
                  >
                    Get Started Free
                  </Link>
                </div>

                {/* Premium Plan */}
                <div className="glass-effect rounded-2xl p-8 text-center border-2 border-blue-500 relative transform scale-105 shadow-xl">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">£9.99</div>
                    <p className="text-gray-600">One-time payment</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Unlimited downloads</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Premium templates</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Custom branding</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Invoice history</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="glass-effect rounded-2xl p-8 text-center border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
                    <p className="text-gray-600">For large teams</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Everything in Premium</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Team collaboration</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">API access</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Custom integrations</span>
                    </li>
                  </ul>
                  <Link 
                    href="/contact"
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-auto py-8 px-10">
            <div className="container mx-auto text-center text-sm text-slate-500">
              <div className="flex justify-center items-center space-x-6">
                <a className="hover:text-slate-800" href="/terms">Terms of Service</a>
                <a className="hover:text-slate-800" href="/privacy">Privacy Policy</a>
                <a className="hover:text-slate-800" href="/contact">Contact Us</a>
              </div>
              <p className="mt-4">© 2025 StitchesX. All rights reserved.</p>
            </div>
          </footer>
        </div>

        {/* Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="glass-effect rounded-2xl shadow-lg p-8 w-full max-w-md text-center mx-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Reset Form</h3>
              <p className="mt-2 text-sm text-slate-600">Are you sure you want to clear all fields? This action cannot be undone.</p>
              <div className="mt-8 flex justify-center gap-4">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="w-full rounded-lg bg-transparent px-6 py-2.5 text-sm font-bold text-slate-700 sm:w-auto btn-hover-effect hover:bg-slate-100 border border-slate-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={resetForm}
                  className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-red-700"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && generatedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Payment Required</h3>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-yellow-600 text-2xl">lock</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Free Downloads Exceeded</h4>
                  <p className="text-gray-600">
                    You've used {user.freeDownloadsUsed}/{user.freeDownloadsLimit} free downloads. 
                    Choose a payment option below to download this invoice.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Invoice #{generatedInvoice.number}</span>
                    <span className="font-semibold">£{generatedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Per-Invoice Option */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-800">Pay Per Invoice</span>
                      <span className="text-lg font-bold text-green-600">£2.00</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">Pay only for this invoice</p>
                    <button 
                      onClick={handlePerInvoicePayment}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Pay £2.00 & Download
                    </button>
                  </div>

                  {/* Premium Option */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-800">Premium Access</span>
                      <span className="text-lg font-bold text-blue-600">£9.99</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">Unlimited invoices + premium features</p>
                    <button 
                      onClick={handlePayment}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>

                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className={`p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-100 border border-red-200 text-red-800' :
              'bg-blue-100 border border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    {notification.type === 'success' ? 'check_circle' :
                     notification.type === 'error' ? 'error' : 'info'}
                  </span>
                  <span className="text-sm font-medium">{notification.message}</span>
                </div>
                <button 
                  onClick={() => setNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
