import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add campaign name'],
      trim: true,
    },
    platform: {
      type: String,
      enum: ['Google Ads', 'Facebook Ads', 'Instagram Ads', 'Organic Search', 'Referral', 'Walk In'],
      default: 'Google Ads',
    },
    targetCountry: {
      type: String,
      default: 'MBBS in India',
    },
    budget: {
      type: Number,
      default: 50000,
    },
    spend: {
      type: Number,
      default: 0,
    },
    objective: {
      type: String,
      default: 'Lead Generation',
    },
    leadsGenerated: {
      type: Number,
      default: 0,
    },
    applicationsGenerated: {
      type: Number,
      default: 0,
    },
    admissionsGenerated: {
      type: Number,
      default: 0,
    },
    cpl: {
      type: Number,
      default: 0,
    },
    roi: {
      type: String,
      default: '3.42x',
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Completed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
