#!/usr/bin/env node

/**
 * Updated Stripe Products Setup Script for StitchesX
 * Includes per-invoice pricing (£2 per invoice)
 * 
 * Usage: node scripts/setup-stripe-products-updated.js
 */

const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createStripeProducts() {
  console.log('🚀 Setting up Stripe products for StitchesX with per-invoice pricing...\n');

  try {
    // 1. Create Per-Invoice Product (£2 per invoice)
    console.log('📄 Creating Per-Invoice product (£2 per invoice)...');
    const perInvoiceProduct = await stripe.products.create({
      name: 'Single Invoice Generation',
      description: 'Generate one professional invoice - £2 per invoice',
      metadata: {
        type: 'one_time',
        category: 'per_invoice',
        price_per_invoice: '2.00'
      }
    });

    const perInvoicePrice = await stripe.prices.create({
      product: perInvoiceProduct.id,
      unit_amount: 200, // £2.00 (in pence)
      currency: 'gbp',
      metadata: {
        type: 'per_invoice',
        features: 'single_invoice_download,standard_templates'
      }
    });

    console.log(`✅ Per-Invoice Product: ${perInvoiceProduct.id}`);
    console.log(`✅ Per-Invoice Price: ${perInvoicePrice.id}\n`);

    // 2. Create Premium Invoice Generation Product (£9.99 unlimited)
    console.log('📄 Creating Premium Invoice Generation product...');
    const premiumProduct = await stripe.products.create({
      name: 'Premium Invoice Generation',
      description: 'Generate unlimited professional invoices with premium templates and features',
      metadata: {
        type: 'one_time',
        category: 'invoice_generation'
      }
    });

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 999, // £9.99 (in pence)
      currency: 'gbp',
      metadata: {
        type: 'premium_invoice',
        features: 'unlimited_downloads,premium_templates,custom_branding'
      }
    });

    console.log(`✅ Premium Product: ${premiumProduct.id}`);
    console.log(`✅ Premium Price: ${premiumPrice.id}\n`);

    // 3. Create Monthly Subscription Product (£4.99/month)
    console.log('📅 Creating Monthly Subscription product...');
    const monthlyProduct = await stripe.products.create({
      name: 'StitchesX Monthly Pro',
      description: 'Monthly subscription for unlimited invoices and premium features',
      metadata: {
        type: 'subscription',
        billing: 'monthly'
      }
    });

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 499, // £4.99 (in pence)
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'monthly_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support'
      }
    });

    console.log(`✅ Monthly Product: ${monthlyProduct.id}`);
    console.log(`✅ Monthly Price: ${monthlyPrice.id}\n`);

    // 4. Create Annual Subscription Product (£49.99/year)
    console.log('📅 Creating Annual Subscription product...');
    const annualProduct = await stripe.products.create({
      name: 'StitchesX Annual Pro',
      description: 'Annual subscription for unlimited invoices and premium features (Save 17%)',
      metadata: {
        type: 'subscription',
        billing: 'annual'
      }
    });

    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 4999, // £49.99 (in pence)
      currency: 'gbp',
      recurring: {
        interval: 'year'
      },
      metadata: {
        type: 'annual_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support,api_access'
      }
    });

    console.log(`✅ Annual Product: ${annualProduct.id}`);
    console.log(`✅ Annual Price: ${annualPrice.id}\n`);

    // 5. Create Enterprise Product (£19.99/month)
    console.log('🏢 Creating Enterprise product...');
    const enterpriseProduct = await stripe.products.create({
      name: 'StitchesX Enterprise',
      description: 'Enterprise solution with team collaboration and API access',
      metadata: {
        type: 'subscription',
        billing: 'monthly',
        tier: 'enterprise'
      }
    });

    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 1999, // £19.99 (in pence)
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'enterprise_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support,api_access,team_collaboration,dedicated_support'
      }
    });

    console.log(`✅ Enterprise Product: ${enterpriseProduct.id}`);
    console.log(`✅ Enterprise Price: ${enterprisePrice.id}\n`);

    // 6. Output environment variables
    console.log('🔧 Add these to your .env.local file:\n');
    console.log('# Stripe Product IDs (GBP Pricing)');
    console.log(`STRIPE_PER_INVOICE_PRICE_ID=${perInvoicePrice.id}`);
    console.log(`STRIPE_PREMIUM_INVOICE_PRICE_ID=${premiumPrice.id}`);
    console.log(`STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID=${annualPrice.id}`);
    console.log(`STRIPE_ENTERPRISE_PRICE_ID=${enterprisePrice.id}\n`);

    console.log('🎉 Stripe products setup complete with per-invoice pricing!');
    console.log('\n📋 Pricing Structure:');
    console.log('• Free: 1-2 invoices (guest/registered users)');
    console.log('• Per Invoice: £2.00 per additional invoice');
    console.log('• Premium: £9.99 for unlimited invoices');
    console.log('• Monthly: £4.99/month for unlimited');
    console.log('• Annual: £49.99/year for unlimited (Save 17%)');
    console.log('• Enterprise: £19.99/month for teams');
    console.log('\n📋 Next steps:');
    console.log('1. Add the environment variables above to your .env.local file');
    console.log('2. Set up webhook endpoints in your Stripe dashboard');
    console.log('3. Test the payment flow');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
createStripeProducts();
