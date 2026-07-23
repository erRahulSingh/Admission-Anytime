import AdmissionForm from '../models/AdmissionForm.js';
import ContactRequest from '../models/ContactRequest.js';
import Country from '../models/Country.js';
import University from '../models/University.js';
import Student from '../models/Student.js';

// @desc    Get Admin Dashboard Stats / Analytics (100% Dynamic DB Data)
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Fetch live DB counts directly from MongoDB
    const totalLeadsCount = await AdmissionForm.countDocuments();
    const newLeadsCount = await AdmissionForm.countDocuments({ status: 'Pending' });
    const contactedLeadsCount = await AdmissionForm.countDocuments({ status: 'Contacted' });
    const counsellingLeadsCount = await AdmissionForm.countDocuments({ status: 'In Discussion' });
    const admittedLeadsCount = await AdmissionForm.countDocuments({ status: 'Admitted' });
    const closedLeadsCount = await AdmissionForm.countDocuments({ status: 'Closed' });

    const totalStudentsCount = await Student.countDocuments();
    const joinedStudentsCount = await Student.countDocuments({ status: 'Joined' });

    const totalAdmissionsCount = admittedLeadsCount + joinedStudentsCount;

    // 2. Dynamic Lead Source Distribution from MongoDB aggregation
    const sourceMap = {
      'Website': 'website',
      'Facebook': 'facebookAds',
      'Facebook Ads': 'facebookAds',
      'Google': 'googleAds',
      'Google Ads': 'googleAds',
      'Referral': 'referral',
      'Others': 'others',
    };

    let sources = { website: 0, facebookAds: 0, googleAds: 0, referral: 0, others: 0 };
    const sourceGroups = await AdmissionForm.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    sourceGroups.forEach((g) => {
      const key = sourceMap[g._id] || 'others';
      sources[key] = (sources[key] || 0) + g.count;
    });

    // 3. Dynamic Admission Status
    const admissionStatus = {
      success: totalAdmissionsCount,
      pending: newLeadsCount + contactedLeadsCount + counsellingLeadsCount,
      rejected: closedLeadsCount,
    };

    // 4. Dynamic Top Courses Distribution from MongoDB aggregation
    const courseGroups = await AdmissionForm.aggregate([
      { $group: { _id: '$interestedIn', count: { $sum: 1 } } },
    ]);

    let topCourses = [];
    const courseLabelMap = {
      'India': 'MBBS in India',
      'Abroad': 'MBBS Abroad',
      'Both': 'MBBS India & Abroad',
      'BDS': 'BDS',
      'Nursing': 'Nursing',
      'Ayush': 'Ayush',
    };

    let courseCounts = {};
    let totalCourseLeads = 0;
    courseGroups.forEach((g) => {
      const label = courseLabelMap[g._id] || g._id || 'MBBS Abroad';
      courseCounts[label] = (courseCounts[label] || 0) + g.count;
      totalCourseLeads += g.count;
    });

    if (totalCourseLeads > 0) {
      topCourses = Object.entries(courseCounts)
        .map(([course, count]) => ({
          course,
          percentage: Number(((count / totalCourseLeads) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.percentage - a.percentage);
    } else {
      topCourses = [
        { course: 'MBBS in India', percentage: 0 },
        { course: 'MBBS Abroad', percentage: 0 },
      ];
    }

    // 5. Dynamic Leads by Location/Country
    const countryGroups = await AdmissionForm.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
    ]);

    const totalCountryLeads = countryGroups.reduce((acc, curr) => acc + curr.count, 0);
    let locations = [];
    if (totalCountryLeads > 0) {
      locations = countryGroups
        .map((g) => ({
          state: g._id || 'India',
          percentage: Number(((g.count / totalCountryLeads) * 100).toFixed(1)),
          value: g.count,
        }))
        .sort((a, b) => b.value - a.value);
    } else {
      locations = [{ state: 'India', percentage: 0, value: 0 }];
    }

    // 6. Dynamic Time-series Trends (Group leads by recent days/dates)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendAgg = await AdmissionForm.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          counsellingDone: {
            $sum: { $cond: [{ $eq: ['$status', 'In Discussion'] }, 1, 0] },
          },
          admissions: {
            $sum: { $cond: [{ $eq: ['$status', 'Admitted'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1, '_id.day': 1 } },
    ]);

    let trends = trendAgg.map((item) => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateLabel = `${String(item._id.day).padStart(2, '0')} ${monthNames[item._id.month - 1]}`;
      return {
        date: dateLabel,
        newLeads: item.newLeads || item.total,
        counsellingDone: item.counsellingDone,
        admissions: item.admissions,
      };
    });

    if (trends.length === 0) {
      trends = [
        { date: 'Today', newLeads: totalLeadsCount, counsellingDone: counsellingLeadsCount, admissions: totalAdmissionsCount },
      ];
    }

    // 7. Dynamic Recent Leads Table (Top 5 items sorted by createdAt DESC)
    const dbRecentLeads = await AdmissionForm.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentLeads = dbRecentLeads.map((lead) => {
      let course = 'MBBS Abroad';
      if (lead.interestedIn === 'India') course = 'MBBS in India';
      else if (lead.interestedIn === 'Both') course = 'MBBS India & Abroad';
      else if (lead.interestedIn) course = lead.interestedIn;

      return {
        fullName: lead.fullName,
        phone: lead.phone,
        source: lead.source || 'Website',
        course: course,
        status: lead.status, // Pending, Contacted, In Discussion, Admitted, Closed
        createdAt: lead.createdAt ? lead.createdAt.toISOString() : new Date().toISOString(),
      };
    });

    // Send fully dynamic database stats payload
    res.status(200).json({
      success: true,
      stats: {
        totalLeads: totalLeadsCount,
        newLeads: newLeadsCount,
        contactedLeads: contactedLeadsCount,
        counsellingDone: counsellingLeadsCount,
        applications: totalStudentsCount,
        admissions: totalAdmissionsCount,
      },
      trends,
      sources,
      admissionStatus,
      topCourses,
      locations,
      recentLeads,
    });
  } catch (error) {
    next(error);
  }
};
