import University from '../models/University.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get universities (Public)
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res, next) => {
  try {
    const { country, search } = req.query;
    let query = { status: 'Active' };

    if (country) {
      query.country = country;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const universities = await University.find(query)
      .populate('country', 'name slug flagImage')
      .sort({ ranking: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      universities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all universities for Admin
// @route   GET /api/universities/all
// @access  Private (Admin)
export const getUniversitiesAdmin = async (req, res, next) => {
  try {
    const initialCount = await University.countDocuments();
    if (initialCount === 0) {
      const defaultUnis = [
        {
          name: 'Tbilisi State Medical University',
          slug: 'tbilisi-state-medical-university',
          tuitionFee: '$5,000 / Year',
          hostelFee: '$1,000 / Year',
          ranking: 'Country Rank: 4, World Rank: 3840',
          established: '1918',
          mediumOfInstruction: 'English',
          courseDuration: '6 Years',
          keyHighlights: ['WHO listed', 'NMC approved', '100% English Medium'],
          description: 'Oldest and largest medical university in Georgia with excellent clinical exposure.',
          status: 'Active',
        },
        {
          name: 'Batumi Shota Rustaveli State University',
          slug: 'batumi-shota-rustaveli-state-university',
          tuitionFee: '$4,500 / Year',
          hostelFee: '$800 / Year',
          ranking: 'Country Rank: 8',
          established: '1935',
          mediumOfInstruction: 'English',
          courseDuration: '6 Years',
          keyHighlights: ['Coastal location', 'European standards', 'Modern diagnostic labs'],
          description: 'Located in scenic Batumi port city with modern medical training labs.',
          status: 'Active',
        },
        {
          name: 'Kazan Federal University',
          slug: 'kazan-federal-university',
          tuitionFee: '3,80,000 Rubles / Year',
          hostelFee: '20,000 Rubles / Year',
          ranking: 'World Rank: 347',
          established: '1804',
          mediumOfInstruction: 'English',
          courseDuration: '6 Years',
          keyHighlights: ['Top 400 World Ranking', 'Govt Subsidized Fees', 'Advanced Research Center'],
          description: 'One of the oldest universities in Russia with legendary medical faculties.',
          status: 'Active',
        },
        {
          name: 'Astana Medical University',
          slug: 'astana-medical-university',
          tuitionFee: '$3,500 / Year',
          hostelFee: '$600 / Year',
          ranking: 'Country Rank: 3',
          established: '1964',
          mediumOfInstruction: 'English',
          courseDuration: '5 Years',
          keyHighlights: ['5-Year NMC Course', 'Capital City Campus', 'Low Cost of Living'],
          description: 'Leading medical institute in Kazakhstan with extensive clinical practice.',
          status: 'Active',
        },
      ];
      await University.create(defaultUnis);
    }

    const universities = await University.find()
      .populate('country', 'name')
      .sort({ name: 1 });
    res.status(200).json({ success: true, count: universities.length, universities });
  } catch (error) {
    next(error);
  }
};

// @desc    Get university details by slug
// @route   GET /api/universities/:slug
// @access  Public
export const getUniversityBySlug = async (req, res, next) => {
  try {
    const university = await University.findOne({ slug: req.params.slug })
      .populate('country');

    if (!university) {
      res.status(404);
      throw new Error('University not found');
    }

    res.status(200).json({
      success: true,
      university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new university
// @route   POST /api/universities
// @access  Private (Admin)
export const createUniversity = async (req, res, next) => {
  try {
    const {
      name,
      country,
      tuitionFee,
      hostelFee,
      ranking,
      established,
      mediumOfInstruction,
      courseDuration,
      keyHighlights,
      description,
      status,
    } = req.body;

    if (!name || !country || !tuitionFee || !description) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    let logo = '';
    let coverImage = '';

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const result = await uploadToCloudinary(req.files.logo[0], 'universities/logos');
        logo = result.secure_url;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0], 'universities/covers');
        coverImage = result.secure_url;
      }
    }

    if (!logo && req.body.logo) logo = req.body.logo;
    if (!coverImage && req.body.coverImage) coverImage = req.body.coverImage;

    const parsedHighlights = typeof keyHighlights === 'string' ? JSON.parse(keyHighlights) : keyHighlights;

    const university = await University.create({
      name,
      country,
      tuitionFee,
      hostelFee,
      ranking,
      established,
      mediumOfInstruction,
      courseDuration,
      keyHighlights: parsedHighlights,
      description,
      logo,
      coverImage,
      status,
    });

    res.status(201).json({
      success: true,
      university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update university
// @route   PUT /api/universities/:id
// @access  Private (Admin)
export const updateUniversity = async (req, res, next) => {
  try {
    let university = await University.findById(req.params.id);

    if (!university) {
      res.status(404);
      throw new Error('University not found');
    }

    const updateFields = { ...req.body };

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const result = await uploadToCloudinary(req.files.logo[0], 'universities/logos');
        updateFields.logo = result.secure_url;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        const result = await uploadToCloudinary(req.files.coverImage[0], 'universities/covers');
        updateFields.coverImage = result.secure_url;
      }
    }

    if (updateFields.keyHighlights && typeof updateFields.keyHighlights === 'string') {
      updateFields.keyHighlights = JSON.parse(updateFields.keyHighlights);
    }

    university = await University.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete university
// @route   DELETE /api/universities/:id
// @access  Private (Admin)
export const deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      res.status(404);
      throw new Error('University not found');
    }

    await university.deleteOne();

    res.status(200).json({
      success: true,
      message: 'University deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
