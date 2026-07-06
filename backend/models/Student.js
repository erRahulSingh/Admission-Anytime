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
      required: [true, 'Please add student email'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add student phone number'],
    },
    neetScore: {
      type: Number,
      required: [true, 'Please add NEET Score'],
    },
    countryInterested: {
      type: String,
      required: true,
    },
    selectedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    status: {
      type: String,
      enum: ['Applied', 'Document Verification', 'Visa Processing', 'Enroute', 'Joined'],
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
