import mongoose from 'mongoose';

const admissionFormSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add full name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    neetScore: {
      type: Number,
      default: 0,
    },
    interestedIn: {
      type: String,
      default: 'Both',
    },
    country: {
      type: String,
      default: 'India & Abroad',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'In Discussion', 'Admitted', 'Closed'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Website',
    },
  },
  {
    timestamps: true,
  }
);

const AdmissionForm = mongoose.model('AdmissionForm', admissionFormSchema);
export default AdmissionForm;
