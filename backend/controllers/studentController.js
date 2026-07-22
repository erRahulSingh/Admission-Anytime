import Student from '../models/Student.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin)
export const getStudents = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('selectedUniversity', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (Admin)
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('selectedUniversity', 'name');

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = async (req, res, next) => {
  try {
    const { name, email, phone, neetScore, countryInterested, selectedUniversity, status } = req.body;

    if (!name || !email || !phone || !neetScore || !countryInterested) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      res.status(400);
      throw new Error('Student with this email already exists');
    }

    // Generate unique application ID
    const applicationId = 'APP' + Math.floor(100000 + Math.random() * 900000);

    const student = await Student.create({
      applicationId,
      name,
      email,
      phone,
      neetScore,
      countryInterested,
      selectedUniversity: selectedUniversity || null,
      status: status || 'Applied',
    });

    res.status(201).json({
      success: true,
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
    const { name, email, phone, neetScore, countryInterested, selectedUniversity, status } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        neetScore,
        countryInterested,
        selectedUniversity: selectedUniversity || null,
        status,
      },
      { new: true, runValidators: true }
    ).populate('selectedUniversity', 'name');

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
