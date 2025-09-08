import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us - StitchesX</title>
        <meta name="description" content="Get in touch with StitchesX support team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header currentPage="contact" showNewInvoiceButton={false} />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-900">Contact Us</span>
              </div>
            </nav>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about StitchesX? We're here to help! Send us a message and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="glass-effect rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-green-600 text-2xl">check</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">email</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Support</h3>
                        <p className="text-gray-600">support@stitchesx.com</p>
                        <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">schedule</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Business Hours</h3>
                        <p className="text-gray-600">Monday - Friday</p>
                        <p className="text-gray-600">9:00 AM - 6:00 PM PST</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">help</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Help Center</h3>
                        <p className="text-gray-600">Check our FAQ for quick answers</p>
                        <Link href="/" className="text-primary hover:text-blue-600 transition-colors text-sm">
                          Visit Help Center →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">How do I create an invoice?</h3>
                      <p className="text-gray-600 text-sm">Simply fill out the form on our homepage with your business and client information, add line items, and generate your professional invoice.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Is StitchesX free to use?</h3>
                      <p className="text-gray-600 text-sm">Yes! We offer free invoice generation with premium features available for advanced users.</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">Can I customize my invoices?</h3>
                      <p className="text-gray-600 text-sm">Absolutely! You can add your logo, choose from different templates, and customize colors and fonts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-auto py-8 px-10">
          <div className="container mx-auto text-center text-sm text-slate-500">
            <div className="flex justify-center items-center space-x-6">
              <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-slate-800 transition-colors">Contact Us</Link>
            </div>
            <p className="mt-4">© 2025 StitchesX. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
