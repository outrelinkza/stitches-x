import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationProps {
  currentPage?: string;
  className?: string;
}

export default function Navigation({ currentPage, className = "" }: NavigationProps) {
  const router = useRouter();
  
  // Standardized navigation items in consistent order
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/invoices', label: 'Invoices', icon: 'description' },
    { href: '/clients', label: 'Clients', icon: 'people' },
    { href: '/templates', label: 'Templates', icon: 'space_dashboard' },
    { href: '/settings', label: 'Settings', icon: 'settings' },
    { href: '/support', label: 'Support', icon: 'help' },
    { href: '/profile', label: 'Profile', icon: 'person' }
  ];

  // Determine current page from router if not provided
  const activePage = currentPage || router.pathname;

  return (
    <nav className={`flex items-center gap-6 text-sm font-medium text-gray-600 ${className}`}>
      {navItems.map((item) => {
        const isActive = activePage === item.href || 
                        (item.href === '/dashboard' && activePage === '/') ||
                        (item.href === '/invoices' && activePage.startsWith('/invoice')) ||
                        (item.href === '/templates' && activePage === '/templates');
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`hover:text-gray-900 transition-colors ${
              isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
