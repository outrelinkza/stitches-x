import Head from 'next/head';
import Header from '../components/Header';

export default function Landing() {
  return (
    <>
      <Head>
        <title>Landing - Stitches</title>
        <meta name="description" content="Landing page for Stitches AI Invoice Generator" />
      </Head>
      
      <div className="relative z-10">
        <Header currentPage="/landing" />
        
        <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-effect bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
              <h1 className="text-4xl font-bold text-white mb-8">Welcome to Stitches</h1>
              
              <div className="space-y-6">
                <p className="text-white/80">
                  Your AI-powered invoice generator is ready to go!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
