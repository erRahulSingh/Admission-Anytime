import mongoose from 'mongoose';

const ipSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    label: { type: String, default: 'Office Network' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const securitySettingSchema = new mongoose.Schema(
  {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorMethod: { type: String, default: 'Authenticator App' },
    ipRestrictionEnabled: { type: Boolean, default: true },
    whitelistedIps: {
      type: [ipSchema],
      default: [
        { ip: '192.168.1.10', label: 'Office Main Network' },
        { ip: '103.21.45.67', label: 'Backup Branch Office' },
      ],
    },
    loginAlerts: { type: Boolean, default: true },
    autoLogoutInactive: { type: Boolean, default: true },
    enforceStrongPassword: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SecuritySetting = mongoose.model('SecuritySetting', securitySettingSchema);
export default SecuritySetting;
