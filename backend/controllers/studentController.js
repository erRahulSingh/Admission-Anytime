import Student from '../models/Student.js';

// @desc    Get all students / applications with live DB stats
// @route   GET /api/students
// @access  Private (Admin)
export const getStudents = async (req, res, next) => {
  try {
    const { status, search, source, course } = req.query;

    // Check if DB is empty; if so, auto-seed sample student applications into MongoDB
    const initialCount = await Student.countDocuments();
    if (initialCount === 0) {
      const defaultStudents = [
        { applicationId: '#APP-12548', name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '+91 98765 43210', neetScore: 540, course: 'MBBS in India', countryInterested: 'India', source: 'Google Ads', counsellor: 'Neha Sharma', status: 'Document Verification' },
        { applicationId: '#APP-12547', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 87654 32109', neetScore: 480, course: 'MBBS Abroad', countryInterested: 'Georgia', source: 'Website', counsellor: 'Rohit Verma', status: 'Visa Processing' },
        { applicationId: '#APP-12546', name: 'Rahul Verma', email: 'rahul.verma@example.com', phone: '+91 76543 21098', neetScore: 410, course: 'BDS', countryInterested: 'Russia', source: 'Facebook Ads', counsellor: 'Neha Sharma', status: 'Joined' },
        { applicationId: '#APP-12545', name: 'Sneha Singh', email: 'sneha.singh@example.com', phone: '+91 65432 10987', neetScore: 510, course: 'Nursing', countryInterested: 'India', source: 'Referral', counsellor: 'Rohit Verma', status: 'Applied' },
        { applicationId: '#APP-12544', name: 'Vikash Yadav', email: 'vikash.yadav@example.com', phone: '+91 54321 09876', neetScore: 390, course: 'MBBS in India', countryInterested: 'India', source: 'Google Ads', counsellor: 'Anjali Mehta', status: 'Document Verification' },
        { applicationId: '#APP-12543', name: 'Neha Kumari', email: 'neha.kumari@example.com', phone: '+91 43210 98765', neetScore: 350, course: 'Ayush', countryInterested: 'Kazakhstan', source: 'Website', counsellor: 'Anjali Mehta', status: 'Visa Processing' },
        { applicationId: '#APP-12542', name: 'Arjun Singh', email: 'arjun.singh@example.com', phone: '+91 32109 87654', neetScore: 445, course: 'MBBS Abroad', countryInterested: 'Georgia', source: 'Instagram Ads', counsellor: 'Neha Sharma', status: 'Document Verification' },
        { applicationId: '#APP-12541', name: 'Meera Patel', email: 'meera.patel@example.com', phone: '+91 21098 76543', neetScore: 520, course: 'BDS', countryInterested: 'India', source: 'Walk In', counsellor: 'Rohit Verma', status: 'Joined' },
      ];
      await Student.create(defaultStudents);
    }

    let query = {};

    if (status) {
      const statusMap = {
        'New': 'Applied',
        'Under Review': 'Document Verification',
        'Shortlisted': 'Visa Processing',
        'Offer Made': 'Joined',
        'Withdrawn': 'Enroute',
        'Rejected': 'Rejected',
      };
      query.status = statusMap[status] || status;
    }

    if (source) {
      query.source = { $regex: source, $options: 'i' };
    }

    if (course) {
      query.course = { $regex: course, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } },
        { countryInterested: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('selectedUniversity', 'name')
      .sort({ createdAt: -1 });

    // Live KPI counts from database
    const totalAppsCount = await Student.countDocuments();
    const newAppsCount = await Student.countDocuments({ status: 'Applied' });
    const underReviewCount = await Student.countDocuments({ status: 'Document Verification' });
    const shortlistedCount = await Student.countDocuments({ status: 'Visa Processing' });
    const offerMadeCount = await Student.countDocuments({ status: 'Joined' });
    const withdrawnCount = await Student.countDocuments({ status: 'Enroute' });
    const rejectedCount = await Student.countDocuments({ status: 'Rejected' });

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      students,
      stats: {
        totalApps: totalAppsCount,
        newApps: newAppsCount,
        underReview: underReviewCount,
        shortlisted: shortlistedCount,
        offerMade: offerMadeCount,
        withdrawn: withdrawnCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student application
// @route   GET /api/students/:id
// @access  Private (Admin)
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('selectedUniversity', 'name');

    if (!student) {
      res.status(404);
      throw new Error('Student application not found');
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student application
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, phone, neetScore, course, countryInterested, source, counsellor, selectedUniversity, status } = req.body;

    if (!name || !phone) {
      res.status(400);
      throw new Error('Please fill applicant name and phone number');
    }

    // Generate unique application ID
    const applicationId = '#APP-' + Math.floor(10000 + Math.random() * 90000);

    const student = await Student.create({
      applicationId,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone,
      neetScore: neetScore || 0,
      course: course || 'MBBS in India',
      countryInterested: countryInterested || 'India',
      source: source || 'Website',
      counsellor: counsellor || 'Neha Sharma',
      selectedUniversity: selectedUniversity || null,
      status: status || 'Applied',
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details / status / university
// @route   PUT /api/students/:id
// @access  Private (Admin)
export const updateStudent = async (req, res, next) => {
  try {
    const { name, email, phone, neetScore, course, countryInterested, source, counsellor, selectedUniversity, status } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student application not found');
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        neetScore,
        course,
        countryInterested,
        source,
        counsellor,
        selectedUniversity: selectedUniversity || null,
        status,
      },
      { new: true, runValidators: true }
    ).populate('selectedUniversity', 'name');

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student application not found');
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
