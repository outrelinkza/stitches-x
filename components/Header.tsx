import Link from 'next/link';
import Navigation from './Navigation';

interface HeaderProps {
  currentPage?: string;
  showNewInvoiceButton?: boolean;
  className?: string;
}

export default function Header({ 
  currentPage, 
  showNewInvoiceButton = true, 
  className = "" 
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-20 glass-effect border-b border-gray-200/60 ${className}`}>
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 bg-black text-white rounded-lg">
              <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-semibold leading-tight">Stitches</h2>
          </Link>
        </div>
        
        <Navigation currentPage={currentPage} className="hidden md:flex" />
        
        <div className="flex items-center gap-4">
          {showNewInvoiceButton && (
            <Link 
              href="/" 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[var(--primary-color)] text-white text-sm font-semibold tracking-[-0.01em] hover:bg-blue-600 transition-colors"
            >
              <span className="truncate">New Invoice</span>
            </Link>
          )}
          
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuBtV06ee4gPlI-hLtZdww17YnF8Vk7ntc3DP3lNAAJ5_r29yvac2v1w1yR-OlUGxfJDxFHwemReQE5mPFvDWPlMrc3R61fHJW3gte1bMaCBb_Juh2TJ5u4YqU89wmU03AFcT7wdW2qHN0V-apOpWfVyGw5Nrbh2rgiZVfqjrkfI0mqKTh7VYBA9aK9rCQKYDq0NA2uwV0dX1OteMyX9cLuEq8adU-UIfVRPB6ymvNFQpwlD25tjS0mKiEneNYUqlrYZ06s-3R24Y")'}}></div>
        </div>
      </div>
    </header>
  );
}
