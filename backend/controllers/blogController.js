import Blog from '../models/Blog.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get published blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs (Admin)
// @route   GET /api/blogs/all
// @access  Private (Admin)
export const getBlogsAdmin = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin)
export const createBlog = async (req, res, next) => {
  try {
    const { title, excerpt, content, author, status } = req.body;

    if (!title || !excerpt || !content) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    let featuredImage = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'blogs');
      featuredImage = result.secure_url;
    } else if (req.body.featuredImage) {
      featuredImage = req.body.featuredImage;
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      author,
      featuredImage,
      status,
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const updateFields = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'blogs');
      updateFields.featuredImage = result.secure_url;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};
