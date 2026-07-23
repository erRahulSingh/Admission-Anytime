import NotificationSetting from '../models/NotificationSetting.js';
import Notification from '../models/Notification.js';

// Helper to seed initial notifications feed
const seedDefaultNotifications = async () => {
  const defaults = [
    { title: 'New lead received', description: 'Rahul Sharma has submitted a new enquiry.', category: 'leads', time: '10:30 AM', unread: true, iconType: 'users' },
    { title: 'Application submitted', description: 'Anjali Verma has submitted MBBS application.', category: 'applications', time: '09:15 AM', unread: true, iconType: 'file' },
    { title: 'Counselling scheduled', description: 'Counselling with Vikram Singh at 02:00 PM today.', category: 'counselling', time: 'Yesterday', unread: true, iconType: 'headset' },
    { title: 'Payment received', description: 'Payment of ₹25,000 received from Neha Patel.', category: 'payments', time: 'Yesterday', unread: true, iconType: 'credit' },
    { title: 'Task reminder', description: 'Follow up with Aryan Mehta is due today.', category: 'tasks', time: 'May 30, 2025', unread: false, iconType: 'clock' },
  ];
  await Notification.create(defaults);
};

// @desc    Get Notification Settings and Feed
// @route   GET /api/notifications
// @access  Private (Admin)
export const getNotificationsData = async (req, res, next) => {
  try {
    let settings = await NotificationSetting.findOne();
    if (!settings) {
      settings = await NotificationSetting.create({
        dndEnabled: true,
        quietHoursFrom: '10:00 PM',
        quietHoursTo: '07:00 AM',
        dndDays: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
        matrix: {
          leads: { email: true, inApp: true, sms: false, push: true },
          applications: { email: true, inApp: true, sms: true, push: true },
          counselling: { email: true, inApp: true, sms: false, push: true },
          admissions: { email: true, inApp: true, sms: true, push: true },
          payments: { email: true, inApp: false, sms: true, push: false },
          tasks: { email: false, inApp: true, sms: false, push: true },
          system: { email: true, inApp: true, sms: false, push: true },
          marketing: { email: false, inApp: false, sms: false, push: false },
        },
      });
    }

    let feedCount = await Notification.countDocuments();
    if (feedCount === 0) {
      await seedDefaultNotifications();
    }

    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      settings,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Notification Preferences Matrix & DND
// @route   PUT /api/notifications/preferences
// @access  Private (Admin)
export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const { matrix, dndEnabled, quietHoursFrom, quietHoursTo, dndDays } = req.body;

    let settings = await NotificationSetting.findOne();
    if (!settings) {
      settings = new NotificationSetting();
    }

    if (matrix) settings.matrix = { ...settings.matrix, ...matrix };
    if (dndEnabled !== undefined) settings.dndEnabled = dndEnabled;
    if (quietHoursFrom) settings.quietHoursFrom = quietHoursFrom;
    if (quietHoursTo) settings.quietHoursTo = quietHoursTo;
    if (dndDays) settings.dndDays = { ...settings.dndDays, ...dndDays };

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Notification preferences saved successfully in database!',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private (Admin)
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ unread: true }, { unread: false });

    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read!',
      notifications,
    });
  } catch (error) {
    next(error);
  }
};
