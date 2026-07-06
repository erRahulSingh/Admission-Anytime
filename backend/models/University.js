import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add university name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Please associate a country with this university'],
    },
    tuitionFee: {
      type: String,
      required: [true, 'Please add annual tuition fee'],
    },
    hostelFee: {
      type: String,
      default: 'Contact for details',
    },
    ranking: {
      type: String,
      default: 'N/A',
    },
    established: {
      type: String,
      default: '',
    },
    mediumOfInstruction: {
      type: String,
      default: 'English',
    },
    courseDuration: {
      type: String,
      default: '6 Years',
    },
    keyHighlights: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please add details or description'],
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
universitySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const University = mongoose.model('University', universitySchema);
export default University;
