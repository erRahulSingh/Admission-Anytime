import ContactRequest from '../models/ContactRequest.js';
import { sendEmail } from '../utils/mailer.js';

// @desc    Submit a contact / counselling inquiry
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, status } = req.body;

    if (!name || !phone) {
      res.status(400);
      throw new Error('Please fill name and phone number');
    }

    const contact = await ContactRequest.create({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone,
      subject: subject || 'Counselling Inquiry',
      message: message || 'Student requested career counseling guidance.',
      status: status || 'Unread',
    });

    // Notify admin asynchronously
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@admissionanytime.com',
      subject: `New Counselling Request: ${subject || 'Inquiry'}`,
      text: `From: ${name} (${email}, ${phone})\nMessage:\n${message || 'Counseling requested'}`,
    }).catch((err) => console.error('Failed to notify admin of contact:', err.message));

    res.status(201).json({
      success: true,
      message: 'Inquiry received. We will get back to you soon!',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages / counselling inquiries with live DB stats
// @route   GET /api/contacts
// @access  Private (Admin)
export const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    // Auto-seed sample counseling requests if DB collection is empty
    const initialCount = await ContactRequest.countDocuments();
    if (initialCount === 0) {
      const defaultContacts = [
        { name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '+91 98765 43210', subject: 'MBBS in India Counseling', message: 'Requested guidance for NEET cutoff 540 marks in govt colleges.', status: 'Replied', replyMessage: 'Counseling scheduled for 31 May at 10:30 AM.' },
        { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 87654 32109', subject: 'Georgia MBBS Inquiry', message: 'Wants fee structure & NMC eligibility for Tbilisi State Medical University.', status: 'Unread' },
        { name: 'Rahul Verma', email: 'rahul.verma@example.com', phone: '+91 76543 21098', subject: 'Russia Medical Colleges', message: 'Needs guidance for Kazan Federal University September intake.', status: 'Read' },
        { name: 'Sneha Singh', email: 'sneha.singh@example.com', phone: '+91 65432 10987', subject: 'Nursing & Abroad Counseling', message: 'Inquiring for Kazakhstan medical universities.', status: 'Unread' },
        { name: 'Vikash Yadav', email: 'vikash.yadav@example.com', phone: '+91 54321 09876', subject: 'Private Medical Seat Inquiry', message: 'Wants guidance for Karnataka deemed medical colleges.', status: 'Replied', replyMessage: 'Telephonic counseling completed.' },
        { name: 'Neha Kumari', email: 'neha.kumari@example.com', phone: '+91 43210 98765', subject: 'Ayush & BAMS Seats', message: 'Looking for top Ayurvedic medical colleges in UP.', status: 'Unread' },
        { name: 'Arjun Singh', email: 'arjun.singh@example.com', phone: '+91 32109 87654', subject: 'MBBS Abroad Admission', message: 'Wants guidance on visa processing for Georgia.', status: 'Read' },
        { name: 'Meera Patel', email: 'meera.patel@example.com', phone: '+91 21098 76543', subject: 'Walk-in Counselling Session', message: 'Visited Noida office for BDS course counseling.', status: 'Replied', replyMessage: 'Shortlisted colleges provided.' },
      ];
      await ContactRequest.create(defaultContacts);
    }

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ContactRequest.countDocuments(query);
    const contacts = await ContactRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Live KPI counts from database
    const totalCount = await ContactRequest.countDocuments();
    const unreadCount = await ContactRequest.countDocuments({ status: 'Unread' });
    const readCount = await ContactRequest.countDocuments({ status: 'Read' });
    const repliedCount = await ContactRequest.countDocuments({ status: 'Replied' });

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      contacts,
      stats: {
        totalSessions: totalCount,
        pendingSessions: unreadCount + readCount,
        completedSessions: repliedCount,
        unread: unreadCount,
        read: readCount,
        replied: repliedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark read / Reply contact
// @route   PUT /api/contacts/:id
// @access  Private (Admin)
export const updateContact = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message, status, replyMessage } = req.body;

    let contact = await ContactRequest.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error('Contact message not found');
    }

    if (replyMessage && replyMessage.trim() !== '') {
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject || 'Counselling Request'} - MBBS Consultancy`,
        text: `Dear ${contact.name},\n\nThank you for contacting us. Regarding your query:\n\n"${contact.message}"\n\nResponse:\n${replyMessage}\n\nBest Regards,\nAdmission Anytime Team`,
      }).catch((e) => console.error('Failed sending reply email:', e.message));
      contact.status = 'Replied';
      contact.replyMessage = replyMessage;
    }

    if (status) contact.status = status;
    if (name) contact.name = name;
    if (phone) contact.phone = phone;
    if (email) contact.email = email;
    if (subject) contact.subject = subject;
    if (message) contact.message = message;

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await ContactRequest.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error('Contact message not found');
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
