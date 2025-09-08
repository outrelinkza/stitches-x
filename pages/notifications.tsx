import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'error',
      icon: 'error',
      title: 'Invoice #12345 Overdue',
      message: 'This invoice is now 5 days overdue. Please follow up with the client.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      icon: 'check_circle',
      title: 'Payment Received',
      message: 'Payment of $500 received for Invoice #67890 from Acme Inc.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 3,
      type: 'info',
      icon: 'send',
      title: 'Invoice Sent',
      message: 'Invoice #101112 has been successfully sent to the client.',
      time: '3 days ago',
      unread: false
    },
    {
      id: 4,
      type: 'error',
      icon: 'error',
      title: 'Invoice #131415 Overdue',
      message: 'This invoice is now 2 days overdue.',
      time: '5 days ago',
      unread: true
    },
    {
      id: 5,
      type: 'success',
      icon: 'check_circle',
      title: 'Payment Received',
      message: 'Payment of $750 received for Invoice #161718.',
      time: '1 week ago',
      unread: false
    },
    {
      id: 6,
      type: 'info',
      icon: 'send',
      title: 'Invoice Sent',
      message: 'Invoice #192021 has been sent to the client.',
      time: '2 weeks ago',
      unread: false
    }
  ]);

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600'
        };
      case 'success':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600'
        };
    }
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, unread: false }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <Head>
        <title>Notifications - Stitches</title>
        <meta name="description" content="Manage your invoice-related alerts and updates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{backgroundColor: '#f8f9fa', fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 sticky top-0 z-10 glass-effect">
            <Link href="/" className="flex items-center gap-4 text-black">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-xl font-bold tracking-tight">Stitches</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <Link href="/invoices" className="text-gray-900 font-semibold">Invoices</Link>
              <Link href="/estimates" className="hover:text-gray-900 transition-colors">Estimates</Link>
              <Link href="/clients" className="hover:text-gray-900 transition-colors">Clients</Link>
              <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
              <Link href="/reporting" className="hover:text-gray-900 transition-colors">Reporting</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors relative">
                <span className="material-symbols-outlined text-2xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-2xl">help</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAYAjCAQZKwG-4K3qOlxW_OaX43vHf4viEO6X4jPr-cM1zyKUFXotTBqJRheXu28LIXYxPt6lIyIOSDBsiTwIivko6CmipImWiBZtAknoHTzPrz5FJitZy2erpwsh5gnv9ej8E--Adym0QgYaLX2Os8vgWhD-Yf_FQeac38Rp09FzB5KS7TAywFkJ2sw_KUB1Y8sxwDgKCFQ2GXTZeosmA78dp4-wN-R2aVc_mTZ_G6ltPiq1US8nI5_B4qrXoyWIK2_x2aMlMVAPo")'}}></div>
            </div>
          </header>

          <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">Notifications</h1>
                  <p className="mt-2 text-gray-500">Manage your invoice-related alerts and updates.</p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-sm font-medium text-primary hover:text-blue-700 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="glass-effect shadow-lg rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => {
                    const styles = getNotificationStyles(notification.type);
                    return (
                      <div 
                        key={notification.id}
                        className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className={`flex items-center justify-center rounded-full ${styles.bg} shrink-0 size-10 text-${notification.type === 'error' ? 'red' : notification.type === 'success' ? 'green' : 'blue'}-600 mt-1`}>
                          <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-semibold">{notification.title}</p>
                          <p className="text-gray-500 text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary self-center"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
