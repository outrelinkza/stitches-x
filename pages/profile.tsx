import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '(123) 456-7890',
    password: '••••••••••••',
    timezone: '(UTC-08:00) Pacific Time',
    plan: 'Pro',
    billingCycle: 'Yearly',
    paymentMethod: 'Credit Card'
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      lastFour: '1234',
      expiry: '06/2025',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMxiXoQnZNdoKgprc7wpAZ-YiHxAI5W5ga7f5eM3F8AL0FToMOgq3lM-8d_AF3GIxOXMLw9O3FtODowX2aGsoNL6B_PzcZKCkEFKIq46NkrQ-xJrTq8vOpSL7_k3xud2xecWxgKGiI-oTXIjx4_6REpd83q-UYk5M9wtJLEiHGuvdCZcgKF9qGyY41duuYeHmRSbQImfgij5-IuVbl9BioxT0NDOCbtjL-_JYuyX2JEcL4AN2-G6nG7oIOjfknHJieRNRZBfKEL2A'
    },
    {
      id: '2',
      type: 'Mastercard',
      lastFour: '5678',
      expiry: '08/2026',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmXIjBnaQFURYc20B0Vjdryn3kxW9rah7HVTJvS-mv4xMFe4E34h70WFhHUx70l593ehYpIVPuaAsEjH7kBFeZdiOY5MK_I5hExFOGnWbj_iDO2ZAlCkLTwK-DsjkfSlkahYUR94i8xaouI2H_62Tq-QZSCzdO3zgYOWELlfJCBXrWFDxiMHDfe5ioR7aqs39A9v_-FGyA8LcVg36axptM1LHg60q7c1AARE2GcJalmU2j-lSe7-vD2TLKYXefDSq8xQox7fzFrZc'
    }
  ]);

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the profile data to your backend
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '(123) 456-7890',
      password: '••••••••••••',
      timezone: '(UTC-08:00) Pacific Time',
      plan: 'Pro',
      billingCycle: 'Yearly',
      paymentMethod: 'Credit Card'
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddPaymentMethod = () => {
    // In a real app, this would open a modal or navigate to add payment method page
    alert('Add payment method functionality would be implemented here');
  };

  const handleEditPaymentMethod = (methodId: string) => {
    // In a real app, this would open an edit modal
    alert(`Edit payment method functionality would be implemented here for method ID: ${methodId}`);
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
    }
  };

  return (
    <>
      <Head>
        <title>Profile Management - Stitches</title>
        <meta name="description" content="Manage your personal information, account settings, and payment methods" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-900" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/profile" />

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl w-full">
              <div className="mx-auto max-w-2xl">
                <div className="mb-10">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Profile Management</h1>
                  <p className="mt-3 text-lg text-gray-600">Manage your personal information, account settings, and payment methods.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <section>
                    <h2 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-4">Personal Information</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="fullName">Full Name</label>
                        <div className="mt-2">
                          <input 
                            autoComplete="name" 
                            className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                            id="fullName" 
                            name="fullName" 
                            placeholder="John Doe" 
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="email">Email Address</label>
                        <div className="mt-2">
                          <input 
                            autoComplete="email" 
                            className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                            id="email" 
                            name="email" 
                            placeholder="john.doe@example.com" 
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="phoneNumber">Phone Number</label>
                        <div className="mt-2">
                          <input 
                            autoComplete="tel" 
                            className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            placeholder="(123) 456-7890" 
                            type="text"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold leading-7 text-gray-900 border-b border-gray-200 pb-4">Account Settings</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="password">Password</label>
                        <div className="mt-2 relative">
                          <input 
                            className="block w-full rounded-lg border-0 bg-white py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                            id="password" 
                            name="password" 
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button 
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          >
                            <span className="material-symbols-outlined text-xl">
                              {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="timezone">Time Zone</label>
                        <div className="mt-2">
                          <select 
                            className="block w-full rounded-lg border-0 bg-white py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                            id="timezone" 
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                          >
                            <option value="(UTC-08:00) Pacific Time">(UTC-08:00) Pacific Time</option>
                            <option value="(UTC-07:00) Mountain Time">(UTC-07:00) Mountain Time</option>
                            <option value="(UTC-06:00) Central Time">(UTC-06:00) Central Time</option>
                            <option value="(UTC-05:00) Eastern Time">(UTC-05:00) Eastern Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <h2 className="text-xl font-semibold leading-7 text-gray-900">Payment Method Management</h2>
                      <button 
                        type="button"
                        onClick={handleAddPaymentMethod}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <span className="material-symbols-outlined text-xl">add</span>
                        Add Method
                      </button>
                    </div>
                    <div className="mt-6 space-y-6">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white/50 p-4 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center gap-4">
                            <img alt={method.type} className="h-8 w-auto" src={method.image} />
                            <div>
                              <p className="font-semibold text-gray-900">{method.type} ending in {method.lastFour}</p>
                              <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => handleEditPaymentMethod(method.id)}
                              className="text-sm font-medium text-primary hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="mt-12 flex items-center justify-end gap-x-6 border-t border-gray-200 pt-6">
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
