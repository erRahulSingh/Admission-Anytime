import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add country name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    flagImage: {
      type: String,
      required: [true, 'Please add flag image URL'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    benefits: {
      type: [String],
      default: [],
    },
    averageCost: {
      type: String,
      required: [true, 'Please specify average cost (e.g. 15-20 Lakhs)'],
    },
    duration: {
      type: String,
      required: [true, 'Please specify course duration (e.g. 6 Years)'],
    },
    fmgePassingRate: {
      type: String,
      required: [true, 'Please specify FMGE passing rate (e.g. 24%)'],
    },
    language: {
      type: String,
      default: 'English Medium',
    },
    requirements: {
      type: [String],
      default: ['Minimum 50% in PCB in 12th', 'NEET Qualified'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
countrySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Country = mongoose.model('Country', countrySchema);
export default Country;
