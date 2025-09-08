import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Contact Support - Stitches</title>
        <meta name="description" content="Get help and support for your Stitches invoice management needs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50 text-gray-900" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <Header currentPage="/support" />

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl w-full">
              <div className="grid md:grid-cols-2 gap-16">
                <div className="flex flex-col">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Contact Support</h1>
                    <p className="mt-4 text-lg text-gray-600">We're here to help you with any questions or issues. Fill out the form below, and we'll get back to you as soon as possible.</p>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-full size-12 bg-blue-100">
                        <span className="material-symbols-outlined text-blue-600 text-2xl">email</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                        <p className="text-gray-600">Send us an email and we'll respond within 24 hours.</p>
                        <a href="mailto:support@stitches.com" className="text-blue-600 hover:text-blue-700 font-medium">support@stitches.com</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-full size-12 bg-green-100">
                        <span className="material-symbols-outlined text-green-600 text-2xl">help_center</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Help Center</h3>
                        <p className="text-gray-600">Browse our knowledge base for quick answers.</p>
                        <Link href="/help" className="text-blue-600 hover:text-blue-700 font-medium">Visit Help Center</Link>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center rounded-full size-12 bg-purple-100">
                        <span className="material-symbols-outlined text-purple-600 text-2xl">chat</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Live Chat</h3>
                        <p className="text-gray-600">Chat with our support team in real-time.</p>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">Start Chat</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-effect rounded-2xl p-8 bg-white/60 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 resize-none"
                        placeholder="Describe your issue or question..."
                        required
                      />
                    </div>
                    <div>
                      <button 
                        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors" 
                        type="submit"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
