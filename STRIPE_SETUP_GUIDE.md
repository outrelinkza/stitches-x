# 🚀 Complete Stripe Payment Setup Guide for StitchesX

This guide will help you set up the complete payment system with Stripe products, webhooks, and subscription management.

## 📋 Prerequisites

1. Stripe account with live API keys
2. Supabase project with database tables set up
3. Environment variables configured

## 🔧 Step 1: Create Stripe Products

### Run the Setup Script

```bash
# Make sure you're in the project directory
cd /Users/zahra/stitches-invoice-generator-deploy

# Install dependencies if not already done
npm install

# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here

# Run the setup script
node scripts/setup-stripe-products.js
```

### What This Creates

The script will create:
- **Premium Invoice Generation** - $9.99 one-time payment
- **Monthly Subscription** - $4.99/month
- **Annual Subscription** - $49.99/year (Save 17%)
- **Enterprise Plan** - $19.99/month

### Output

After running the script, you'll get environment variables like:
```
STRIPE_PREMIUM_INVOICE_PRICE_ID=price_1234567890
STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID=price_0987654321
STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID=price_1122334455
STRIPE_ENTERPRISE_PRICE_ID=price_5566778899
```

## 🔧 Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Product IDs (from step 1)
STRIPE_PREMIUM_INVOICE_PRICE_ID=price_your_premium_invoice_price_id
STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID=price_your_monthly_subscription_price_id
STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID=price_your_annual_subscription_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# Stripe Webhook Secret (from step 3)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🔧 Step 3: Set Up Stripe Webhooks

### In Your Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Copy the **Signing secret** and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

## 🔧 Step 4: Test the Payment System

### Test Premium Invoice Payment

```bash
# Test the payment API
curl -X POST https://yourdomain.com/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 999,
    "invoiceNumber": "TEST-001",
    "userId": "test-user-id",
    "customerEmail": "test@example.com"
  }'
```

### Test Subscription Creation

```bash
# Test monthly subscription
curl -X POST https://yourdomain.com/api/create-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "monthly",
    "customerEmail": "test@example.com",
    "userId": "test-user-id"
  }'
```

## 🔧 Step 5: Update Frontend Integration

The frontend is already set up to use these APIs. The payment flow will:

1. **Free Users**: Get 1-2 free downloads
2. **Premium Payment**: $9.99 for unlimited downloads
3. **Subscriptions**: Monthly/Annual plans for ongoing access

## 🔧 Step 6: Database Integration

The webhook handler automatically:
- Updates user premium status
- Tracks payment history
- Sends confirmation emails
- Manages subscription status

## 🎯 Features Now Available

### ✅ Payment Processing
- One-time premium invoice payments
- Monthly/annual subscriptions
- Enterprise plans
- Automatic status updates

### ✅ Subscription Management
- Automatic renewal handling
- Payment failure management
- Subscription cancellation
- Status tracking

### ✅ User Experience
- Seamless payment flow
- Payment history tracking
- Email confirmations
- Premium feature access

### ✅ Security
- Webhook signature verification
- Rate limiting
- Input validation
- Security event logging

## 🚨 Important Notes

1. **Test Mode**: Use Stripe test keys for development
2. **Webhook Security**: Always verify webhook signatures
3. **Error Handling**: Monitor webhook failures
4. **Database**: Ensure all tables are created with proper RLS policies

## 🔍 Troubleshooting

### Common Issues

1. **Webhook Not Working**
   - Check endpoint URL is accessible
   - Verify webhook secret in environment
   - Check Stripe dashboard for failed events

2. **Payment Not Processing**
   - Verify Stripe keys are correct
   - Check price IDs are valid
   - Ensure webhook is receiving events

3. **Database Updates Not Working**
   - Check Supabase RLS policies
   - Verify user permissions
   - Check webhook logs for errors

## 🎉 You're All Set!

Your StitchesX payment system is now complete with:
- ✅ Stripe products and pricing
- ✅ Webhook handling
- ✅ Subscription management
- ✅ Payment tracking
- ✅ User premium status
- ✅ Email notifications

Users can now:
1. Generate free invoices (limited)
2. Pay for premium features
3. Subscribe to monthly/annual plans
4. Access enterprise features
5. Track their payment history

Happy invoicing! 🚀

