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
      title: "Welcome to Stitches",
      description: "Let's get you started with creating your first invoice. This quick tour will guide you through the basics.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp6UHwVsTPqJSdaIKUQPViZ8pVoosVd8BsYPUxUDuqQZEMiTbdyk6W4kI3EqhfMt6kmkucIzoLPuEdg67Ko6YoDGiewwjPuNirFvSr2Cuaj5cSFWXcGSa6qKQYNMAZ5YXS9pm3loYh7GO4TOk0hHAp_43bpbn7854MA4XVxXcAqNo3DhtuEoPS78vXbpsx7JRsDQzutqizk--UqPyD12WTB9fzJuxWYLUFKxiVSmOBcu7Rpx_HHMd2VOwaiHQAsK3h1UXPjFUmVo"
    },
    {
      id: 2,
      title: "Create Professional Invoices",
      description: "Design beautiful, professional invoices with our easy-to-use template system. Customize colors, fonts, and layouts to match your brand.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp6UHwVsTPqJSdaIKUQPViZ8pVoosVd8BsYPUxUDuqQZEMiTbdyk6W4kI3EqhfMt6kmkucIzoLPuEdg67Ko6YoDGiewwjPuNirFvSr2Cuaj5cSFWXcGSa6qKQYNMAZ5YXS9pm3loYh7GO4TOk0hHAp_43bpbn7854MA4XVxXcAqNo3DhtuEoPS78vXbpsx7JRsDQzutqizk--UqPyD12WTB9fzJuxWYLUFKxiVSmOBcu7Rpx_HHMd2VOwaiHQAsK3h1UXPjFUmVo"
    },
    {
      id: 3,
      title: "AI-Powered Invoice Generation",
      description: "Use our AI chat feature to create invoices naturally. Just describe what you need, and our AI will generate a professional invoice for you.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp6UHwVsTPqJSdaIKUQPViZ8pVoosVd8BsYPUxUDuqQZEMiTbdyk6W4kI3EqhfMt6kmkucIzoLPuEdg67Ko6YoDGiewwjPuNirFvSr2Cuaj5cSFWXcGSa6qKQYNMAZ5YXS9pm3loYh7GO4TOk0hHAp_43bpbn7854MA4XVxXcAqNo3DhtuEoPS78vXbpsx7JRsDQzutqizk--UqPyD12WTB9fzJuxWYLUFKxiVSmOBcu7Rpx_HHMd2VOwaiHQAsK3h1UXPjFUmVo"
    },
    {
      id: 4,
      title: "Track & Manage Everything",
      description: "Keep track of all your invoices, clients, and payments in one place. Get insights with our analytics dashboard and never miss a payment.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAp6UHwVsTPqJSdaIKUQPViZ8pVoosVd8BsYPUxUDuqQZEMiTbdyk6W4kI3EqhfMt6kmkucIzoLPuEdg67Ko6YoDGiewwjPuNirFvSr2Cuaj5cSFWXcGSa6qKQYNMAZ5YXS9pm3loYh7GO4TOk0hHAp_43bpbn7854MA4XVxXcAqNo3DhtuEoPS78vXbpsx7JRsDQzutqizk--UqPyD12WTB9fzJuxWYLUFKxiVSmOBcu7Rpx_HHMd2VOwaiHQAsK3h1UXPjFUmVo"
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
        <title>Welcome to Stitches - Onboarding</title>
        <meta name="description" content="Get started with Stitches - your professional invoice management platform" />
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
              <h2 className="tracking-tight">Stitches</h2>
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
            <div className="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white/60 p-8 shadow-2xl shadow-gray-600/10 backdrop-blur-lg">
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tighter">{currentStepData.title}</h1>
                <p className="mt-2 text-gray-500">{currentStepData.description}</p>
              </div>
              
              <div className="relative mt-8 aspect-[4/3] w-full">
                <div className="absolute inset-0 rounded-2xl bg-cover bg-center bg-no-repeat shadow-inner" style={{backgroundImage: `url("${currentStepData.image}")`}}></div>
              </div>

              {/* Progress indicators */}
              <div className="mt-6 flex justify-center gap-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      step.id === currentStep ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-between gap-4">
                {currentStep > 1 ? (
                  <button 
                    onClick={handlePrevious}
                    className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200/80"
                  >
                    Previous
                  </button>
                ) : (
                  <button 
                    onClick={handleSkip}
                    className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200/80"
                  >
                    Skip
                  </button>
                )}
                
                <button 
                  onClick={handleNext}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  {currentStep === steps.length ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
