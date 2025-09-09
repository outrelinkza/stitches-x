# 💰 Per-Invoice Pricing Setup Guide

## 🎯 **Complete Pricing Structure**

StitchesX now offers flexible pricing options:

1. **Free Tier**: 1-2 free invoices (guest/registered users)
2. **Per Invoice**: £2.00 per additional invoice
3. **Premium**: £9.99 for unlimited invoices (one-time)
4. **Monthly**: £4.99/month for unlimited
5. **Annual**: £49.99/year for unlimited (Save 17%)
6. **Enterprise**: £19.99/month for teams

## 🚀 **Setup Steps**

### 1. **Run the Updated Stripe Setup Script**

```bash
# Make sure you have your Stripe secret key in .env.local
STRIPE_SECRET_KEY=sk_test_...

# Run the updated setup script
node scripts/setup-stripe-products-updated.js
```

This will create all products and output the environment variables you need.

### 2. **Add Environment Variables**

Add these to your `.env.local` file:

```env
# Stripe Product IDs (GBP Pricing)
STRIPE_PER_INVOICE_PRICE_ID=price_xxxxx
STRIPE_PREMIUM_INVOICE_PRICE_ID=price_xxxxx
STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID=price_xxxxx
STRIPE_ANNUAL_SUBSCRIPTION_PRICE_ID=price_xxxxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxxxx
```

### 3. **Set Up Webhooks**

In your Stripe Dashboard:

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

4. Copy the webhook secret to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## 🎨 **How It Works**

### **Payment Flow**

1. **User generates invoice** → Free if under limit
2. **Exceeds free limit** → Payment modal appears
3. **User chooses**:
   - **£2.00** → Pay per invoice (single download)
   - **£9.99** → Premium upgrade (unlimited)
4. **Payment processed** → Stripe webhook updates database
5. **Email sent** → Confirmation with download link

### **Frontend Changes**

- **Payment Modal**: Now shows both per-invoice and premium options
- **Per-Invoice Button**: Green styling, £2.00 pricing
- **Premium Button**: Blue styling, £9.99 pricing
- **Smart Messaging**: Different text based on payment type

### **Backend Changes**

- **New API**: `/api/create-per-invoice-payment` for £2 payments
- **Updated Webhook**: Handles both payment types
- **Email Templates**: Different emails for per-invoice vs premium
- **Activity Logging**: Tracks per-invoice payments separately

## 🧪 **Testing**

### **Test Per-Invoice Payment**

1. Generate an invoice (use up free limit)
2. Click "Pay £2.00 & Download"
3. Complete Stripe checkout
4. Verify webhook processes correctly
5. Check email confirmation

### **Test Premium Payment**

1. Generate an invoice (use up free limit)
2. Click "Upgrade to Premium"
3. Complete Stripe checkout
4. Verify premium status updated
5. Check unlimited access works

## 📊 **Database Tracking**

The system tracks:

- **Per-invoice payments**: `activity_type: 'per_invoice_payment'`
- **Premium payments**: `activity_type: 'payment_success'`
- **User premium status**: `is_premium` and `premium_expires_at`
- **Payment metadata**: Amount, currency, invoice number

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"Payment configuration error"**
   - Check `STRIPE_PER_INVOICE_PRICE_ID` is set
   - Verify price ID exists in Stripe dashboard

2. **Webhook not processing**
   - Check webhook secret is correct
   - Verify webhook endpoint is accessible
   - Check webhook events are selected

3. **Email not sending**
   - Check Supabase email function is working
   - Verify email templates exist
   - Check email queue in database

### **Debug Commands**

```bash
# Check Stripe products
stripe products list

# Check webhook events
stripe events list --limit 10

# Test webhook locally
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## 💡 **Business Benefits**

### **For Users**
- **Flexibility**: Pay only for what they need
- **Low barrier**: £2 is affordable for occasional use
- **Upgrade path**: Easy to upgrade to premium later

### **For Business**
- **Higher conversion**: Lower price point increases sales
- **Revenue optimization**: Capture users who won't pay £9.99
- **User retention**: Per-invoice users may upgrade later

## 📈 **Analytics**

Track these metrics:

- **Per-invoice conversion rate**
- **Premium upgrade rate from per-invoice users**
- **Average revenue per user (ARPU)**
- **Payment method preferences**

## 🎉 **You're All Set!**

The per-invoice pricing system is now fully integrated. Users can:

1. ✅ Generate free invoices (up to limit)
2. ✅ Pay £2.00 for individual invoices
3. ✅ Upgrade to £9.99 premium for unlimited
4. ✅ Subscribe monthly/annually for ongoing access
5. ✅ Receive proper email confirmations
6. ✅ Have payments tracked in database

**Next Steps:**
1. Run the Stripe setup script
2. Add environment variables
3. Set up webhooks
4. Test the payment flow
5. Deploy and monitor!

---

*Need help? Check the troubleshooting section or contact support.*

