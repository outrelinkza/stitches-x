import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Referral() {
  const [referralCode] = useState('USER123XYZ');
  const [referralLink] = useState(`https://stitch.ai/referral?code=${referralCode}`);

  const referrals = [
    {
      id: 1,
      name: 'Ethan Carter',
      status: 'joined',
      reward: 'pending'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      status: 'sent_first_invoice',
      reward: 'received'
    },
    {
      id: 3,
      name: 'Noah Parker',
      status: 'joined',
      reward: 'pending'
    },
    {
      id: 4,
      name: 'Sophia Martinez',
      status: 'invited',
      reward: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'joined':
        return {
          className: 'bg-blue-100 text-blue-800',
          text: 'Joined'
        };
      case 'sent_first_invoice':
        return {
          className: 'bg-green-100 text-green-800',
          text: 'Sent first invoice'
        };
      case 'invited':
        return {
          className: 'bg-yellow-100 text-yellow-800',
          text: 'Invited'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800',
          text: 'Unknown'
        };
    }
  };

  const getRewardText = (reward: string) => {
    switch (reward) {
      case 'received':
        return {
          className: 'text-green-600 font-semibold',
          text: '$20 Credit Received'
        };
      case 'pending':
        return {
          className: 'text-gray-500',
          text: 'Pending'
        };
      default:
        return {
          className: 'text-gray-500',
          text: 'Pending'
        };
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Referral link copied to clipboard!');
    }
  };

  const shareViaEmail = () => {
    const subject = 'Join me on Stitch - Invoice Management Made Easy';
    const body = `Hi! I've been using Stitch for my invoice management and I think you'd love it too. Use my referral link to get started and we'll both get a $20 credit when you send your first invoice!\n\n${referralLink}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const shareOnSocialMedia = () => {
    const text = `Join me on Stitch for easy invoice management! Use my referral link and we'll both get a $20 credit: ${referralLink}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Head>
        <title>Referral Program - Stitches</title>
        <meta name="description" content="Refer friends and earn rewards with Stitches referral program" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-gray-50" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-3">
            <Link href="/" className="flex items-center gap-4 text-gray-900">
              <svg className="size-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">Stitches</h2>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
              <Link href="/invoices" className="hover:text-primary">Invoices</Link>
              <Link href="/clients" className="hover:text-primary">Customers</Link>
              <Link href="/reporting" className="hover:text-primary">Reports</Link>
              <Link href="/referral" className="text-primary font-semibold">Referral Program</Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 text-gray-600 hover:bg-gray-200">
                <span className="material-symbols-outlined text-2xl">help</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyw2I0OZYyeFXvgqTxG9XOeiuh5hLvvx0PIE__Op63lraLcn-JA-ba0ufMLdbRM7jlkqeSRD_dTqTGSkM5J19Wd_f7wN_oEWRvDnznz2aCJQ2V8yG4ebt0EAHlz2NgExNK6ipNCLg6lgYektqUPJTZqoVUB7K4c8RQkDCLd2aK2Lv-NClsLQw2cY8_RAXgGq3z4JI3TsPuvjsjTMAKiryEwWpqFE-PfRRCXs3nMDi0Xx2MC8zPjzU8Ol7rVyXZrHUd4orvbDfe2ao")'}}></div>
            </div>
          </header>

          <main className="flex-1 px-10 py-12">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tighter text-gray-900 mb-4">Refer a Friend, Get Rewards</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Invite your friends to join Stitch. When they send their first invoice, you'll both receive a <span className="font-semibold text-gray-800">$20 credit</span>. It's a win-win!
                </p>
              </div>

              <div className="bg-white/50 backdrop-blur-xl border border-gray-200/80 rounded-2xl p-8 shadow-sm mb-12">
                <div className="flex flex-col items-center gap-6">
                  <p className="text-gray-600 text-center">Copy your unique referral link and share it with your friends.</p>
                  <div className="w-full max-w-md">
                    <div className="relative">
                      <input 
                        className="form-input w-full rounded-lg border-gray-300 bg-gray-50 h-12 px-4 pr-12 text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        readOnly 
                        value={referralLink}
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={shareViaEmail}
                      className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-xl">email</span>
                      <span>Share via Email</span>
                    </button>
                    <button 
                      onClick={shareOnSocialMedia}
                      className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white hover:bg-blue-600 text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-xl">share</span>
                      <span>Share on Social Media</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Referral History</h2>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Friend</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {referrals.map((referral) => {
                        const statusBadge = getStatusBadge(referral.status);
                        const rewardText = getRewardText(referral.reward);
                        
                        return (
                          <tr key={referral.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {referral.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                {statusBadge.text}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${rewardText.className}`}>
                              {rewardText.text}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
