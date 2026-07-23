import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    companyProfile: {
      name: { type: String, default: 'Admission Anytime' },
      email: { type: String, default: 'info@admissionanytime.com' },
      phone: { type: String, default: '+91 98765 43210' },
      website: { type: String, default: 'https://admissionanytime.com' },
      address: {
        type: String,
        default: '123, Education Street, Sector 62, Noida, Uttar Pradesh - 201301, India',
      },
      industry: { type: String, default: 'Education Services' },
      country: { type: String, default: 'India' },
      timeZone: { type: String, default: '(GMT +05:30) Asia/Kolkata' },
    },
    systemPreferences: {
      allowDuplicates: { type: Boolean, default: false },
      leadScore: { type: Boolean, default: true },
      autoAssign: { type: Boolean, default: true },
      applicationAutoNum: { type: Boolean, default: true },
      whatsappIntegration: { type: Boolean, default: true },
      dataVisibility: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
