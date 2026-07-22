import AdmissionForm from '../models/AdmissionForm.js';
import ContactRequest from '../models/ContactRequest.js';
import Country from '../models/Country.js';
import University from '../models/University.js';
import Student from '../models/Student.js';
import Blog from '../models/Blog.js';

// @desc    Get Admin Dashboard Stats / Analytics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalLeads = await AdmissionForm.countDocuments();
    const pendingLeads = await AdmissionForm.countDocuments({ status: 'Pending' });
    const contactedLeads = await AdmissionForm.countDocuments({ status: 'Contacted' });
    const discussionLeads = await AdmissionForm.countDocuments({ status: 'In Discussion' });
    const admittedLeads = await AdmissionForm.countDocuments({ status: 'Admitted' });

    const totalContacts = await ContactRequest.countDocuments();
    const unreadContacts = await ContactRequest.countDocuments({ status: 'Unread' });

    const totalCountries = await Country.countDocuments();
    const totalUniversities = await University.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // Recent leads list
    const recentLeads = await AdmissionForm.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent contact messages
    const recentContacts = await ContactRequest.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Get statistics grouped by country interest for charts
    const countryStats = await AdmissionForm.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Monthly lead counts for chart
    const monthlyStats = await AdmissionForm.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        pendingLeads,
        contactedLeads,
        discussionLeads,
        admittedLeads,
        totalContacts,
        unreadContacts,
        totalCountries,
        totalUniversities,
        totalStudents,
        totalBlogs,
      },
      recentLeads,
      recentContacts,
      charts: {
        countryStats,
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
