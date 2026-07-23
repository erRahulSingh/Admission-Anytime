import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
  },
  { _id: false }
);

const notificationSettingSchema = new mongoose.Schema(
  {
    dndEnabled: { type: Boolean, default: true },
    quietHoursFrom: { type: String, default: '10:00 PM' },
    quietHoursTo: { type: String, default: '07:00 AM' },
    dndDays: {
      Mon: { type: Boolean, default: true },
      Tue: { type: Boolean, default: true },
      Wed: { type: Boolean, default: true },
      Thu: { type: Boolean, default: true },
      Fri: { type: Boolean, default: true },
      Sat: { type: Boolean, default: false },
      Sun: { type: Boolean, default: false },
    },
    matrix: {
      leads: { type: channelSchema, default: () => ({ email: true, inApp: true, sms: false, push: true }) },
      applications: { type: channelSchema, default: () => ({ email: true, inApp: true, sms: true, push: true }) },
      counselling: { type: channelSchema, default: () => ({ email: true, inApp: true, sms: false, push: true }) },
      admissions: { type: channelSchema, default: () => ({ email: true, inApp: true, sms: true, push: true }) },
      payments: { type: channelSchema, default: () => ({ email: true, inApp: false, sms: true, push: false }) },
      tasks: { type: channelSchema, default: () => ({ email: false, inApp: true, sms: false, push: true }) },
      system: { type: channelSchema, default: () => ({ email: true, inApp: true, sms: false, push: true }) },
      marketing: { type: channelSchema, default: () => ({ email: false, inApp: false, sms: false, push: false }) },
    },
  },
  { timestamps: true }
);

const NotificationSetting = mongoose.model('NotificationSetting', notificationSettingSchema);
export default NotificationSetting;
