import { useState, useEffect } from 'react';
import Head from 'next/head';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonText,
  onButtonClick
}: NotificationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/10 p-4 font-sans backdrop-blur-sm">
        <div className={`${type === 'success' ? 'success-accent' : 'error-accent'} relative w-full max-w-sm overflow-hidden rounded-xl bg-white/80 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="p-8 text-center">
            <span className={`material-symbols-outlined text-5xl text-[var(--accent-color)]`}>
              {type === 'success' ? 'check_circle' : 'error'}
            </span>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-gray-600">
              {message}
            </p>
            <div className="mt-8">
              <button 
                onClick={handleButtonClick}
                className="w-full cursor-pointer rounded-lg bg-[var(--accent-color)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 transition-all duration-200"
              >
                {buttonText || (type === 'success' ? 'OK' : 'Dismiss')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
