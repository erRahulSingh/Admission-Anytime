import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add blog title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please add post excerpt'],
    },
    content: {
      type: String,
      required: [true, 'Please add post content'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'MBBS Advisor Team',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug
blogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
