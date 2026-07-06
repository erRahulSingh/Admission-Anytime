import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add service title'],
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Please specify a React Icon identifier'],
    },
    description: {
      type: String,
      required: [true, 'Please add short description'],
    },
    detailedContent: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
