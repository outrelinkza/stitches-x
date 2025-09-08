import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } else {
        // Redirect to onboarding after successful signup
        router.push('/onboarding');
      }
    }, 1500);
  };

  const handleGoogleAuth = () => {
    // In a real app, this would integrate with Google OAuth
    alert('Google authentication would be implemented here');
  };

  const handleAppleAuth = () => {
    // In a real app, this would integrate with Apple Sign In
    alert('Apple authentication would be implemented here');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} - Stitches</title>
        <meta name="description" content={isLogin ? 'Login to your Stitches account' : 'Create your Stitches account'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative min-h-screen w-full overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex min-h-screen flex-col" style={{fontFamily: 'Inter, sans-serif'}}>
          <header className="flex items-center justify-between px-6 py-4 sm:px-10">
            <Link href="/" className="flex items-center gap-2 text-gray-900">
              <svg className="text-black" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M3 7L12 12L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                <path d="M12 12V22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <h1 className="text-xl font-bold tracking-tight">Stitches</h1>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/dashboard" className="text-gray-500 transition-colors hover:text-gray-900">Product</Link>
              <Link href="/subscription" className="text-gray-500 transition-colors hover:text-gray-900">Pricing</Link>
              <Link href="/support" className="text-gray-500 transition-colors hover:text-gray-900">Resources</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLogin(true)}
                className={`hidden rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:block ${
                  isLogin 
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-transform hover:scale-105 ${
                  isLogin 
                    ? 'bg-primary text-white' 
                    : 'bg-primary text-white'
                }`}
              >
                Get Started
              </button>
            </div>
          </header>

          <main className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/60 p-8 shadow-2xl shadow-gray-500/10 backdrop-blur-xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Welcome'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {isLogin 
                    ? 'Enter your credentials to access your account.' 
                    : 'Create your account to get started with Stitches.'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="sr-only" htmlFor="fullName">Full Name</label>
                      <input
                        autoComplete="name"
                        className="w-full rounded-lg border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        id="fullName"
                        name="fullName"
                        placeholder="Full Name"
                        required={!isLogin}
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                  <div>
                    <label className="sr-only" htmlFor="email">Email or Username</label>
                    <input
                      autoComplete="email"
                      className="w-full rounded-lg border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      id="email"
                      name="email"
                      placeholder="Email or Username"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="password">Password</label>
                    <input
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full rounded-lg border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  {!isLogin && (
                    <div>
                      <label className="sr-only" htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required={!isLogin}
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <a className="text-xs font-medium text-gray-500 transition-colors hover:text-primary" href="#">
                      Forgot Password?
                    </a>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : (isLogin ? 'Log In' : 'Sign Up')}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white/60 px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={handleGoogleAuth}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white/80 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                      <path d="M1 1h22v22H1z" fill="none"></path>
                    </svg>
                    Google
                  </button>
                  <button 
                    type="button"
                    onClick={handleAppleAuth}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white/80 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.22 6.53a4.77 4.77 0 00-3.8-2.12c-2.43.08-4.72 2.3-4.72 5.61 0 2.27 1.25 4.76 3.05 4.76 1.05 0 1.74-.53 2.58-.53.78 0 1.34.48 2.5.48 2.22 0 3.53-2.11 3.53-4.58 0-2.2-1.39-3.4-2.64-3.7zM13.2 2.1a6.76 6.76 0 014.51 2.23 6.54 6.54 0 012.18 5.11c0 4.13-2.92 6.44-5.26 6.44-1.2 0-2.08-.8-3.3-.8s-1.84.8-3.3.8c-2.62 0-5.74-2.7-5.74-7.55a7.87 7.87 0 013-6.28 7.33 7.33 0 015.41-2.45z"></path>
                    </svg>
                    Apple
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button"
                    onClick={toggleMode}
                    className="ml-1 font-medium text-primary transition-colors hover:underline"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
