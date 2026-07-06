import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add message'],
    },
    status: {
      type: String,
      enum: ['Unread', 'Read', 'Replied'],
      default: 'Unread',
    },
    replyMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;
