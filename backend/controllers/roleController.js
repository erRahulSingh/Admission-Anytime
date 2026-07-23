import Role from '../models/Role.js';
import Admin from '../models/Admin.js';

// Helper to seed default system roles if database is empty
const seedDefaultRoles = async () => {
  const fullAccess = { create: true, read: true, update: true, delete: true };
  const readOnly = { create: false, read: true, update: false, delete: false };
  const standardAccess = { create: true, read: true, update: true, delete: false };

  const defaultRoles = [
    {
      name: 'Super Admin',
      description: 'Full system access across all modules and configuration settings.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Super Admin' }) || 2,
      permissions: {
        leads: fullAccess,
        applications: fullAccess,
        counselling: fullAccess,
        admissions: fullAccess,
        marketing: fullAccess,
        reports: fullAccess,
        users: fullAccess,
        settings: fullAccess,
      },
    },
    {
      name: 'Senior Counsellor',
      description: 'Manages student counselling, leads, and oversees junior counsellors.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Senior Counsellor' }) || 18,
      permissions: {
        leads: standardAccess,
        applications: standardAccess,
        counselling: fullAccess,
        admissions: standardAccess,
        marketing: readOnly,
        reports: readOnly,
        users: readOnly,
        settings: readOnly,
      },
    },
    {
      name: 'Counsellor',
      description: 'Handles student leads, conducts counselling sessions and submits applications.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Counsellor' }) || 50,
      permissions: {
        leads: standardAccess,
        applications: standardAccess,
        counselling: standardAccess,
        admissions: readOnly,
        marketing: { create: false, read: false, update: false, delete: false },
        reports: readOnly,
        users: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
      },
    },
    {
      name: 'Admission Officer',
      description: 'Manages university applications, document verification, and seat allotments.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Admission Officer' }) || 32,
      permissions: {
        leads: readOnly,
        applications: fullAccess,
        counselling: readOnly,
        admissions: fullAccess,
        marketing: readOnly,
        reports: standardAccess,
        users: readOnly,
        settings: readOnly,
      },
    },
    {
      name: 'Telecaller',
      description: 'Conducts outbound calling and initial qualification of student inquiries.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Telecaller' }) || 16,
      permissions: {
        leads: standardAccess,
        applications: readOnly,
        counselling: readOnly,
        admissions: { create: false, read: false, update: false, delete: false },
        marketing: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
      },
    },
    {
      name: 'Marketing Manager',
      description: 'Oversees digital campaigns, ad budgets, lead sources, and ROI analytics.',
      isSystem: true,
      userCount: await Admin.countDocuments({ role: 'Marketing Manager' }) || 18,
      permissions: {
        leads: readOnly,
        applications: readOnly,
        counselling: readOnly,
        admissions: readOnly,
        marketing: fullAccess,
        reports: fullAccess,
        users: readOnly,
        settings: readOnly,
      },
    },
  ];

  await Role.create(defaultRoles);
};

// @desc    Get all roles with permissions
// @route   GET /api/roles
// @access  Private (Admin)
export const getRoles = async (req, res, next) => {
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      await seedDefaultRoles();
    }

    const { search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const roles = await Role.find(query).sort({ isSystem: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new custom role
// @route   POST /api/roles
// @access  Private (Admin)
export const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please enter a role name');
    }

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      res.status(400);
      throw new Error('A role with this name already exists');
    }

    const role = await Role.create({
      name,
      description: description || '',
      isSystem: false,
      userCount: 0,
      permissions: permissions || {},
    });

    res.status(201).json({
      success: true,
      message: 'New role created successfully!',
      role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role permissions or details
// @route   PUT /api/roles/:id
// @access  Private (Admin)
export const updateRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    let role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404);
      throw new Error('Role not found');
    }

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;

    await role.save();

    res.status(200).json({
      success: true,
      message: `Permissions updated successfully for "${role.name}"!`,
      role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom role
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404);
      throw new Error('Role not found');
    }

    if (role.isSystem) {
      res.status(400);
      throw new Error('System roles cannot be deleted');
    }

    await role.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
