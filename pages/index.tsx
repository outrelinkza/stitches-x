import React, { useState, useRef, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { useAuth } from '../lib/auth';
import { sendInvoiceEmail } from '../lib/email';
import Avatar from '../components/Avatar';

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
  const [isFormValid, setIsFormValid] = useState(true);
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
      // Set default limits for anonymous users
      setUser(prev => ({
        ...prev,
        freeDownloadsUsed: 0,
        freeDownloadsLimit: 1,
      }));
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

  // Function to calculate due date based on payment terms
  const calculateDueDate = (invoiceDate: string, paymentTerms: string) => {
    if (!invoiceDate) return '';
    
    const date = new Date(invoiceDate);
    
    switch (paymentTerms) {
      case 'due_on_receipt':
        return invoiceDate;
      case 'net_15':
        date.setDate(date.getDate() + 15);
        break;
      case 'net_30':
        date.setDate(date.getDate() + 30);
        break;
      case 'net_45':
        date.setDate(date.getDate() + 45);
        break;
      case 'net_60':
        date.setDate(date.getDate() + 60);
        break;
      default:
        return invoiceDate;
    }
    
    return date.toISOString().split('T')[0];
  };

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
    name: 'Your Company Name',
    address: '',
    email: '',
    phone: '',
  });
  
  const [clientInfo, setClientInfo] = useState({
    name: 'Client Name',
    address: '',
    email: '',
    phone: '',
  });
  
  const [invoiceDetails, setInvoiceDetails] = useState({
    number: 'INV-001',
    date: '2025-01-09',
    dueDate: '',
    currency: 'GBP',
    paymentTerms: 'net_30',
    lateFeeRate: 0,
    lateFeeAmount: 0
  });

  // Auto-calculate due date when invoice date or payment terms change
  useEffect(() => {
    if (invoiceDetails.date && invoiceDetails.paymentTerms !== 'custom') {
      const dueDate = calculateDueDate(invoiceDetails.date, invoiceDetails.paymentTerms);
      setInvoiceDetails(prev => ({ ...prev, dueDate }));
    }
  }, [invoiceDetails.date, invoiceDetails.paymentTerms]);
  
  const [isClient, setIsClient] = useState(false);
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: 'Sample Item', quantity: 1, rate: 100, total: 100 }
  ]);
  
  const [taxRate, setTaxRate] = useState(10);
  
  // Toggle states for features
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(false);
  const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(false);
  const [clientAccessEnabled, setClientAccessEnabled] = useState(false);
  
  // Payment method states
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({
    visa: false,
    mastercard: false,
    amex: false,
    paypal: false
  });
  
  const [additionalOptions, setAdditionalOptions] = useState({
    taxRate: 10,
    discount: 0,
    notes: 'Thank you for your business.',
    terms: '',
    recurring: false,
    recurringFrequency: 'monthly',
    recurringDuration: '12',
  });

  // Type-specific fields
  const [typeSpecificFields, setTypeSpecificFields] = useState({
    // Medical/Dental/Veterinary
    patientId: '',
    insuranceProvider: '',
    policyNumber: '',
    procedureCode: '',
    
    // Legal
    caseNumber: '',
    courtFees: 0,
    billableHours: 0,
    
    // Freelance/Consulting
    hourlyRate: 0,
    projectPhase: '',
    milestone: '',
    
    // Product/Sales
    sku: '',
    inventory: '',
    shippingMethod: '',
    
    // Service Provider
    serviceType: '',
    serviceLocation: '',
    serviceDate: '',
    
    // Subscription
    subscriptionPlan: '',
    billingCycle: 'monthly',
    
    // Maintenance/Repair
    equipmentId: '',
    issueDescription: '',
    warrantyInfo: '',
    
    // Training/Education
    courseName: '',
    instructorName: '',
    certificationNumber: '',
    
    // Real Estate
    propertyAddress: '',
    listingId: '',
    commissionRate: 0,
    
    // Transportation
    vehicleId: '',
    route: '',
    distance: 0,
    
    // Hospitality
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    
    // Insurance
    policyType: '',
    coverageAmount: 0,
    claimNumber: '',
    
    // Utilities
    meterReading: '',
    usageAmount: 0,
    servicePeriod: '',
    
    // Rental
    rentalPeriod: '',
    depositAmount: 0,
    lateFees: 0,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Initialize dynamic values on client side only to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setInvoiceDetails(prev => ({
      ...prev,
      number: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    }));
  }, []);

  // Set default company and client names to make form valid by default
  useEffect(() => {
    if (isClient) {
      setCompanyInfo(prev => ({
        ...prev,
        name: prev.name || 'Your Company Name'
      }));
      setClientInfo(prev => ({
        ...prev,
        name: prev.name || 'Client Name'
      }));
    }
  }, [isClient]);

  // Force form validation after setting defaults
  useEffect(() => {
    const isValid = 
      companyInfo.name.trim() !== '' &&
      clientInfo.name.trim() !== '' &&
      invoiceDetails.number.trim() !== '' &&
      invoiceDetails.date !== '' &&
      lineItems.some(item => item.description.trim() && item.rate > 0);
    
    setIsFormValid(isValid);
  }, [companyInfo.name, clientInfo.name, invoiceDetails.number, invoiceDetails.date, lineItems]);

  // Function to render type-specific fields
  const renderTypeSpecificFields = () => {
    const commonInputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400";
    
    switch (invoiceType) {
      case 'medical':
      case 'dental':
      case 'veterinary':
        return (
          <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Medical Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="PAT-001"
                  value={typeSpecificFields.patientId}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, patientId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Insurance Provider</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Blue Cross"
                  value={typeSpecificFields.insuranceProvider}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, insuranceProvider: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Policy Number</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="POL-123456"
                  value={typeSpecificFields.policyNumber}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, policyNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Procedure Code</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="CPT-99213"
                  value={typeSpecificFields.procedureCode}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, procedureCode: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-3">Legal Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Case Number</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="CASE-2024-001"
                  value={typeSpecificFields.caseNumber}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, caseNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Billable Hours</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="8.5"
                  value={typeSpecificFields.billableHours}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, billableHours: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Court Fees</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="150.00"
                  value={typeSpecificFields.courtFees}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, courtFees: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        );

      case 'freelance_consulting':
        return (
          <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-3">Project Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Hourly Rate</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="75.00"
                  value={typeSpecificFields.hourlyRate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, hourlyRate: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Project Phase</label>
                <select
                  className={commonInputClass}
                  value={typeSpecificFields.projectPhase}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, projectPhase: e.target.value})}
                >
                  <option value="">Select Phase</option>
                  <option value="planning">Planning</option>
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                  <option value="deployment">Deployment</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-green-700 mb-1">Milestone</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Phase 1 Complete"
                  value={typeSpecificFields.milestone}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, milestone: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'product_sales':
        return (
          <div className="space-y-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-800 mb-3">Product Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">SKU</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="SKU-12345"
                  value={typeSpecificFields.sku}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, sku: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">Inventory Location</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Warehouse A"
                  value={typeSpecificFields.inventory}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, inventory: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-orange-700 mb-1">Shipping Method</label>
                <select
                  className={commonInputClass}
                  value={typeSpecificFields.shippingMethod}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, shippingMethod: e.target.value})}
                >
                  <option value="">Select Shipping</option>
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="overnight">Overnight</option>
                  <option value="pickup">Store Pickup</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <h4 className="text-sm font-semibold text-indigo-800 mb-3">Subscription Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Premium Plan"
                  value={typeSpecificFields.subscriptionPlan}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, subscriptionPlan: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-700 mb-1">Billing Cycle</label>
                <select
                  className={commonInputClass}
                  value={typeSpecificFields.billingCycle}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, billingCycle: e.target.value})}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'service_provider':
      case 'contractor':
      case 'agency':
        return (
          <div className="space-y-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
            <h4 className="text-sm font-semibold text-teal-800 mb-3">Service Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Service Type</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Consultation"
                  value={typeSpecificFields.serviceType}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, serviceType: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Service Location</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Client Office"
                  value={typeSpecificFields.serviceLocation}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, serviceLocation: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">Service Date</label>
                <input
                  type="date"
                  className={commonInputClass}
                  value={typeSpecificFields.serviceDate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, serviceDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'maintenance':
      case 'repair':
        return (
          <div className="space-y-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-800 mb-3">Equipment Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">Equipment ID</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="EQ-001"
                  value={typeSpecificFields.equipmentId}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, equipmentId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">Issue Description</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="System maintenance"
                  value={typeSpecificFields.issueDescription}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, issueDescription: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">Warranty Info</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Under warranty"
                  value={typeSpecificFields.warrantyInfo}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, warrantyInfo: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'training':
      case 'education':
        return (
          <div className="space-y-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <h4 className="text-sm font-semibold text-pink-800 mb-3">Training Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Course Name</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Advanced Training"
                  value={typeSpecificFields.courseName}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, courseName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Instructor Name</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="John Smith"
                  value={typeSpecificFields.instructorName}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, instructorName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Certification Number</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="CERT-12345"
                  value={typeSpecificFields.certificationNumber}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, certificationNumber: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'real_estate':
        return (
          <div className="space-y-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <h4 className="text-sm font-semibold text-emerald-800 mb-3">Property Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">Property Address</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="123 Main St"
                  value={typeSpecificFields.propertyAddress}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, propertyAddress: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">Listing ID</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="LIST-001"
                  value={typeSpecificFields.listingId}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, listingId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="3.5"
                  value={typeSpecificFields.commissionRate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, commissionRate: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        );

      case 'transportation':
        return (
          <div className="space-y-4 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
            <h4 className="text-sm font-semibold text-cyan-800 mb-3">Transportation Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">Vehicle ID</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="VEH-001"
                  value={typeSpecificFields.vehicleId}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, vehicleId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">Route</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="City A to City B"
                  value={typeSpecificFields.route}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, route: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-1">Distance (miles)</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="150"
                  value={typeSpecificFields.distance}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, distance: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        );

      case 'hospitality':
        return (
          <div className="space-y-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
            <h4 className="text-sm font-semibold text-rose-800 mb-3">Accommodation Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">Room Number</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="101"
                  value={typeSpecificFields.roomNumber}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, roomNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">Check-in Date</label>
                <input
                  type="date"
                  className={commonInputClass}
                  value={typeSpecificFields.checkInDate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, checkInDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-700 mb-1">Check-out Date</label>
                <input
                  type="date"
                  className={commonInputClass}
                  value={typeSpecificFields.checkOutDate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, checkOutDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div className="space-y-4 p-4 bg-violet-50 rounded-xl border border-violet-200">
            <h4 className="text-sm font-semibold text-violet-800 mb-3">Insurance Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">Policy Type</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="Auto Insurance"
                  value={typeSpecificFields.policyType}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, policyType: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">Coverage Amount</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="50000"
                  value={typeSpecificFields.coverageAmount}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, coverageAmount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-violet-700 mb-1">Claim Number</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="CLM-001"
                  value={typeSpecificFields.claimNumber}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, claimNumber: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'utilities':
        return (
          <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Utility Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meter Reading</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="12345"
                  value={typeSpecificFields.meterReading}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, meterReading: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usage Amount</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="150"
                  value={typeSpecificFields.usageAmount}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, usageAmount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Period</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="January 2024"
                  value={typeSpecificFields.servicePeriod}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, servicePeriod: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 'rental':
        return (
          <div className="space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-3">Rental Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Rental Period</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="1 month"
                  value={typeSpecificFields.rentalPeriod}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, rentalPeriod: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Deposit Amount</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="500"
                  value={typeSpecificFields.depositAmount}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, depositAmount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Late Fees</label>
                <input
                  type="number"
                  className={commonInputClass}
                  placeholder="25"
                  value={typeSpecificFields.lateFees}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, lateFees: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
        );

      case 'estimate':
        return (
          <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-3">Estimate Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  className={commonInputClass}
                  value={typeSpecificFields.serviceDate}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, serviceDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">Project Duration</label>
                <input
                  type="text"
                  className={commonInputClass}
                  placeholder="2-3 weeks"
                  value={typeSpecificFields.milestone}
                  onChange={(e) => setTypeSpecificFields({...typeSpecificFields, milestone: e.target.value})}
                />
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <p className="text-xs text-purple-700">
                <strong>Note:</strong> This is an estimate. Final pricing may vary based on actual work performed. 
                Client approval required before work begins.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Check form validity whenever form data changes
  useEffect(() => {
    // Form validation is handled by the other useEffect
  }, []);

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
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateInvoice = async () => {
    // Validate required fields
    if (!companyInfo.name.trim()) {
      setNotification({ type: 'error', message: 'Please enter your company name' });
      return;
    }
    
    if (!clientInfo.name.trim()) {
      setNotification({ type: 'error', message: 'Please enter client name' });
      return;
    }
    
    if (!invoiceDetails.number.trim()) {
      setNotification({ type: 'error', message: 'Please enter invoice number' });
      return;
    }
    
    if (!invoiceDetails.date) {
      setNotification({ type: 'error', message: 'Please select invoice date' });
      return;
    }
    
    // Check if at least one line item has a description and rate > 0
    const hasValidLineItem = lineItems.some(item => 
      item.description.trim() && item.rate > 0
    );
    
    if (!hasValidLineItem) {
      setNotification({ type: 'error', message: 'Please add at least one line item with description and price' });
      return;
    }
    
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
              tax_rate: taxRate,
              tax_amount: calculateTax(),
              total: calculateTotal(),
              notes: additionalOptions.notes
            };

            await sendInvoiceEmail(clientInfo.email, invoiceData);

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
          // Track anonymous user locally
          setUser(prev => ({
            ...prev,
            freeDownloadsUsed: (prev.freeDownloadsUsed || 0) + 1,
          }));
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
      currency: 'GBP',
      paymentTerms: 'net_30',
      lateFeeRate: 0,
      lateFeeAmount: 0
    });
    setLineItems([{ description: '', quantity: 1, rate: 0, total: 0 }]);
    setAdditionalOptions({ 
      taxRate: 10, 
      discount: 0, 
      notes: 'Thank you for your business.', 
      terms: '', 
      recurring: false,
      recurringFrequency: 'monthly',
      recurringDuration: '12'
    });
    setTypeSpecificFields({
      patientId: '',
      insuranceProvider: '',
      policyNumber: '',
      procedureCode: '',
      caseNumber: '',
      courtFees: 0,
      billableHours: 0,
      hourlyRate: 0,
      projectPhase: '',
      milestone: '',
      sku: '',
      inventory: '',
      shippingMethod: '',
      serviceType: '',
      serviceLocation: '',
      serviceDate: '',
      subscriptionPlan: '',
      billingCycle: 'monthly',
      equipmentId: '',
      issueDescription: '',
      warrantyInfo: '',
      courseName: '',
      instructorName: '',
      certificationNumber: '',
      propertyAddress: '',
      listingId: '',
      commissionRate: 0,
      vehicleId: '',
      route: '',
      distance: 0,
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      policyType: '',
      coverageAmount: 0,
      claimNumber: '',
      meterReading: '',
      usageAmount: 0,
      servicePeriod: '',
      rentalPeriod: '',
      depositAmount: 0,
      lateFees: 0,
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
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-100">
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/" />
          
          {/* User Status Bar */}
          <div className="bg-blue-50 border-b border-blue-200 px-10 py-3">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">{user.name}</span>
                    {!authUser && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                        Guest
                      </span>
                    )}
                  </div>
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
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoice Details
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Invoice Number</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400"                                                                                                             
                        placeholder="INV-001" 
                        type="text"
                        value={invoiceDetails.number}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, number: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Invoice Date</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800"                      
                        type="date"
                        value={invoiceDetails.date}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Due Date</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800" 
                        type="date"
                        value={invoiceDetails.dueDate}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, dueDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Currency</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800" 
                        value={invoiceDetails.currency}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, currency: e.target.value})}
                      >
                        <option value="GBP">£ GBP (British Pound)</option>
                        <option value="USD">$ USD (US Dollar)</option>
                        <option value="EUR">€ EUR (Euro)</option>
                        <option value="CAD">$ CAD (Canadian Dollar)</option>
                        <option value="AUD">$ AUD (Australian Dollar)</option>
                        <option value="JPY">¥ JPY (Japanese Yen)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Invoice Type</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800" 
                        value={invoiceType}
                        onChange={(e) => setInvoiceType(e.target.value)}
                      >
                        <option value="product_sales">Product/Sales</option>
                        <option value="freelance_consulting">Freelance/Consulting</option>
                        <option value="service_provider">Service Provider</option>
                        <option value="contractor">Contractor</option>
                        <option value="agency">Agency</option>
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="subscription">Subscription</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="repair">Repair</option>
                        <option value="installation">Installation</option>
                        <option value="training">Training</option>
                        <option value="consultation">Consultation</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="marketing">Marketing</option>
                        <option value="legal">Legal</option>
                        <option value="accounting">Accounting</option>
                        <option value="medical">Medical</option>
                        <option value="dental">Dental</option>
                        <option value="veterinary">Veterinary</option>
                        <option value="education">Education</option>
                        <option value="transportation">Transportation</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="real_estate">Real Estate</option>
                        <option value="insurance">Insurance</option>
                        <option value="utilities">Utilities</option>
                        <option value="rental">Rental</option>
                        <option value="simple_receipt">Simple Receipt</option>
                        <option value="estimate">Estimate/Quote</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Payment Terms</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800" 
                        value={invoiceDetails.paymentTerms}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, paymentTerms: e.target.value})}
                      >
                        <option value="due_on_receipt">Due on Receipt</option>
                        <option value="net_15">Net 15</option>
                        <option value="net_30">Net 30</option>
                        <option value="net_45">Net 45</option>
                        <option value="net_60">Net 60</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Tax Rate (%)</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400" 
                        placeholder="20" 
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </section>

                {/* Type-Specific Fields */}
                {renderTypeSpecificFields()}

                {/* Line Items - Only show for invoice types that need them */}
                {(invoiceType === 'product_sales' || 
                  invoiceType === 'retail' || 
                  invoiceType === 'wholesale' || 
                  invoiceType === 'maintenance' || 
                  invoiceType === 'repair' || 
                  invoiceType === 'installation' || 
                  invoiceType === 'training' || 
                  invoiceType === 'consultation' || 
                  invoiceType === 'design' || 
                  invoiceType === 'development' || 
                  invoiceType === 'marketing' || 
                  invoiceType === 'accounting' || 
                  invoiceType === 'education' || 
                  invoiceType === 'transportation' || 
                  invoiceType === 'hospitality' || 
                  invoiceType === 'real_estate' || 
                  invoiceType === 'insurance' || 
                  invoiceType === 'utilities' || 
                  invoiceType === 'rental' || 
                  invoiceType === 'estimate' || 
                  invoiceType === 'other') && (
                <section className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {invoiceType === 'estimate' ? 'Estimate Items' : 'Line Items'}
                  </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="col-span-5"><span className="text-sm font-semibold text-slate-700">Item Description</span></div>
                        <div className="col-span-2"><span className="text-sm font-semibold text-slate-700">Quantity</span></div>
                        <div className="col-span-2"><span className="text-sm font-semibold text-slate-700">Price</span></div>
                        <div className="col-span-2"><span className="text-sm font-semibold text-slate-700">Total</span></div>
                      </div>
                      {lineItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200">
                          <input 
                            className="col-span-5 px-4 py-3 rounded-lg border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400" 
                            placeholder="e.g., iPhone 15 Pro" 
                            type="text"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          />
                          <input 
                            className="col-span-2 px-4 py-3 rounded-lg border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400" 
                            placeholder="1" 
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                          />
                          <input 
                            className="col-span-2 px-4 py-3 rounded-lg border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400" 
                            placeholder="999" 
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                          />
                          <span className="col-span-2 text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg">{invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{item.total.toFixed(2)}</span>
                          <button 
                            onClick={() => removeLineItem(index)}
                            className="col-span-1 text-slate-400 hover:text-red-500 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-red-50"
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path clipRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" fillRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    <button 
                      onClick={addLineItem}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {invoiceType === 'estimate' ? 'Add Estimate Item' : 'Add Line Item'}
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
                          <span className="col-span-2 text-sm text-slate-800">{invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{item.total.toFixed(2)}</span>
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
                            <span className="text-sm text-slate-800 font-medium">
                              {invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{calculateSubtotal().toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-700">Tax ({taxRate}%)</span>
                            <span className="text-sm text-slate-800 font-medium">
                              {invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{((calculateSubtotal() * taxRate) / 100).toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t border-gray-300/80 my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-lg font-bold text-slate-900">
                              {invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{calculateTotal().toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Payment Options</h3>
                  
                  {/* Payment Terms Display */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Payment Terms</h4>
                    <p className="text-sm text-blue-700">
                      {invoiceDetails.paymentTerms === 'due_on_receipt' && 'Payment is due immediately upon receipt of this invoice.'}
                      {invoiceDetails.paymentTerms === 'net_15' && 'Payment is due within 15 days of the invoice date.'}
                      {invoiceDetails.paymentTerms === 'net_30' && 'Payment is due within 30 days of the invoice date.'}
                      {invoiceDetails.paymentTerms === 'net_45' && 'Payment is due within 45 days of the invoice date.'}
                      {invoiceDetails.paymentTerms === 'net_60' && 'Payment is due within 60 days of the invoice date.'}
                      {invoiceDetails.paymentTerms === 'custom' && 'Custom payment terms apply.'}
                    </p>
                    {invoiceDetails.dueDate && (
                      <p className="text-sm font-medium text-blue-800 mt-1">
                        Due Date: {new Date(invoiceDetails.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Late Payment Fees */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">Late Payment Fees</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Late Fee Rate (%)</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="1.5"
                          min="0"
                          step="0.1"
                          value={invoiceDetails.lateFeeRate}
                          onChange={(e) => setInvoiceDetails({...invoiceDetails, lateFeeRate: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Fixed Late Fee Amount</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="25.00"
                          min="0"
                          step="0.01"
                          value={invoiceDetails.lateFeeAmount}
                          onChange={(e) => setInvoiceDetails({...invoiceDetails, lateFeeAmount: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Late fees will be applied to overdue invoices. Choose either a percentage rate or fixed amount.
                    </p>
                  </div>

                  {/* Email Reminders (Optional) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">Email Reminders</h4>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-sm text-slate-600">Off</span>
                        <div className="relative" onClick={() => setEmailRemindersEnabled(!emailRemindersEnabled)}>
                          <input className="sr-only" type="checkbox" checked={emailRemindersEnabled} readOnly />
                          <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${emailRemindersEnabled ? 'translate-x-full !bg-primary' : ''}`}></div>
                        </div>
                        <span className="text-sm text-slate-600">On</span>
                      </label>
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Send reminder 3 days before due date</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Send reminder 1 day after due date</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-700">Send reminder 7 days after due date</span>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Optional email notifications sent to client email addresses. No payment processing involved.
                    </p>
                  </div>

                  {/* Online Payment Methods (Optional) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-700">Online Payment Methods</h4>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-sm text-slate-600">Off</span>
                        <div className="relative" onClick={() => setOnlinePaymentEnabled(!onlinePaymentEnabled)}>
                          <input className="sr-only" type="checkbox" checked={onlinePaymentEnabled} readOnly />
                          <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${onlinePaymentEnabled ? 'translate-x-full !bg-primary' : ''}`}></div>
                        </div>
                        <span className="text-sm text-slate-600">On</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedPaymentMethods.visa}
                          onChange={(e) => setSelectedPaymentMethods({...selectedPaymentMethods, visa: e.target.checked})}
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                          <span className="text-sm text-slate-700">Visa</span>
                        </div>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedPaymentMethods.mastercard}
                          onChange={(e) => setSelectedPaymentMethods({...selectedPaymentMethods, mastercard: e.target.checked})}
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                          <span className="text-sm text-slate-700">Mastercard</span>
                        </div>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedPaymentMethods.amex}
                          onChange={(e) => setSelectedPaymentMethods({...selectedPaymentMethods, amex: e.target.checked})}
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                          <span className="text-sm text-slate-700">Amex</span>
                        </div>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedPaymentMethods.paypal}
                          onChange={(e) => setSelectedPaymentMethods({...selectedPaymentMethods, paypal: e.target.checked})}
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                          <span className="text-sm text-slate-700">PayPal</span>
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Selected payment methods will be displayed on the invoice for client reference only.
                    </p>
                  </div>

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
                  </div>
                  
                  {additionalOptions.recurring && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">Recurring Settings</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Frequency</label>
                          <select 
                            className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={additionalOptions.recurringFrequency}
                            onChange={(e) => setAdditionalOptions({...additionalOptions, recurringFrequency: e.target.value})}
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Duration</label>
                          <select 
                            className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={additionalOptions.recurringDuration}
                            onChange={(e) => setAdditionalOptions({...additionalOptions, recurringDuration: e.target.value})}
                          >
                            <option value="3">3 times</option>
                            <option value="6">6 times</option>
                            <option value="12">12 times</option>
                            <option value="indefinite">Indefinite</option>
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">Recurring invoices will be automatically generated and sent to your client.</p>
                    </div>
                  )}
                </section>

                {/* Time Tracking Section */}
                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Time Tracking</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-700">Track Time for This Project</h4>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Timer
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Project Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Website Development"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Hourly Rate</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="75.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Total Hours</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="0.00"
                          step="0.25"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                      <span>Time entries will be automatically added to line items</span>
                      <span className="font-medium">Total: £0.00</span>
                    </div>
                  </div>
                </section>

                {/* Expense Tracking Section */}
                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Expense Tracking</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-700">Track Expenses for This Project</h4>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Expense
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Expense Type</label>
                          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">Select Type</option>
                            <option value="travel">Travel</option>
                            <option value="meals">Meals</option>
                            <option value="supplies">Supplies</option>
                            <option value="software">Software</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Client lunch meeting"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="25.50"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Receipt</label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Expenses will be added to line items for reimbursement</span>
                        <span className="font-medium">Total Expenses: £0.00</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-white/50">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Additional Notes</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none" 
                      placeholder="Thank you for your business." 
                      rows={3}
                      value={additionalOptions.notes}
                      onChange={(e) => setAdditionalOptions({...additionalOptions, notes: e.target.value})}
                    ></textarea>
                  </div>
                </section>

                {/* Business Analytics & Reporting */}
                {/* Client Portal */}
                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Client Access</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-700">Enable Client Access</h4>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-sm text-slate-600">Off</span>
                        <div className="relative" onClick={() => setClientAccessEnabled(!clientAccessEnabled)}>
                          <input className="sr-only" type="checkbox" checked={clientAccessEnabled} readOnly />
                          <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${clientAccessEnabled ? 'translate-x-full !bg-primary' : ''}`}></div>
                        </div>
                        <span className="text-sm text-slate-600">On</span>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Access URL</label>
                        <input type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="yourcompany.stitchesx.com" />
                      </div>
                      <p className="text-xs text-slate-500">Clients can view and download their invoices. Simple and secure.</p>
                    </div>
                  </div>
                </section>


                {/* Document Analytics (Non-Financial) */}
                <section className="space-y-4 pt-4 border-t border-white/50">
                  <h3 className="text-lg font-semibold text-slate-800">Document Analytics</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-sm text-slate-600">Invoices Created</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-sm text-slate-600">PDF Downloads</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-2xl font-bold text-orange-600">0</div>
                        <div className="text-sm text-slate-600">Templates Used</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Document History
                      </button>
                    </div>
                  </div>
                </section>

                <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
                  <button 
                    onClick={generateInvoice}
                    disabled={isGenerating}
                    className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : (invoiceType === 'estimate' ? 'Generate Estimate' : 'Generate Invoice')}
                  </button>
                  {invoiceType !== 'estimate' && (
                    <>
                      <button 
                        className={`w-full rounded-lg px-6 py-3 text-sm font-bold shadow-lg sm:w-auto btn-hover-effect ${isFormValid ? 'btn-glass-enabled text-slate-800' : 'btn-disabled'}`}
                        disabled={!isFormValid}
                        onClick={handlePayment}
                        title="Click to pay and download invoice"
                      >
                        Pay & Download Invoice
                      </button>
                      <button 
                        className="w-full rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-lg sm:w-auto btn-hover-effect transition-colors"
                        disabled={!isFormValid}
                        onClick={() => {
                          // This would generate an invoice with "Pay Now" button
                          generateInvoice();
                          setNotification({ type: 'success', message: 'Invoice generated with online payment options!' });
                        }}
                        title="Generate invoice with online payment button"
                      >
                        Generate with Pay Now Button
                      </button>
                    </>
                  )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

                {/* Per-Invoice Plan */}
                <div className="glass-effect rounded-2xl p-8 text-center border-2 border-green-500 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Pay Per Use</span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Per-Invoice</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">£2.99</div>
                    <p className="text-gray-600">Pay only when you use</p>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">£2.99 per invoice download</span>
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
                      <span className="text-gray-700">All invoice types</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-gray-700">Email support</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Pay Per Invoice
                  </button>
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
                    <span className="font-semibold">{invoiceDetails.currency === 'GBP' ? '£' : invoiceDetails.currency === 'USD' ? '$' : invoiceDetails.currency === 'EUR' ? '€' : invoiceDetails.currency === 'JPY' ? '¥' : '$'}{generatedInvoice.total.toFixed(2)}</span>
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
