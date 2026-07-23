import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add student name'],
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Please add student phone number'],
    },
    neetScore: {
      type: Number,
      default: 0,
    },
    course: {
      type: String,
      default: 'MBBS in India',
    },
    countryInterested: {
      type: String,
      default: 'India',
    },
    source: {
      type: String,
      default: 'Website',
    },
    counsellor: {
      type: String,
      default: 'Neha Sharma',
    },
    selectedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    status: {
      type: String,
      enum: ['Applied', 'Document Verification', 'Visa Processing', 'Enroute', 'Joined', 'Rejected'],
      default: 'Applied',
    },
    documents: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
