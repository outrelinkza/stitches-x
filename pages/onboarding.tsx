import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const steps = [
    {
      id: 1,
      title: "Welcome to StitchesX",
      description: "Let's get you started with creating your first invoice. This quick tour will guide you through the basics.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      icon: "📊"
    },
    {
      id: 2,
      title: "Create Professional Invoices",
      description: "Design beautiful, professional invoices with our easy-to-use template system. Customize colors, fonts, and layouts to match your brand.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Smart Invoice Generation",
      description: "Create invoices in seconds with our intelligent form system. Just fill in the details and watch your professional invoice come to life.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
      icon: "⚡"
    },
    {
      id: 4,
      title: "Track & Manage Everything",
      description: "Keep track of all your invoices, clients, and payments in one place. Get insights with our analytics dashboard and never miss a payment.",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      icon: "📈"
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep) || steps[0];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Welcome to StitchesX - Onboarding</title>
        <meta name="description" content="Get started with StitchesX - your professional invoice management platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{backgroundColor: '#f9fafb', fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap px-10 py-4">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="tracking-tight">StitchesX</h2>
            </Link>
            <div className="flex items-center gap-4">
              <button className="grid size-10 place-content-center rounded-full transition-colors hover:bg-gray-100">
                <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                </svg>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDS-JMHlH0QMAoersJX7x7XGksa_ye3MIflLq1bubMGhfaH5PHrwJcwNjwRbr6GBM16YVc9KNSECUMx1Lq8tIsB-UEwIhkqsGWn5WHDWPXzAuvgcdWFWTzVQNUIyoiuswEc8px33U4Q9bqTwGmVz_QX4eCWFecXT5IB3a5SbkIeKvY5oh_PV1r_rBljG4DboUzSS-dxpZXiBJ6nzvlGpqAUp5d4_lGPH_rMiMy1ENrrIb85krogD3DUE7SORwa44sMrLRl7Atdg7lc")'}}></div>
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-2xl rounded-2xl border border-gray-200/80 bg-white/60 p-8 shadow-2xl shadow-gray-600/10 backdrop-blur-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-bounce">{currentStepData.icon}</div>
                <h1 className="text-3xl font-bold tracking-tighter text-gray-900 mb-4">{currentStepData.title}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{currentStepData.description}</p>
              </div>
              
              <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out transform hover:scale-105" 
                  style={{backgroundImage: `url("${currentStepData.image}")`}}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Progress indicators */}
              <div className="mt-8 flex justify-center gap-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-4 h-4 rounded-full transition-all duration-500 cursor-pointer ${
                      step.id === currentStep
                        ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-600/50'
                        : step.id < currentStep
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  />
                ))}
              </div>

              {/* Step counter */}
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </span>
              </div>

              <div className="mt-8 flex justify-between gap-4">
                {currentStep > 1 ? (
                  <button 
                    onClick={handlePrevious}
                    className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:scale-105"
                  >
                    ← Previous
                  </button>
                ) : (
                  <button 
                    onClick={handleSkip}
                    className="flex-1 rounded-lg bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:scale-105"
                  >
                    Skip Tour
                  </button>
                )}
                
                <button 
                  onClick={handleNext}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {currentStep === steps.length ? '🚀 Get Started' : 'Next →'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
