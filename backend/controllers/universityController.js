import University from '../models/University.js';
import Country from '../models/Country.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

// @desc    Get universities (Public)
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res, next) => {
  try {
    const { country, search } = req.query;
    let query = { status: 'Active' };

    if (country) {
      if (mongoose.Types.ObjectId.isValid(country)) {
        query.country = country;
      } else {
        const foundCountry = await Country.findOne({
          $or: [
            { name: { $regex: `^${country}$`, $options: 'i' } },
            { slug: country.toLowerCase() },
          ],
        });
        if (foundCountry) {
          query.country = foundCountry._id;
        } else {
          query.country = null;
        }
      }
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const rawUniversities = await University.find(query)
      .populate('country', 'name slug flagImage')
      .sort({ ranking: 1, name: 1 });

    const defaultCampusPhotos = [
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584515901367-f134981d40e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    ];

    const universities = rawUniversities.map((u, idx) => {
      const doc = u.toObject ? u.toObject() : { ...u };
      if (!doc.coverImage || doc.coverImage.includes('1568515045052')) {
        doc.coverImage = defaultCampusPhotos[idx % defaultCampusPhotos.length];
        University.updateOne({ _id: doc._id }, { coverImage: doc.coverImage }).catch(() => {});
      }
      return doc;
    });

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
    if (initialCount < 16) {
      // Find default country to associate if available
      let defaultCountryObj = await Country.findOne();
      if (!defaultCountryObj) {
        defaultCountryObj = await Country.create({
          name: 'Georgia',
          slug: 'georgia',
          flagImage: 'https://flagcdn.com/w80/ge.png',
          coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
          description: 'Top destination for MBBS in Europe.',
        });
      }

      if (defaultCountryObj) {
        const defaultUnis = [
          {
            name: 'Astana Medical University',
            slug: 'astana-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$3,500 / Year',
            hostelFee: '$600 / Year',
            ranking: 'Country Rank: 3',
            established: '1964',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Only 5-year course duration following NMC guidelines',
              'Located in the capital city, Nursultan (Astana)',
              'Highly modern clinical testing infrastructure',
            ],
            description: 'Astana Medical University is one of the most prestigious medical colleges in Kazakhstan.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Tbilisi State Medical University',
            slug: 'tbilisi-state-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$5,000 / Year',
            hostelFee: '$1,000 / Year',
            ranking: 'Country Rank: 4, World Rank: 3840',
            established: '1918',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Oldest and largest medical university in Georgia',
              'Highly clinical curriculum linked with University Hospital',
              'NMC, WHO, and USMLE compatible training',
            ],
            description: 'Tbilisi State Medical University is the leading medical school in Georgia.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Batumi Shota Rustaveli State University',
            slug: 'batumi-shota-rustaveli-state-university',
            country: defaultCountryObj._id,
            tuitionFee: '$4,500 / Year',
            hostelFee: '$800 / Year',
            ranking: 'Country Rank: 8',
            established: '1935',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Located in the scenic port city of Batumi',
              'Highly affordable European education standard',
              'Low student-to-teacher ratio in diagnostic labs',
            ],
            description: 'Shota Rustaveli State University offers a modern infrastructure and experienced teaching faculty.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Kazan Federal University',
            slug: 'kazan-federal-university',
            country: defaultCountryObj._id,
            tuitionFee: '3,80,000 Rubles / Year',
            hostelFee: '20,000 Rubles / Year',
            ranking: 'World Rank: 347',
            established: '1804',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Ranked in the top 400 universities globally',
              'Subsidy benefits provided by Russian Ministry',
              'Advanced biochemical and research labs',
            ],
            description: 'Kazan Federal University is one of the oldest universities in Russia with legendary medical faculties.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Tashkent Medical Academy',
            slug: 'tashkent-medical-academy',
            country: defaultCountryObj._id,
            tuitionFee: '$3,800 / Year',
            hostelFee: '$700 / Year',
            ranking: 'Country Rank: 2',
            established: '1919',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Premier state medical academy in Uzbekistan',
              'Indian mess and dedicated hostel blocks',
              'Recognized by NMC, WHO, and ECFMG',
            ],
            description: 'Leading government medical center in Tashkent with extensive practical hospital training.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Osh State University Medical Faculty',
            slug: 'osh-state-university',
            country: defaultCountryObj._id,
            tuitionFee: '$3,200 / Year',
            hostelFee: '$600 / Year',
            ranking: 'Country Rank: 5',
            established: '1992',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Largest government university in southern Kyrgyzstan',
              'Over 20+ affiliated teaching hospitals',
              'Extremely low cost of living and tuition',
            ],
            description: 'High quality medical education with multi-specialty hospital clinical rotations.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Yerevan State Medical University',
            slug: 'yerevan-state-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$5,500 / Year',
            hostelFee: '$900 / Year',
            ranking: 'Country Rank: 1',
            established: '1920',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Historic medical university founded in 1920',
              '100% English medium medical curriculum',
              'High licensing exam success rate for Indian graduates',
            ],
            description: 'Premier medical university in Armenia with centuries-old educational heritage.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'University of Santo Tomas',
            slug: 'university-of-santo-tomas',
            country: defaultCountryObj._id,
            tuitionFee: '$4,800 / Year',
            hostelFee: '$1,100 / Year',
            ranking: 'World Rank: 801',
            established: '1611',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'US-based BS+MD clinical curriculum',
              '100% English speaking country',
              'High FMGE and USMLE passing record',
            ],
            description: "Asia's oldest existing university with world-renowned medical faculties.",
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Cairo University Faculty of Medicine',
            slug: 'cairo-university',
            country: defaultCountryObj._id,
            tuitionFee: '$6,000 / Year',
            hostelFee: '$1,200 / Year',
            ranking: 'Country Rank: 1, World Rank: 550',
            established: '1827',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Largest teaching medical hospital in the Middle East',
              'High clinical patient exposure in Kasr Alainy',
              'Full NMC and WHO accreditation',
            ],
            description: "Egypt's premier medical faculty known for intensive clinical rotations and research.",
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1584515901367-f134981d40e1?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'AIIMS New Delhi',
            slug: 'aiims-new-delhi',
            country: defaultCountryObj._id,
            tuitionFee: '₹1,628 / Year',
            hostelFee: '₹1,000 / Year',
            ranking: 'NIRF Rank: 1 in India',
            established: '1956',
            mediumOfInstruction: 'English',
            courseDuration: '5.5 Years',
            keyHighlights: [
              "India's apex medical institution",
              'World-class research facilities and tertiary care hospital',
              'Full government subsidized medical education',
            ],
            description: "All India Institute of Medical Sciences is India's top medical college with legendary clinical exposure.",
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Samarkand State Medical University',
            slug: 'samarkand-state-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$3,400 / Year',
            hostelFee: '$600 / Year',
            ranking: 'Country Rank: 3',
            established: '1930',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'One of the oldest medical institutes in Central Asia',
              'NMC & WHO approved English medium curriculum',
              'Modern diagnostic simulation training center',
            ],
            description: 'Centuries-old medical institution in Samarkand with international clinical faculty.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Kazan State Medical University',
            slug: 'kazan-state-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$4,200 / Year',
            hostelFee: '$800 / Year',
            ranking: 'Country Rank: 9, World Rank: 1200',
            established: '1814',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Over 200 years of medical academic excellence',
              'State-of-the-art medical clinical research centers',
              'Large Indian student community & dedicated hostel mess',
            ],
            description: 'Prestige Russian medical university featuring 9 affiliated hospitals and research labs.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'New Vision University',
            slug: 'new-vision-university',
            country: defaultCountryObj._id,
            tuitionFee: '$7,000 / Year',
            hostelFee: '$1,200 / Year',
            ranking: 'Country Rank: 6',
            established: '2013',
            mediumOfInstruction: 'English',
            courseDuration: '6 Years',
            keyHighlights: [
              'Modern European private medical university in Tbilisi',
              'USMLE & PLAB targeted international medical training',
              'Features its own private University Hospital campus',
            ],
            description: 'Innovative European medical school offering advanced clinical simulation technology.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Kazakh National Medical University',
            slug: 'kazakh-national-medical-university',
            country: defaultCountryObj._id,
            tuitionFee: '$4,500 / Year',
            hostelFee: '$700 / Year',
            ranking: 'Country Rank: 1 in Kazakhstan',
            established: '1930',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Top ranked government medical university in Almaty',
              'Over 10,000+ international medical students',
              'Pioneer of medical research and healthcare in Central Asia',
            ],
            description: 'Asfendiyarov Kazakh National Medical University is the top medical institution in Almaty.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Jalal-Abad State University',
            slug: 'jalal-abad-state-university',
            country: defaultCountryObj._id,
            tuitionFee: '$3,000 / Year',
            hostelFee: '$550 / Year',
            ranking: 'Country Rank: 7',
            established: '1993',
            mediumOfInstruction: 'English',
            courseDuration: '5 Years',
            keyHighlights: [
              'Extremely budget-friendly MBBS program',
              'NMC guidelines compliant 5-year syllabus',
              'Safe student-friendly campus with Indian mess',
            ],
            description: 'Highly affordable medical university in Jalal-Abad offering quality clinical training.',
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
          {
            name: 'Kasturba Medical College (KMC Manipal)',
            slug: 'kmc-manipal',
            country: defaultCountryObj._id,
            tuitionFee: '₹17,80,000 / Year',
            hostelFee: '₹1,50,000 / Year',
            ranking: 'NIRF Rank: 9 in India',
            established: '1953',
            mediumOfInstruction: 'English',
            courseDuration: '5.5 Years',
            keyHighlights: [
              'Top premier private medical college in India',
              'A++ NAAC grade accreditation and global recognition',
              'World-class clinical exposure with 2,000+ bed hospital',
            ],
            description: "Ranked among India's top 10 medical colleges with state-of-the-art medical education.",
            logo: '',
            coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            status: 'Active',
          },
        ];

        for (const item of defaultUnis) {
          const exists = await University.findOne({ slug: item.slug });
          if (!exists) {
            await University.create(item);
          }
        }
      }
    }

    const rawUniversities = await University.find()
      .populate('country', 'name slug flagImage')
      .sort({ createdAt: -1 });

    const defaultCampusPhotos = [
      'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584515901367-f134981d40e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    ];

    const universities = rawUniversities.map((u, idx) => {
      const doc = u.toObject ? u.toObject() : { ...u };
      if (!doc.coverImage || doc.coverImage.includes('1568515045052')) {
        doc.coverImage = defaultCampusPhotos[idx % defaultCampusPhotos.length];
        University.updateOne({ _id: doc._id }, { coverImage: doc.coverImage }).catch(() => {});
      }
      return doc;
    });
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
      throw new Error('Please fill all required fields (Name, Country, Tuition Fee, Description)');
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

    let parsedHighlights = [];
    if (Array.isArray(keyHighlights)) {
      parsedHighlights = keyHighlights;
    } else if (typeof keyHighlights === 'string') {
      try {
        parsedHighlights = JSON.parse(keyHighlights);
      } catch {
        parsedHighlights = keyHighlights.split(',').map(h => h.trim()).filter(Boolean);
      }
    }

    let university = await University.create({
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
      status: status || 'Active',
    });

    university = await University.findById(university._id).populate('country', 'name slug flagImage');

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

    if (updateFields.keyHighlights) {
      if (Array.isArray(updateFields.keyHighlights)) {
        // already array
      } else if (typeof updateFields.keyHighlights === 'string') {
        try {
          updateFields.keyHighlights = JSON.parse(updateFields.keyHighlights);
        } catch {
          updateFields.keyHighlights = updateFields.keyHighlights.split(',').map(h => h.trim()).filter(Boolean);
        }
      }
    }

    university = await University.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('country', 'name slug flagImage');

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
