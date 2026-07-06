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
      required: [true, 'Please add email'],
      trim: true,
    },
    neetScore: {
      type: Number,
      required: [true, 'Please add NEET score'],
    },
    interestedIn: {
      type: String,
      enum: ['India', 'Abroad', 'Both'],
      default: 'Abroad',
    },
    country: {
      type: String,
      required: [true, 'Please specify country preference'],
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
  },
  {
    timestamps: true,
  }
);

const AdmissionForm = mongoose.model('AdmissionForm', admissionFormSchema);
export default AdmissionForm;
