#!/usr/bin/env node

/**
 * Stripe Products Setup Script for StitchesX
 * Run this script to create all necessary Stripe products and prices
 * 
 * Usage: node scripts/setup-stripe-products.js
 */

const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function createStripeProducts() {
  console.log('Setting up Stripe products for StitchesX...\n');

  try {
    // 1. Create Premium Invoice Generation Product
    console.log('Creating Premium Invoice Generation product...');
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
      unit_amount: 999, // $9.99
      currency: 'usd',
      metadata: {
        type: 'premium_invoice',
        features: 'unlimited_downloads,premium_templates,custom_branding'
      }
    });

    console.log(`Premium Product: ${premiumProduct.id}`);
    console.log(`Premium Price: ${premiumPrice.id}\n`);

    // 2. Create Monthly Subscription Product
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
      unit_amount: 499, // $4.99
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'monthly_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support'
      }
    });

    console.log(`Monthly Product: ${monthlyProduct.id}`);
    console.log(`Monthly Price: ${monthlyPrice.id}\n`);

    // 3. Create Annual Subscription Product
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
      unit_amount: 4999, // $49.99 (Save $10.89 vs monthly)
      currency: 'usd',
      recurring: {
        interval: 'year'
      },
      metadata: {
        type: 'annual_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support,api_access'
      }
    });

    console.log(`Annual Product: ${annualProduct.id}`);
    console.log(`Annual Price: ${annualPrice.id}\n`);

    // 4. Create Enterprise Product
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
      unit_amount: 1999, // $19.99/month
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'enterprise_subscription',
        features: 'unlimited_downloads,premium_templates,custom_branding,priority_support,api_access,team_collaboration,dedicated_support'
      }
    });

    console.log(`Enterprise Product: ${enterpriseProduct.id}`);
    console.log(`Enterprise Price: ${enterprisePrice.id}\n`);

    // 5. Output environment variables
    console.log('🔧 Add these to your .env.local file:\n');
    console.log('# Stripe Product IDs');
    console.log(`STRIPE_PREMIUM_INVOICE_PRICE_ID=${premiumPrice.id}`);
    console.log(`STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID=${annualPrice.id}`);
    console.log(`STRIPE_ENTERPRISE_PRICE_ID=${enterprisePrice.id}\n`);

    console.log('🎉 Stripe products setup complete!');
    console.log('\nNext steps:');
    console.log('1. Add the environment variables above to your .env.local file');
    console.log('2. Set up webhook endpoints in your Stripe dashboard');
    console.log('3. Test the payment flow');

  } catch (error) {
    console.error('Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
createStripeProducts();

