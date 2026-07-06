import ContactRequest from '../models/ContactRequest.js';
import { sendEmail } from '../utils/mailer.js';

// @desc    Submit a contact inquiry
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const contact = await ContactRequest.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Notify admin
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@mbbsconsultancy.com',
      subject: `New Contact Request: ${subject}`,
      text: `From: ${name} (${email}, ${phone})\nMessage:\n${message}`,
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

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private (Admin)
export const getContacts = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      contacts,
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
    const { status, replyMessage } = req.body;

    let contact = await ContactRequest.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error('Contact message not found');
    }

    // If replyMessage is provided, actually email the user!
    if (replyMessage && replyMessage.trim() !== '') {
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject} - MBBS Consultancy`,
        text: `Dear ${contact.name},\n\nThank you for contacting us. Regarding your query:\n\n"${contact.message}"\n\nResponse:\n${replyMessage}\n\nBest Regards,\nMBBS Consultancy Team`,
      });
      contact.status = 'Replied';
      contact.replyMessage = replyMessage;
    } else if (status) {
      contact.status = status;
    }

    await contact.save();

    res.status(200).json({
      success: true,
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
