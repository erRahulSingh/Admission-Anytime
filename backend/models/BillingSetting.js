import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: 'Paid' },
  },
  { _id: true }
);

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    billingCycle: { type: String, default: 'per month' },
    leadLimit: { type: String, default: '5,000' },
    userLimit: { type: String, default: '20' },
    features: [String],
    isPopular: { type: Boolean, default: false },
  },
  { _id: true }
);

const billingSettingSchema = new mongoose.Schema(
  {
    currentPlan: {
      name: { type: String, default: 'Pro Plan (Growth)' },
      price: { type: String, default: '₹14,999 / month' },
      billingCycle: { type: String, default: 'Billed Annually' },
      nextRenewal: { type: String, default: '31 May 2026' },
      status: { type: String, default: 'Active' },
    },
    usage: {
      leadsUsed: { type: Number, default: 12450 },
      leadsLimit: { type: Number, default: 25000 },
      usersCount: { type: Number, default: 158 },
      usersLimit: { type: Number, default: 200 },
      smsCreditsUsed: { type: Number, default: 45000 },
      smsCreditsLimit: { type: Number, default: 50000 },
      storageUsedGB: { type: Number, default: 14.2 },
      storageLimitGB: { type: Number, default: 50 },
    },
    plans: {
      type: [planSchema],
      default: [
        {
          name: 'Starter Plan',
          price: '₹4,999',
          billingCycle: 'per month',
          leadLimit: '5,000 leads / mo',
          userLimit: 'Up to 20 team users',
          features: ['5,000 Lead Submissions', '20 Team User Accounts', 'Basic Email Notifications', 'Standard Reports'],
          isPopular: false,
        },
        {
          name: 'Pro Plan (Growth)',
          price: '₹14,999',
          billingCycle: 'per month',
          leadLimit: '25,000 leads / mo',
          userLimit: 'Up to 200 team users',
          features: ['25,000 Lead Submissions', '200 Team User Accounts', 'AI Lead Scoring Engine', 'WhatsApp Auto Sync', 'Priority Support'],
          isPopular: true,
        },
        {
          name: 'Enterprise Plan',
          price: '₹39,999',
          billingCycle: 'per month',
          leadLimit: 'Unlimited leads',
          userLimit: 'Unlimited users',
          features: ['Unlimited Lead Submissions', 'Unlimited User Accounts', 'Custom AI Workflows', 'Dedicated Account Manager', 'SLA 99.9% Uptime'],
          isPopular: false,
        },
      ],
    },
    paymentMethod: {
      cardBrand: { type: String, default: 'HDFC Bank Credit Card' },
      last4: { type: String, default: '4242' },
      expiry: { type: String, default: '08/28' },
      holderName: { type: String, default: 'Admission Anytime Pvt Ltd' },
    },
    invoices: {
      type: [invoiceSchema],
      default: [
        { invoiceId: 'INV-2025-005', date: '01 May 2025', description: 'Pro Plan - Annual Subscription Renewal', amount: '₹1,79,988', status: 'Paid' },
        { invoiceId: 'INV-2024-012', date: '01 May 2024', description: 'Pro Plan - Annual Subscription Renewal', amount: '₹1,79,988', status: 'Paid' },
        { invoiceId: 'INV-2023-008', date: '01 May 2023', description: 'Starter Plan - Annual Subscription', amount: '₹59,988', status: 'Paid' },
      ],
    },
  },
  { timestamps: true }
);

const BillingSetting = mongoose.model('BillingSetting', billingSettingSchema);
export default BillingSetting;
