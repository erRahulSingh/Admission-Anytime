import mongoose from 'mongoose';
import AdmissionForm from '../models/AdmissionForm.js';
import { sendNotificationEmails } from '../utils/mailer.js';

// @desc    Submit new admission form (Lead)
// @route   POST /api/admissions
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const { fullName, phone, email, neetScore, interestedIn, country } = req.body;

    if (!fullName || !phone || !email || neetScore === undefined || neetScore === null || !country) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    let lead = null;
    if (mongoose.connection.readyState === 1) {
      lead = await AdmissionForm.create({
        fullName,
        phone,
        email,
        neetScore,
        interestedIn,
        country,
      });

      // Send async emails
      sendNotificationEmails(lead).catch((err) =>
        console.error('Failed to send notification emails:', err.message)
      );
    } else {
      console.warn('DB not connected (readyState !== 1). Inquiry acknowledged client-side.');
      lead = { fullName, phone, email, neetScore, interestedIn, country, createdAt: new Date() };
    }

    res.status(201).json({
      success: true,
      message: 'Admission query submitted successfully!',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads
// @route   GET /api/admissions
// @access  Private (Admin)
export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await AdmissionForm.countDocuments(query);
    const leads = await AdmissionForm.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pages: Math.ceil(total / limit),
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead details / status / notes
// @route   PUT /api/admissions/:id
// @access  Private (Admin)
export const updateLead = async (req, res, next) => {
  try {
    const { fullName, phone, email, neetScore, interestedIn, country, status, notes } = req.body;

    let lead = await AdmissionForm.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    lead = await AdmissionForm.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, email, neetScore, interestedIn, country, status, notes },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/admissions/:id
// @access  Private (Admin)
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await AdmissionForm.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
