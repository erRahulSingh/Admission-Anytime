import Country from '../models/Country.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all active countries
// @route   GET /api/countries
// @access  Public
export const getCountries = async (req, res, next) => {
  try {
    const countries = await Country.find({ status: 'Active' }).sort({ name: 1 });
    res.status(200).json({ success: true, count: countries.length, countries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all countries (including Inactive) for Admin
// @route   GET /api/countries/all
// @access  Private (Admin)
export const getCountriesAdmin = async (req, res, next) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: countries.length, countries });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single country by slug
// @route   GET /api/countries/:slug
// @access  Public
export const getCountryBySlug = async (req, res, next) => {
  try {
    const country = await Country.findOne({ slug: req.params.slug });

    if (!country) {
      res.status(404);
      throw new Error('Country not found');
    }

    res.status(200).json({ success: true, country });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new country
// @route   POST /api/countries
// @access  Private (Admin)
export const createCountry = async (req, res, next) => {
  try {
    const { name, description, averageCost, duration, fmgePassingRate, language, benefits, requirements, status } = req.body;

    if (!name || !description || !averageCost || !duration || !fmgePassingRate) {
      res.status(400);
      throw new Error('Please fill all required text fields');
    }

    // Process file uploads
    let flagImage = '';
    let coverImage = '';

    if (req.files) {
      if (req.files.flagImage && req.files.flagImage[0]) {
        const result = await uploadToCloudinary(req.files.flagImage[0], 'countries/flags');
        flagImage = result.secure_url;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0], 'countries/covers');
        coverImage = result.secure_url;
      }
    }

    // Double check flag image requirement
    if (!flagImage && req.body.flagImage) {
      flagImage = req.body.flagImage; // fallback to text URL
    }
    if (!coverImage && req.body.coverImage) {
      coverImage = req.body.coverImage;
    }

    if (!flagImage) {
      res.status(400);
      throw new Error('Please upload or provide a flag image');
    }

    // Parse array variables if they are passed as strings (form-data format)
    const parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
    const parsedRequirements = typeof requirements === 'string' ? JSON.parse(requirements) : requirements;

    const country = await Country.create({
      name,
      description,
      averageCost,
      duration,
      fmgePassingRate,
      language,
      benefits: parsedBenefits,
      requirements: parsedRequirements,
      flagImage,
      coverImage,
      status,
    });

    res.status(201).json({ success: true, country });
  } catch (error) {
    next(error);
  }
};

// @desc    Update country
// @route   PUT /api/countries/:id
// @access  Private (Admin)
export const updateCountry = async (req, res, next) => {
  try {
    let country = await Country.findById(req.params.id);

    if (!country) {
      res.status(404);
      throw new Error('Country not found');
    }

    const updateFields = { ...req.body };

    // Process file uploads
    if (req.files) {
      if (req.files.flagImage && req.files.flagImage[0]) {
        const result = await uploadToCloudinary(req.files.flagImage[0], 'countries/flags');
        updateFields.flagImage = result.secure_url;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0], 'countries/covers');
        updateFields.coverImage = result.secure_url;
      }
    }

    // Parse arrays
    if (updateFields.benefits && typeof updateFields.benefits === 'string') {
      updateFields.benefits = JSON.parse(updateFields.benefits);
    }
    if (updateFields.requirements && typeof updateFields.requirements === 'string') {
      updateFields.requirements = JSON.parse(updateFields.requirements);
    }

    country = await Country.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, country });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete country
// @route   DELETE /api/countries/:id
// @access  Private (Admin)
export const deleteCountry = async (req, res, next) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      res.status(404);
      throw new Error('Country not found');
    }

    await country.deleteOne();
    res.status(200).json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    next(error);
  }
};
