import mongoose from 'mongoose';
import AdmissionForm from '../models/AdmissionForm.js';
import { sendNotificationEmails } from '../utils/mailer.js';

// @desc    Submit new admission form (Lead)
// @route   POST /api/admissions
// @access  Public
// In-memory fallback array for local dev/offline mode
let localFallbackLeads = [
  {
    _id: "lead-fallback-1",
    fullName: "Priyesh Patel",
    email: "priyesh@gmail.com",
    phone: "6284063840",
    neetScore: 420,
    interestedIn: "Abroad",
    country: "Georgia",
    status: "Pending",
    source: "Website",
    notes: "Interested in Tbilisi State Medical University. Budget is around 25 Lakhs.",
    createdAt: new Date(),
  },
  {
    _id: "lead-fallback-2",
    fullName: "Meera Nair",
    email: "meera@gmail.com",
    phone: "9988776655",
    neetScore: 580,
    interestedIn: "Both",
    country: "India",
    status: "Contacted",
    source: "Website - Popup",
    notes: "Prefers government seats. Wants options in south India deemed universities.",
    createdAt: new Date(),
  }
];

// @desc    Submit new admission form (Lead)
// @route   POST /api/admissions
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const { fullName, phone, email, neetScore, interestedIn, country, source } = req.body;

    if (!fullName || !phone) {
      res.status(400);
      throw new Error('Please fill name and phone number');
    }

    const leadData = {
      fullName,
      phone,
      email: email || '',
      neetScore: neetScore !== undefined && neetScore !== null ? Number(neetScore) : 0,
      interestedIn: interestedIn || 'Both',
      country: country || 'India & Abroad',
      source: source || 'Website',
      status: 'Pending',
      notes: '',
    };

    let lead = null;
    if (mongoose.connection.readyState === 1) {
      lead = await AdmissionForm.create(leadData);

      // Send async emails
      sendNotificationEmails(lead).catch((err) =>
        console.error('Failed to send notification emails:', err.message)
      );
    } else {
      console.warn('DB not connected (readyState !== 1). Inquiry stored in memory fallback.');
      lead = { _id: `lead-mem-${Date.now()}`, ...leadData, createdAt: new Date() };
      localFallbackLeads.unshift(lead);
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    
    if (mongoose.connection.readyState === 1) {
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
          { source: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await AdmissionForm.countDocuments(query);
      const leads = await AdmissionForm.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        success: true,
        count: leads.length,
        total,
        pages: Math.ceil(total / limit),
        leads,
      });
    } else {
      console.warn('DB offline / fallback mode. Returning local in-memory leads.');
      let filtered = [...localFallbackLeads];
      if (status) {
        filtered = filtered.filter(l => l.status === status);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(l => 
          l.fullName?.toLowerCase().includes(s) || 
          l.phone?.toLowerCase().includes(s) || 
          l.email?.toLowerCase().includes(s)
        );
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        total: filtered.length,
        pages: 1,
        leads: filtered,
      });
    }
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
