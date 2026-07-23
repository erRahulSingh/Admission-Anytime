import Setting from '../models/Setting.js';

// @desc    Get General Settings
// @route   GET /api/settings
// @access  Private (Admin)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();

    // Auto-seed default settings if none exist
    if (!settings) {
      settings = await Setting.create({
        companyProfile: {
          name: 'Admission Anytime',
          email: 'info@admissionanytime.com',
          phone: '+91 98765 43210',
          website: 'https://admissionanytime.com',
          address: '123, Education Street, Sector 62, Noida, Uttar Pradesh - 201301, India',
          industry: 'Education Services',
          country: 'India',
          timeZone: '(GMT +05:30) Asia/Kolkata',
        },
        systemPreferences: {
          allowDuplicates: false,
          leadScore: true,
          autoAssign: true,
          applicationAutoNum: true,
          whatsappIntegration: true,
          dataVisibility: false,
          emailNotifications: true,
          maintenanceMode: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update General Settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    const { companyProfile, systemPreferences } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({
        companyProfile,
        systemPreferences,
      });
    } else {
      if (companyProfile) settings.companyProfile = { ...settings.companyProfile, ...companyProfile };
      if (systemPreferences) settings.systemPreferences = { ...settings.systemPreferences, ...systemPreferences };

      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'General settings updated successfully in database!',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
