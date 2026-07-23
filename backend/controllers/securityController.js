import SecuritySetting from '../models/SecuritySetting.js';

// @desc    Get Security Settings & Whitelisted IPs
// @route   GET /api/security
// @access  Private (Admin)
export const getSecurityData = async (req, res, next) => {
  try {
    let security = await SecuritySetting.findOne();
    if (!security) {
      security = await SecuritySetting.create({
        twoFactorEnabled: false,
        twoFactorMethod: 'Authenticator App',
        ipRestrictionEnabled: true,
        whitelistedIps: [
          { ip: '192.168.1.10', label: 'Office Main Network' },
          { ip: '103.21.45.67', label: 'Backup Branch Office' },
        ],
        loginAlerts: true,
        autoLogoutInactive: true,
        enforceStrongPassword: true,
      });
    }

    res.status(200).json({
      success: true,
      security,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Security Policy Toggles & 2FA
// @route   PUT /api/security
// @access  Private (Admin)
export const updateSecuritySettings = async (req, res, next) => {
  try {
    const {
      twoFactorEnabled,
      twoFactorMethod,
      ipRestrictionEnabled,
      loginAlerts,
      autoLogoutInactive,
      enforceStrongPassword,
    } = req.body;

    let security = await SecuritySetting.findOne();
    if (!security) {
      security = new SecuritySetting();
    }

    if (twoFactorEnabled !== undefined) security.twoFactorEnabled = twoFactorEnabled;
    if (twoFactorMethod) security.twoFactorMethod = twoFactorMethod;
    if (ipRestrictionEnabled !== undefined) security.ipRestrictionEnabled = ipRestrictionEnabled;
    if (loginAlerts !== undefined) security.loginAlerts = loginAlerts;
    if (autoLogoutInactive !== undefined) security.autoLogoutInactive = autoLogoutInactive;
    if (enforceStrongPassword !== undefined) security.enforceStrongPassword = enforceStrongPassword;

    await security.save();

    res.status(200).json({
      success: true,
      message: 'Security settings updated successfully in database!',
      security,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Whitelisted IP Address
// @route   POST /api/security/ip
// @access  Private (Admin)
export const addWhitelistedIp = async (req, res, next) => {
  try {
    const { ip, label } = req.body;

    if (!ip) {
      res.status(400);
      throw new Error('Please provide a valid IP address');
    }

    let security = await SecuritySetting.findOne();
    if (!security) {
      security = await SecuritySetting.create({});
    }

    security.whitelistedIps.push({
      ip,
      label: label || 'Office Network',
      addedAt: new Date(),
    });

    await security.save();

    res.status(201).json({
      success: true,
      message: `IP ${ip} added to whitelist successfully!`,
      security,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Whitelisted IP Address
// @route   DELETE /api/security/ip/:id
// @access  Private (Admin)
export const deleteWhitelistedIp = async (req, res, next) => {
  try {
    let security = await SecuritySetting.findOne();
    if (!security) {
      res.status(404);
      throw new Error('Security settings not found');
    }

    security.whitelistedIps = security.whitelistedIps.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await security.save();

    res.status(200).json({
      success: true,
      message: 'IP address removed from whitelist successfully!',
      security,
    });
  } catch (error) {
    next(error);
  }
};
