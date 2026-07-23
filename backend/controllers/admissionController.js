import mongoose from 'mongoose';
import AdmissionForm from '../models/AdmissionForm.js';
import Student from '../models/Student.js';
import { sendNotificationEmails } from '../utils/mailer.js';

// @desc    Submit new admission form (Lead)
// @route   POST /api/admissions
// @access  Public
export const createLead = async (req, res, next) => {
  try {
    const { fullName, phone, email, neetScore, interestedIn, country, source, notes, status } = req.body;

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
      status: status || 'Pending',
      notes: notes || '',
    };

    const lead = await AdmissionForm.create(leadData);

    // Send async notification email
    sendNotificationEmails(lead).catch((err) =>
      console.error('Failed to send notification emails:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Lead created successfully!',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads with live DB metrics & filters
// @route   GET /api/admissions
// @access  Private (Admin)
export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const { status, search, source, interestedIn } = req.query;

    // Check if DB is empty; if so, auto-seed sample admission records
    const initialCount = await AdmissionForm.countDocuments();
    if (initialCount === 0) {
      const defaultLeads = [
        { fullName: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.sharma@email.com', interestedIn: 'India', country: 'India', status: 'Admitted', source: 'Google Ads', notes: 'Confirmed admission in B.Tech CSE' },
        { fullName: 'Anjali Verma', phone: '+91 87654 32109', email: 'anjali.verma@email.com', interestedIn: 'Abroad', country: 'Georgia', status: 'Pending', source: 'Website', notes: 'Counseling scheduled for BBA' },
        { fullName: 'Vikram Singh', phone: '+91 76543 21098', email: 'vikram.singh@email.com', interestedIn: 'Both', country: 'Russia', status: 'Admitted', source: 'Facebook Ads', notes: 'BCA admission confirmed' },
        { fullName: 'Pooja Mehta', phone: '+91 65432 10987', email: 'pooja.mehta@email.com', interestedIn: 'India', country: 'India', status: 'Pending', source: 'Website', notes: 'B.Com course discussion' },
        { fullName: 'Arjun Patel', phone: '+91 54321 09876', email: 'arjun.patel@email.com', interestedIn: 'Abroad', country: 'Kazakhstan', status: 'Admitted', source: 'Referral', notes: 'MBA Enrolled' },
        { fullName: 'Neha Gupta', phone: '+91 43210 98765', email: 'neha.gupta@email.com', interestedIn: 'India', country: 'India', status: 'Closed', source: 'Google Ads', notes: 'Application rejected due to low cutoff' },
        { fullName: 'Sagar Kumar', phone: '+91 32109 87654', email: 'sagar.kumar@email.com', interestedIn: 'Abroad', country: 'Georgia', status: 'In Discussion', source: 'Website', notes: 'Pending document verification' },
        { fullName: 'Riya Sharma', phone: '+91 21098 76543', email: 'riya.sharma@email.com', interestedIn: 'Both', country: 'India', status: 'Admitted', source: 'Instagram Ads', notes: 'Confirmed seat BBA' },
      ];
      await AdmissionForm.create(defaultLeads);
    }

    let query = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = { $regex: source, $options: 'i' };
    }

    if (interestedIn) {
      query.interestedIn = interestedIn;
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

    // Live KPI counts from database
    const totalLeadsCount = await AdmissionForm.countDocuments();
    const newLeadsCount = await AdmissionForm.countDocuments({ status: 'Pending' });
    const contactedCount = await AdmissionForm.countDocuments({ status: 'Contacted' });
    const counsellingCount = await AdmissionForm.countDocuments({ status: 'In Discussion' });
    const admittedCount = await AdmissionForm.countDocuments({ status: 'Admitted' });
    const closedCount = await AdmissionForm.countDocuments({ status: 'Closed' });

    const totalStudents = await Student.countDocuments();
    const joinedStudents = await Student.countDocuments({ status: 'Joined' });

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      pages: Math.ceil(total / limit),
      leads,
      stats: {
        totalLeads: totalLeadsCount,
        newLeads: newLeadsCount,
        contacted: contactedCount,
        counselling: counsellingCount,
        applications: totalStudents,
        admissions: admittedCount + joinedStudents,
        closed: closedCount,
      },
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
    const { fullName, phone, email, neetScore, interestedIn, country, status, notes, source } = req.body;

    let lead = await AdmissionForm.findById(req.params.id);

    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }

    lead = await AdmissionForm.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, email, neetScore, interestedIn, country, status, notes, source },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
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
