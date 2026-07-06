import Testimonial from '../models/Testimonial.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get active testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'Active' });
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/all
// @access  Private (Admin)
export const getTestimonialsAdmin = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, university, country, rating, review, status } = req.body;

    if (!name || !university || !country || !review) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    let image = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'testimonials');
      image = result.secure_url;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const testimonial = await Testimonial.create({
      name,
      university,
      country,
      rating,
      review,
      image,
      status,
    });

    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = async (req, res, next) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error('Testimonial not found');
    }

    const updateFields = { ...req.body };

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'testimonials');
      updateFields.image = result.secure_url;
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error('Testimonial not found');
    }

    await testimonial.deleteOne();
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
