import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: true },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a role name'],
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    userCount: {
      type: Number,
      default: 0,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    permissions: {
      leads: { type: permissionSchema, default: () => ({ create: true, read: true, update: true, delete: false }) },
      applications: { type: permissionSchema, default: () => ({ create: true, read: true, update: true, delete: false }) },
      counselling: { type: permissionSchema, default: () => ({ create: true, read: true, update: true, delete: false }) },
      admissions: { type: permissionSchema, default: () => ({ create: false, read: true, update: false, delete: false }) },
      marketing: { type: permissionSchema, default: () => ({ create: false, read: true, update: false, delete: false }) },
      reports: { type: permissionSchema, default: () => ({ create: false, read: true, update: false, delete: false }) },
      users: { type: permissionSchema, default: () => ({ create: false, read: false, update: false, delete: false }) },
      settings: { type: permissionSchema, default: () => ({ create: false, read: false, update: false, delete: false }) },
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
