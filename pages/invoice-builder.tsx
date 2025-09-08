import React from 'react';
import Head from 'next/head';
import InvoiceBuilder from '../components/InvoiceBuilder';

export default function InvoiceBuilderPage() {
  return (
    <>
      <Head>
        <title>Create Professional Invoices - Stitches Invoice Generator</title>
        <meta name="description" content="Create beautiful, professional invoices with our premium invoice generator. Customize templates, add your branding, and get paid faster." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <InvoiceBuilder />
    </>
  );
}
