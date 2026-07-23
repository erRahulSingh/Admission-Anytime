import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'Counsellor',
    },
    department: {
      type: String,
      enum: ['Management', 'Counselling', 'Admissions', 'Marketing', 'Support'],
      default: 'Counselling',
    },
    phone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    language: {
      type: String,
      default: 'English',
    },
    timezone: {
      type: String,
      default: '(GMT +05:30) Asia/Kolkata',
    },
    dateFormat: {
      type: String,
      default: 'DD MMM YYYY (31 May 2025)',
    },
    timeFormat: {
      type: String,
      default: '12 Hour (05:30 PM)',
    },
    emailPreferences: {
      accountNotifications: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      marketingPromotions: { type: Boolean, default: false },
      weeklyReports: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match admin entered password to hashed password in database
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
