import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '•••• •••• •••• 1234',
    expiryDate: 'MM / YY',
    cvc: '•••',
    nameOnCard: 'John Doe'
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      features: [
        'Unlimited invoices',
        'Basic reporting',
        '1 user'
      ],
      current: false,
      recommended: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 10,
      period: 'month',
      features: [
        'Unlimited invoices',
        'Advanced reporting',
        '5 users',
        'Priority support'
      ],
      current: true,
      recommended: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      period: 'month',
      features: [
        'Unlimited invoices',
        'Advanced reporting',
        'Unlimited users',
        'Dedicated support',
        'Custom branding'
      ],
      current: false,
      recommended: false
    }
  ];

  const handlePlanChange = (planId: string) => {
    if (planId !== currentPlan) {
      setCurrentPlan(planId);
      // In a real app, this would trigger a plan change API call
      alert(`Plan changed to ${plans.find(p => p.id === planId)?.name}`);
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      alert('Subscription cancellation would be processed here');
    }
  };

  const handleUpdatePayment = () => {
    alert('Payment information would be updated here');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>Subscription - Stitches</title>
        <meta name="description" content="Manage your subscription and billing information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-3">
            <Link href="/" className="flex items-center gap-4 text-gray-800">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">Stitches</h2>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal">Dashboard</Link>
              <Link href="/invoices" className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal">Invoices</Link>
              <Link href="/clients" className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal">Customers</Link>
              <Link href="/reporting" className="text-gray-600 hover:text-gray-900 text-sm font-medium leading-normal">Reports</Link>
              <Link href="/subscription" className="text-gray-900 text-sm font-semibold leading-normal">Settings</Link>
            </div>
            <div className="flex flex-1 justify-end gap-4">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200 text-gray-700">
                <span className="material-symbols-outlined text-xl">help</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDp-Mi812tctyeSjHYi8qrswNLo_QP0h-eacu5z1Vc6IZPBOzUpfFWhEJo66N_kqUgefI4tz-8cXUFQWvBOeHySmvAWxmbMqZCel_EvgR0_Q1XA6XBDkfgfxDnu5aw-uNGoXOSwZh7tgN9cyyidNoYk3GXaz1mG1Zk01ZswTiS-nEBg4fwm9FdXJVcx0iuaXc--2ZxUzE1shPTqubwD5wr7-zZx2QN3KMvlj8m-bbbaTAHx6ABL-G0uwBoJaTeS2O6mKeuZL-vycQE")'}}></div>
            </div>
          </header>

          <div className="px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-8">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">Subscription</h1>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCancelSubscription}
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    Cancel Subscription
                  </button>
                  <button 
                    onClick={() => alert('Change plan functionality would be implemented here')}
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-medium"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              <div className="bg-white/50 border border-gray-200/50 rounded-2xl p-8 backdrop-blur-lg">
                <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight mb-6">Current Plan</h2>
                <div className="flex items-start justify-between gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-500 text-sm font-normal leading-normal">Your plan</p>
                    <p className="text-gray-900 text-lg font-semibold leading-tight">Pro Plan</p>
                    <p className="text-gray-500 text-sm font-normal leading-normal">Billed annually on May 1, 2024</p>
                    <a className="text-primary hover:text-blue-700 text-sm font-medium mt-2" href="#" onClick={(e) => { e.preventDefault(); alert('Invoice history would be shown here'); }}>
                      View invoice history
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-900 text-4xl font-bold tracking-tighter">$120</p>
                      <p className="text-gray-500 text-sm">per year</p>
                    </div>
                    <div className="w-32 h-20 bg-center bg-no-repeat bg-contain rounded-lg" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjKFXiOKaclc-JT9TL2ccyRhcA6nl_PrPu_a1D0TuhQ6RBjtnxKalAv6FyeFqd2qcyt4MfFuIv6SFWJqiVgPnT9T3Gq5xDX19xuIvx-3pthrvftsm696i4Mu31N4iWomuIt7Ul-PjkTWoKpqVVV0Wqv4lNfGj8O8RrE9ShJP2XTgEOGTc83DQiAUWUFBuZYg5rTRIAzlQZ8UxUqyq65F-hcq4Bkr_-JoeEqHBCXa5ZWZxdKveFNDyZncmdfE_-omPxuGeT3Iu8hq8")'}}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight">Upgrade or Downgrade</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`flex flex-col gap-6 rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-shadow ${
                        plan.current 
                          ? 'border-primary bg-blue-50' 
                          : 'border-gray-200/80 bg-white'
                      }`}
                    >
                      <div className="flex-grow space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-semibold leading-tight ${
                            plan.current ? 'text-blue-800' : 'text-gray-900'
                          }`}>
                            {plan.name}
                          </h3>
                          {plan.recommended && (
                            <p className="text-blue-700 text-xs font-semibold leading-normal tracking-wide rounded-full bg-blue-200 px-3 py-1">
                              Recommended
                            </p>
                          )}
                        </div>
                        <p className="flex items-baseline gap-1 text-gray-900">
                          <span className="text-gray-900 text-4xl font-bold leading-tight tracking-tighter">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 text-sm font-medium">/{plan.period}</span>
                        </p>
                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex gap-3 text-sm text-gray-700 items-center">
                              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePlanChange(plan.id)}
                        className={`w-full flex items-center justify-center rounded-lg h-10 px-4 text-sm font-medium ${
                          plan.current
                            ? 'bg-primary hover:bg-blue-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {plan.current ? 'Current Plan' : 'Select Plan'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-sm">
                <h2 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight mb-6">Payment Information</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="card-number">Card Number</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                      <input 
                        className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary h-12 pl-10 placeholder:text-gray-400 text-sm" 
                        id="card-number" 
                        name="cardNumber"
                        placeholder="•••• •••• •••• 1234"
                        value={paymentInfo.cardNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="expiry-date">Expiry Date</label>
                      <input 
                        className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary h-12 placeholder:text-gray-400 text-sm" 
                        id="expiry-date" 
                        name="expiryDate"
                        placeholder="MM / YY"
                        value={paymentInfo.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="cvc">CVC</label>
                      <input 
                        className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary h-12 placeholder:text-gray-400 text-sm" 
                        id="cvc" 
                        name="cvc"
                        placeholder="•••"
                        value={paymentInfo.cvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium pb-2" htmlFor="name-on-card">Name on Card</label>
                    <input 
                      className="form-input w-full rounded-lg border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary h-12 placeholder:text-gray-400 text-sm" 
                      id="name-on-card" 
                      name="nameOnCard"
                      placeholder="John Doe"
                      value={paymentInfo.nameOnCard}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleUpdatePayment}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-medium"
                    >
                      <span className="truncate">Update Payment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
