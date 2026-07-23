"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCog,
  FaUser,
  FaUserShield,
  FaBolt,
  FaPlug,
  FaBell,
  FaShieldAlt,
  FaCreditCard,
  FaCheck,
  FaBuilding,
  FaSlidersH,
  FaWpforms,
  FaHeadset,
  FaGraduationCap,
  FaEnvelope,
  FaFileAlt,
  FaCloudDownloadAlt,
  FaHistory,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBullhorn,
  FaUsers,
  FaSave,
  FaSync,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaDesktop,
  FaMobileAlt,
  FaShieldVirus,
  FaPlus,
  FaSearch,
  FaTrash,
  FaTimes,
  FaCrown,
  FaSms,
  FaMoon,
  FaInfoCircle,
  FaNetworkWired,
  FaDownload,
  FaStar,
} from "react-icons/fa";
import api from "@/services/api";

export default function AdminSettingsPage() {
  // Top Active Sub-tab State ("General Settings" | "Account" | "Roles & Permissions" | "Notifications" | "Security" | "Billing")
  const [activeTab, setActiveTab] = useState("General Settings");

  // Left Sub-category State (for General Settings view)
  const [activeCategory, setActiveCategory] = useState("Company Profile");

  // Loading & Submitting State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General Settings Form State
  const [companyForm, setCompanyForm] = useState({
    name: "Admission Anytime",
    email: "info@admissionanytime.com",
    phone: "+91 98765 43210",
    website: "https://admissionanytime.com",
    address: "123, Education Street, Sector 62, Noida, Uttar Pradesh - 201301, India",
    industry: "Education Services",
    country: "India",
    timeZone: "(GMT +05:30) Asia/Kolkata",
  });

  // General Settings Toggles State
  const [toggles, setToggles] = useState({
    allowDuplicates: false,
    leadScore: true,
    autoAssign: true,
    applicationAutoNum: true,
    whatsappIntegration: true,
    dataVisibility: false,
    emailNotifications: true,
    maintenanceMode: false,
  });

  // Account Profile State
  const [accountForm, setAccountForm] = useState({
    fullName: "Admin User",
    email: "admin@admissionanytime.com",
    phone: "+91 98765 43210",
    role: "Super Admin",
    language: "English",
    timezone: "(GMT +05:30) Asia/Kolkata",
    dateFormat: "DD MMM YYYY (31 May 2025)",
    timeFormat: "12 Hour (05:30 PM)",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [emailPreferences, setEmailPreferences] = useState({
    accountNotifications: true,
    applicationUpdates: true,
    marketingPromotions: false,
    weeklyReports: true,
    systemAlerts: true,
  });
  const [prefSaving, setPrefSaving] = useState(false);

  // Roles State
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [searchRoleQuery, setSearchRoleQuery] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: "", description: "" });
  const [roleSaving, setRoleSaving] = useState(false);

  // Notifications State
  const [notifMatrix, setNotifMatrix] = useState<any>({
    leads: { email: true, inApp: true, sms: false, push: true },
    applications: { email: true, inApp: true, sms: true, push: true },
    counselling: { email: true, inApp: true, sms: false, push: true },
    admissions: { email: true, inApp: true, sms: true, push: true },
    payments: { email: true, inApp: false, sms: true, push: false },
    tasks: { email: false, inApp: true, sms: false, push: true },
    system: { email: true, inApp: true, sms: false, push: true },
    marketing: { email: false, inApp: false, sms: false, push: false },
  });
  const [dndToggle, setDndToggle] = useState(true);
  const [dndFrom, setDndFrom] = useState("10:00 PM");
  const [dndTo, setDndTo] = useState("07:00 AM");
  const [dndDays, setDndDays] = useState<{ [key: string]: boolean }>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [notifSaving, setNotifSaving] = useState(false);

  // Security State
  const [securityForm, setSecurityForm] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: "Authenticator App",
    ipRestrictionEnabled: true,
    loginAlerts: true,
    autoLogoutInactive: true,
    enforceStrongPassword: true,
  });
  const [whitelistedIps, setWhitelistedIps] = useState<any[]>([]);
  const [isAddIpOpen, setIsAddIpOpen] = useState(false);
  const [newIpForm, setNewIpForm] = useState({ ip: "", label: "" });
  const [secSaving, setSecSaving] = useState(false);

  // ════════════════════════════════════════════════════════════════
  // BILLING & PRICING DYNAMIC BACKEND STATE
  // ════════════════════════════════════════════════════════════════
  const [billingData, setBillingData] = useState<any>({
    currentPlan: {
      name: "Pro Plan (Growth)",
      price: "₹14,999 / month",
      billingCycle: "Billed Annually",
      nextRenewal: "31 May 2026",
      status: "Active",
    },
    usage: {
      leadsUsed: 12450,
      leadsLimit: 25000,
      usersCount: 158,
      usersLimit: 200,
      smsCreditsUsed: 45000,
      smsCreditsLimit: 50000,
      storageUsedGB: 14.2,
      storageLimitGB: 50,
    },
    plans: [],
    paymentMethod: {
      cardBrand: "HDFC Bank Credit Card",
      last4: "4242",
      expiry: "08/28",
      holderName: "Admission Anytime Pvt Ltd",
    },
    invoices: [],
  });
  const [planUpgrading, setPlanUpgrading] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Billing Data from Backend DB
  async function loadBillingFromDB() {
    try {
      const res: any = await api.get("/billing");
      if (res?.success && res.billing) {
        setBillingData(res.billing);
      }
    } catch (error) {
      console.error("Failed to load billing data from DB:", error);
    }
  }

  // Fetch Security Data from Backend DB
  async function loadSecurityFromDB() {
    try {
      const res: any = await api.get("/security");
      if (res?.success && res.security) {
        setSecurityForm({
          twoFactorEnabled: !!res.security.twoFactorEnabled,
          twoFactorMethod: res.security.twoFactorMethod || "Authenticator App",
          ipRestrictionEnabled: !!res.security.ipRestrictionEnabled,
          loginAlerts: !!res.security.loginAlerts,
          autoLogoutInactive: !!res.security.autoLogoutInactive,
          enforceStrongPassword: !!res.security.enforceStrongPassword,
        });
        if (res.security.whitelistedIps) setWhitelistedIps(res.security.whitelistedIps);
      }
    } catch (error) {
      console.error("Failed to load security settings from DB:", error);
    }
  }

  // Fetch Notifications Data from Backend DB
  async function loadNotificationsFromDB() {
    try {
      const res: any = await api.get("/notifications");
      if (res?.success) {
        if (res.settings) {
          if (res.settings.matrix) setNotifMatrix(res.settings.matrix);
          if (res.settings.dndEnabled !== undefined) setDndToggle(res.settings.dndEnabled);
          if (res.settings.quietHoursFrom) setDndFrom(res.settings.quietHoursFrom);
          if (res.settings.quietHoursTo) setDndTo(res.settings.quietHoursTo);
          if (res.settings.dndDays) setDndDays(res.settings.dndDays);
        }
        if (res.notifications) setRecentNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Failed to load notification settings from DB:", error);
    }
  }

  // Fetch Roles from Backend API
  async function loadRolesFromDB() {
    try {
      const res: any = await api.get("/roles");
      if (res?.success && res.roles) {
        setRolesList(res.roles);
        if (!selectedRoleId && res.roles.length > 0) {
          setSelectedRoleId(res.roles[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to load roles from DB:", error);
    }
  }

  // Load All System Settings Data
  async function loadDataFromDB() {
    try {
      setLoading(true);
      const settingsRes: any = await api.get("/settings");
      if (settingsRes?.success && settingsRes.settings) {
        if (settingsRes.settings.companyProfile) setCompanyForm(settingsRes.settings.companyProfile);
        if (settingsRes.settings.systemPreferences) setToggles(settingsRes.settings.systemPreferences);
      }

      const meRes: any = await api.get("/auth/me");
      if (meRes?.success && meRes.admin) {
        const u = meRes.admin;
        setAccountForm({
          fullName: u.name || "Admin User",
          email: u.email || "admin@admissionanytime.com",
          phone: u.phone || "+91 98765 43210",
          role: u.role || "Super Admin",
          language: u.language || "English",
          timezone: u.timezone || "(GMT +05:30) Asia/Kolkata",
          dateFormat: u.dateFormat || "DD MMM YYYY (31 May 2025)",
          timeFormat: u.timeFormat || "12 Hour (05:30 PM)",
          avatar: u.avatar || "",
        });
        if (u.emailPreferences) setEmailPreferences({ ...emailPreferences, ...u.emailPreferences });
      }

      await loadRolesFromDB();
      await loadNotificationsFromDB();
      await loadSecurityFromDB();
      await loadBillingFromDB();
    } catch (error) {
      console.error("Failed to load settings data from DB:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDataFromDB();
  }, []);

  useEffect(() => {
    if (activeTab === "Roles & Permissions") loadRolesFromDB();
    if (activeTab === "Notifications") loadNotificationsFromDB();
    if (activeTab === "Security") loadSecurityFromDB();
    if (activeTab === "Billing") loadBillingFromDB();
  }, [activeTab]);

  // Save General Settings
  const handleSaveGeneralSettings = async () => {
    try {
      setSaving(true);
      const res: any = await api.put("/settings", {
        companyProfile: companyForm,
        systemPreferences: toggles,
      });

      if (res?.success) {
        showToast("General settings saved successfully to MongoDB!");
      }
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      showToast(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Save Account Profile
  const handleSaveAccountProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res: any = await api.put("/auth/profile", {
        name: accountForm.fullName,
        email: accountForm.email,
        phone: accountForm.phone,
        language: accountForm.language,
        timezone: accountForm.timezone,
        dateFormat: accountForm.dateFormat,
        timeFormat: accountForm.timeFormat,
      });

      if (res?.success) {
        showToast("Account profile updated successfully in database!");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      showToast(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast("Please fill in current and new password!");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New password and confirm password do not match!");
      return;
    }

    try {
      setPasswordUpdating(true);
      const res: any = await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res?.success) {
        showToast("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      showToast(error.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Save Email Preferences
  const handleSaveEmailPreferences = async () => {
    try {
      setPrefSaving(true);
      const res: any = await api.put("/auth/preferences", {
        emailPreferences,
      });

      if (res?.success) {
        showToast("Email preferences saved successfully!");
      }
    } catch (error: any) {
      console.error("Failed to save email preferences:", error);
      showToast(error.response?.data?.message || "Failed to save preferences");
    } finally {
      setPrefSaving(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // BILLING & PRICING ACTIONS (MongoDB Persistence)
  // ════════════════════════════════════════════════════════════════
  const handleUpgradePlan = async (planName: string, price: string) => {
    try {
      setPlanUpgrading(true);
      const res: any = await api.put("/billing/plan", {
        planName,
        price,
        billingCycle: "Billed Annually",
      });

      if (res?.success) {
        showToast(`Subscription plan updated to "${planName}"!`);
        loadBillingFromDB();
      }
    } catch (error) {
      console.error("Failed to upgrade plan:", error);
      showToast("Failed to update plan");
    } finally {
      setPlanUpgrading(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    showToast(`Downloading invoice PDF for ${invoiceId}...`);
  };

  // Notifications Actions
  const toggleNotifChannel = (categoryKey: string, channelKey: string) => {
    setNotifMatrix((prev: any) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [channelKey]: !prev[categoryKey][channelKey],
      },
    }));
  };

  const handleSaveNotificationPreferences = async () => {
    try {
      setNotifSaving(true);
      const res: any = await api.put("/notifications/preferences", {
        matrix: notifMatrix,
        dndEnabled: dndToggle,
        quietHoursFrom: dndFrom,
        quietHoursTo: dndTo,
        dndDays,
      });

      if (res?.success) {
        showToast("Notification settings saved successfully to MongoDB!");
      }
    } catch (error: any) {
      console.error("Failed to save notification preferences:", error);
      showToast("Failed to save notification settings");
    } finally {
      setNotifSaving(false);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res: any = await api.put("/notifications/mark-all-read");
      if (res?.success) {
        showToast("All notifications marked as read!");
        if (res.notifications) setRecentNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Failed to mark notifications read:", error);
    }
  };

  // Security Actions
  const handleSaveSecuritySettings = async () => {
    try {
      setSecSaving(true);
      const res: any = await api.put("/security", securityForm);
      if (res?.success) {
        showToast("Security policies saved successfully to MongoDB!");
      }
    } catch (error: any) {
      console.error("Failed to save security settings:", error);
      showToast("Failed to save security settings");
    } finally {
      setSecSaving(false);
    }
  };

  const handleAddWhitelistedIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpForm.ip) {
      showToast("Please enter a valid IP address!");
      return;
    }

    try {
      setSecSaving(true);
      const res: any = await api.post("/security/ip", newIpForm);
      if (res?.success) {
        showToast(`IP "${newIpForm.ip}" added to whitelist!`);
        setIsAddIpOpen(false);
        setNewIpForm({ ip: "", label: "" });
        loadSecurityFromDB();
      }
    } catch (error: any) {
      console.error("Failed to add IP:", error);
      showToast(error.response?.data?.message || "Failed to add IP");
    } finally {
      setSecSaving(false);
    }
  };

  const handleDeleteWhitelistedIp = async (ipId: string, ipAddr: string) => {
    if (!window.confirm(`Are you sure you want to remove IP address ${ipAddr}?`)) return;

    try {
      const res: any = await api.delete(`/security/ip/${ipId}`);
      if (res?.success) {
        showToast(`IP ${ipAddr} removed from whitelist`);
        loadSecurityFromDB();
      }
    } catch (error) {
      console.error("Failed to delete IP:", error);
      showToast("Failed to remove IP");
    }
  };

  // Roles Handlers
  const selectedRoleObj = rolesList.find((r) => r._id === selectedRoleId) || rolesList[0];

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleForm.name) {
      showToast("Please enter a role name!");
      return;
    }

    try {
      setRoleSaving(true);
      const res: any = await api.post("/roles", {
        name: newRoleForm.name,
        description: newRoleForm.description,
      });

      if (res?.success) {
        showToast(`Role "${newRoleForm.name}" created successfully!`);
        setIsAddRoleOpen(false);
        setNewRoleForm({ name: "", description: "" });
        loadRolesFromDB();
      }
    } catch (error: any) {
      console.error("Failed to create role:", error);
      showToast(error.response?.data?.message || "Failed to create role");
    } finally {
      setRoleSaving(false);
    }
  };

  const handleTogglePermission = (moduleKey: string, permType: "create" | "read" | "update" | "delete") => {
    if (!selectedRoleObj) return;

    const currentPerms = selectedRoleObj.permissions || {};
    const modulePerms = currentPerms[moduleKey] || { create: false, read: false, update: false, delete: false };
    const updatedModule = { ...modulePerms, [permType]: !modulePerms[permType] };

    const updatedPermissions = {
      ...currentPerms,
      [moduleKey]: updatedModule,
    };

    setRolesList((prev) =>
      prev.map((r) => (r._id === selectedRoleObj._id ? { ...r, permissions: updatedPermissions } : r))
    );
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRoleObj) return;

    try {
      setRoleSaving(true);
      const res: any = await api.put(`/roles/${selectedRoleObj._id}`, {
        name: selectedRoleObj.name,
        description: selectedRoleObj.description,
        permissions: selectedRoleObj.permissions,
      });

      if (res?.success) {
        showToast(`Permissions updated for role "${selectedRoleObj.name}" in database!`);
      }
    } catch (error: any) {
      console.error("Failed to save role permissions:", error);
      showToast("Failed to save permissions");
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!window.confirm(`Are you sure you want to delete custom role "${roleName}"?`)) return;

    try {
      const res: any = await api.delete(`/roles/${roleId}`);
      if (res?.success) {
        showToast(`Role "${roleName}" deleted successfully`);
        setSelectedRoleId(null);
        loadRolesFromDB();
      }
    } catch (error: any) {
      console.error("Failed to delete role:", error);
      showToast(error.response?.data?.message || "Failed to delete role");
    }
  };

  // Top Sub-Nav Tabs Config
  const topTabs = [
    { label: "General Settings", icon: <FaCog /> },
    { label: "Account", icon: <FaUser /> },
    { label: "Roles & Permissions", icon: <FaUserShield /> },
    { label: "Automation", icon: <FaBolt /> },
    { label: "Integrations", icon: <FaPlug /> },
    { label: "Notifications", icon: <FaBell /> },
    { label: "Security", icon: <FaShieldAlt /> },
    { label: "Billing", icon: <FaCreditCard /> },
  ];

  // Left Categories Config for General Settings
  const leftCategories = [
    { label: "Company Profile", desc: "Basic information about organization", icon: <FaBuilding /> },
    { label: "System Preferences", desc: "Customize your system behavior", icon: <FaSlidersH /> },
    { label: "Lead & Application", desc: "Configure lead and application settings", icon: <FaWpforms /> },
    { label: "Counselling", desc: "Counselling session preferences", icon: <FaHeadset /> },
    { label: "Admissions", desc: "Admission process configurations", icon: <FaGraduationCap /> },
    { label: "Email & SMS", desc: "Configure email and SMS gateways", icon: <FaEnvelope /> },
    { label: "Document Settings", desc: "Document upload and verification", icon: <FaFileAlt /> },
    { label: "Backup & Restore", desc: "Backup and restore your data", icon: <FaCloudDownloadAlt /> },
    { label: "Audit Logs", desc: "View system activity logs", icon: <FaHistory /> },
  ];

  // Notification Matrix Config Items
  const notifCategoriesConfig = [
    { key: "leads", name: "Leads & Enquiries", desc: "New leads, lead updates and assignments", icon: <FaUsers className="text-[#9333ea]" />, bg: "bg-[#f3e8ff]" },
    { key: "applications", name: "Applications", desc: "Application submitted, updated or rejected", icon: <FaFileAlt className="text-[#0284c7]" />, bg: "bg-[#e0f2fe]" },
    { key: "counselling", name: "Counselling", desc: "New counselling scheduled or rescheduled", icon: <FaHeadset className="text-[#e11d48]" />, bg: "bg-[#ffe4e6]" },
    { key: "admissions", name: "Admissions", desc: "Admission status updates and confirmations", icon: <FaGraduationCap className="text-[#10b981]" />, bg: "bg-[#dcfce7]" },
    { key: "payments", name: "Payments & Fees", desc: "Payment received, failed or refunds", icon: <FaCreditCard className="text-[#d97706]" />, bg: "bg-[#fef3c7]" },
    { key: "tasks", name: "Tasks & Reminders", desc: "Task assigned, due and reminder alerts", icon: <FaClock className="text-[#d97706]" />, bg: "bg-[#fff6e5]" },
    { key: "system", name: "System Alerts", desc: "Important system updates and maintenance", icon: <FaExclamationTriangle className="text-[#e11d48]" />, bg: "bg-[#ffe4e6]" },
    { key: "marketing", name: "Marketing & Campaigns", desc: "Email campaigns and promotional updates", icon: <FaBullhorn className="text-[#9333ea]" />, bg: "bg-[#f3e8ff]" },
  ];

  // Modules list for Roles & Permissions Matrix
  const modulesList = [
    { key: "leads", name: "Leads & Inquiries", desc: "Manage student lead entries and status updates" },
    { key: "applications", name: "Student Applications", desc: "Process course applications and documents" },
    { key: "counselling", name: "Counselling Sessions", desc: "Schedule and manage student counselling" },
    { key: "admissions", name: "Admissions & Allotments", desc: "Confirm university seats and fees" },
    { key: "marketing", name: "Marketing Campaigns", desc: "Ad spend, channels, and campaign metrics" },
    { key: "reports", name: "Reports & Analytics", desc: "View analytics reports and download exports" },
    { key: "users", name: "User Management", desc: "Manage team members, counsellors, and roles" },
    { key: "settings", name: "System Settings", desc: "Company profile and system configurations" },
  ];

  const filteredRoles = rolesList.filter((r) => r.name.toLowerCase().includes(searchRoleQuery.toLowerCase()));

  // Usage meters calculations
  const usage = billingData?.usage || {};
  const leadsPct = Math.round(((usage.leadsUsed || 0) / (usage.leadsLimit || 1)) * 100);
  const usersPct = Math.round(((usage.usersCount || 0) / (usage.usersLimit || 1)) * 100);
  const smsPct = Math.round(((usage.smsCreditsUsed || 0) / (usage.smsCreditsLimit || 1)) * 100);
  const storagePct = Math.round(((usage.storageUsedGB || 0) / (usage.storageLimitGB || 1)) * 100);

  return (
    <div className="space-y-4 pb-12 font-sans text-[#1a1f36] bg-[#f8fafc]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-[#0c1527] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#1a6de1]"
          >
            <FaCheckCircle className="text-[#10b981] text-lg" />
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. HORIZONTAL TOP SUB-NAV BAR                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl p-2 border border-[#e2e8f0] shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
          {topTabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  showToast(`Switched to ${tab.label} tab`);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all relative cursor-pointer ${
                  isActive
                    ? "text-[#6366f1] border-b-2 border-[#6366f1] bg-[#f4f0ff]/60"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                }`}
              >
                <span className="text-[13px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (activeTab === "General Settings") handleSaveGeneralSettings();
            else if (activeTab === "Roles & Permissions") handleSaveRolePermissions();
            else if (activeTab === "Notifications") handleSaveNotificationPreferences();
            else if (activeTab === "Security") handleSaveSecuritySettings();
            else showToast("Settings saved successfully!");
          }}
          disabled={saving || roleSaving || notifSaving || secSaving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[12px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {saving || roleSaving || notifSaving || secSaving ? <FaSync className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
          <span>{saving || roleSaving || notifSaving || secSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. GENERAL SETTINGS VIEW                                      */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "General Settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-white rounded-xl p-3 border border-[#e2e8f0] shadow-xs space-y-1">
            <h3 className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider px-3 py-2">
              Categories
            </h3>
            {leftCategories.map((cat) => {
              const isCatActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                    isCatActive ? "bg-[#f4f0ff] border border-[#e0d7ff]" : "hover:bg-[#f8fafc]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                      isCatActive ? "bg-[#6366f1] text-white" : "bg-[#f1f5f9] text-[#64748b]"
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <span className={`text-[12px] font-bold block ${isCatActive ? "text-[#6366f1]" : "text-[#0f172a]"}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[#64748b] leading-tight block">{cat.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 space-y-4">
            {activeCategory === "Company Profile" && (
              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0f172a]">Company Profile</h3>
                    <p className="text-[11px] text-[#64748b]">Update your organization's core business information</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold">
                    DB Connected
                  </span>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-[#64748b]">
                    <div className="w-6 h-6 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading settings from database...</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveGeneralSettings(); }} className="space-y-3.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Company / Org Name *</label>
                        <input
                          type="text"
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Support Email *</label>
                        <input
                          type="email"
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Official Website</label>
                        <input
                          type="text"
                          value={companyForm.website}
                          onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#334155] mb-1">Headquarters Address</label>
                      <textarea
                        rows={2}
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Industry</label>
                        <input
                          type="text"
                          value={companyForm.industry}
                          onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Country</label>
                        <input
                          type="text"
                          value={companyForm.country}
                          onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-bold text-[#334155] mb-1">Timezone</label>
                        <input
                          type="text"
                          value={companyForm.timeZone}
                          onChange={(e) => setCompanyForm({ ...companyForm, timeZone: e.target.value })}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#6366f1]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[12px] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        {saving ? "Saving..." : "Save Company Profile"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {(activeCategory === "System Preferences" || activeCategory !== "Company Profile") && (
              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
                <div className="border-b border-[#f1f5f9] pb-3">
                  <h3 className="text-[15px] font-bold text-[#0f172a]">System Preferences & Controls</h3>
                  <p className="text-[11px] text-[#64748b]">Configure automation rules, lead scoring and visibility</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "allowDuplicates", label: "Allow Duplicate Lead Submissions", desc: "Permit multiple form submissions with the same phone or email." },
                    { key: "leadScore", label: "Automated Lead Scoring Engine", desc: "Calculate AI lead priority score based on student interactions." },
                    { key: "autoAssign", label: "Auto-Assign Incoming Leads", desc: "Round-robin assignment of leads to online counsellors." },
                    { key: "applicationAutoNum", label: "Auto Application Numbering", desc: "Generate sequential application numbers for students." },
                    { key: "whatsappIntegration", label: "WhatsApp Business Auto-Sync", desc: "Trigger automatic WhatsApp updates on lead status changes." },
                    { key: "dataVisibility", label: "Strict Data Isolation", desc: "Restrict counsellors to viewing only their assigned leads." },
                    { key: "emailNotifications", label: "System Email Alerts", desc: "Send automated email receipts for new applications." },
                    { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily pause public portal form submissions." },
                  ].map((item) => {
                    const key = item.key as keyof typeof toggles;
                    const val = toggles[key];
                    return (
                      <div key={item.key} className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] flex items-center justify-between">
                        <div>
                          <span className="text-[12px] font-bold text-[#0f172a] block">{item.label}</span>
                          <span className="text-[10px] text-[#64748b]">{item.desc}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const newToggles = { ...toggles, [key]: !val };
                            setToggles(newToggles);
                          }}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            val ? "bg-[#6366f1]" : "bg-[#cbd5e1]"
                          }`}
                        >
                          <span
                            className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              val ? "right-0.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={handleSaveGeneralSettings}
                    disabled={saving}
                    className="px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[12px] rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. ACCOUNT TAB VIEW                                           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "Account" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="border-b border-[#f1f5f9] pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0f172a]">Account Profile</h3>
                    <p className="text-[11px] text-[#64748b]">Manage your personal information</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#e0f2fe] text-[#0284c7] text-[10px] font-bold rounded-full">
                    {accountForm.role}
                  </span>
                </div>

                <form onSubmit={handleSaveAccountProfile} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5 pb-3">
                    <div className="relative group flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-[#ffedd5] text-[#ea580c] font-black text-2xl flex items-center justify-center border-2 border-[#fdba74] shadow-md overflow-hidden">
                        {accountForm.avatar ? (
                          <img src={accountForm.avatar} alt={accountForm.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{accountForm.fullName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast("Uploading avatar image...")}
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                    </div>

                    <div className="text-center sm:text-left flex-1">
                      <h4 className="text-[16px] font-black text-[#0f172a] leading-tight">{accountForm.fullName}</h4>
                      <span className="text-[11px] font-bold text-[#6366f1] block">{accountForm.role}</span>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">{accountForm.email}</span>
                      <span className="text-[10px] text-[#94a3b8] block">{accountForm.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={accountForm.fullName}
                        onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#0f172a] focus:outline-none focus:border-[#6366f1]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Email Address</label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#0f172a] focus:outline-none focus:border-[#6366f1]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#0f172a] focus:outline-none focus:border-[#6366f1]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#334155] mb-1">Default Language</label>
                      <select
                        value={accountForm.language}
                        onChange={(e) => setAccountForm({ ...accountForm, language: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#0f172a] focus:outline-none focus:border-[#6366f1] cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[12px] rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save Profile Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="border-b border-[#f1f5f9] pb-3 mb-4">
                  <h3 className="text-[15px] font-bold text-[#0f172a]">Change Password</h3>
                  <p className="text-[11px] text-[#64748b]">Update your password regularly to keep your account secure</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg pl-3 pr-9 py-1.5 text-[12px] focus:outline-none focus:border-[#6366f1]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#334155] cursor-pointer"
                      >
                        {showCurrentPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg pl-3 pr-9 py-1.5 text-[12px] focus:outline-none focus:border-[#6366f1]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#334155] cursor-pointer"
                      >
                        {showNewPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg pl-3 pr-9 py-1.5 text-[12px] focus:outline-none focus:border-[#6366f1]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#334155] cursor-pointer"
                      >
                        {showConfirmPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordUpdating}
                      className="px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[12px] rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {passwordUpdating ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. ROLES & PERMISSIONS TAB VIEW                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "Roles & Permissions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-[#0f172a]">User Roles</h3>
                <button
                  onClick={() => setIsAddRoleOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <FaPlus className="text-[9px]" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="relative mb-3">
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[11px]" />
                <input
                  type="text"
                  value={searchRoleQuery}
                  onChange={(e) => setSearchRoleQuery(e.target.value)}
                  placeholder="Search roles..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-[11px] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-2">
                {filteredRoles.map((role) => {
                  const isSelected = selectedRoleId === role._id;
                  return (
                    <div
                      key={role._id}
                      onClick={() => setSelectedRoleId(role._id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#f4f0ff] border-[#6366f1] shadow-xs"
                          : "bg-[#f8fafc] border-[#f1f5f9] hover:border-[#cbd5e1]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[12px] font-bold ${isSelected ? "text-[#6366f1]" : "text-[#0f172a]"}`}>
                            {role.name}
                          </span>
                          {role.isSystem && (
                            <span className="px-1.5 py-0.2 bg-[#e0f2fe] text-[#0284c7] text-[8px] font-bold rounded flex items-center gap-0.5">
                              <FaCrown className="text-[7px]" /> System
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#64748b] block mt-0.5 leading-tight">{role.description}</span>
                      </div>

                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-[10px] font-bold text-[#64748b] block">{role.userCount || 0} users</span>
                        {!role.isSystem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role._id, role.name);
                            }}
                            className="text-[#ef4444] hover:text-[#dc2626] text-[10px] font-bold mt-1 inline-block"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            {selectedRoleObj ? (
              <>
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-bold text-[#0f172a]">{selectedRoleObj.name} Permissions</h3>
                      {selectedRoleObj.isSystem && (
                        <span className="px-2 py-0.5 bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold rounded">
                          System Default Role
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748b]">{selectedRoleObj.description}</p>
                  </div>

                  <button
                    onClick={handleSaveRolePermissions}
                    disabled={roleSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    {roleSaving ? <FaSync className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                    <span>{roleSaving ? "Saving..." : "Save Permissions"}</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                        <th className="py-2.5 px-3 text-left">Module</th>
                        <th className="py-2.5 px-2">Create</th>
                        <th className="py-2.5 px-2">Read / View</th>
                        <th className="py-2.5 px-2">Update / Edit</th>
                        <th className="py-2.5 px-2">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                      {modulesList.map((m) => {
                        const modulePerms = selectedRoleObj.permissions?.[m.key] || {
                          create: false,
                          read: false,
                          update: false,
                          delete: false,
                        };

                        return (
                          <tr key={m.key} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="py-3 px-3 text-left">
                              <span className="font-bold text-[#0f172a] block">{m.name}</span>
                              <span className="text-[10px] text-[#64748b]">{m.desc}</span>
                            </td>

                            {(["create", "read", "update", "delete"] as const).map((type) => (
                              <td key={type} className="py-3 px-2">
                                <input
                                  type="checkbox"
                                  checked={!!modulePerms[type]}
                                  onChange={() => handleTogglePermission(m.key, type)}
                                  className="w-4 h-4 text-[#6366f1] rounded border-[#cbd5e1] cursor-pointer"
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-[#64748b]">Select a role to view permissions</div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 5. NOTIFICATIONS TAB VIEW                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "Notifications" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0f172a]">Notification Preferences</h3>
                  <p className="text-[11px] text-[#64748b]">Choose what notifications you want to receive and how</p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-[#f4f0ff] border border-[#e0d7ff] rounded-full text-[11px]">
                  <span className="text-[#64748b]">Quiet Hours</span>
                  <span className="font-bold text-[#6366f1]">
                    {dndFrom} - {dndTo}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b]">
                      <th className="py-2.5 px-3 text-left">Notification Categories</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">In-App</th>
                      <th className="py-2.5 px-3">SMS</th>
                      <th className="py-2.5 px-3">Push</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                    {notifCategoriesConfig.map((c) => {
                      const rowState = notifMatrix[c.key] || { email: true, inApp: true, sms: false, push: true };
                      return (
                        <tr key={c.key} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="py-3 px-3 text-left">
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center text-xs flex-shrink-0`}>
                                {c.icon}
                              </div>
                              <div>
                                <span className="font-bold text-[#0f172a] block">{c.name}</span>
                                <span className="text-[10px] text-[#64748b]">{c.desc}</span>
                              </div>
                            </div>
                          </td>

                          {["email", "inApp", "sms", "push"].map((channel) => (
                            <td key={channel} className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() => toggleNotifChannel(c.key, channel)}
                                className={`w-9 h-5 rounded-full transition-colors relative mx-auto block cursor-pointer ${
                                  rowState[channel] ? "bg-[#6366f1]" : "bg-[#cbd5e1]"
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                                    rowState[channel] ? "right-0.5" : "left-0.5"
                                  }`}
                                />
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveNotificationPreferences}
                  disabled={notifSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[12px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  {notifSaving ? <FaSync className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
                  <span>{notifSaving ? "Saving..." : "Save Preferences Matrix"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-[#0f172a]">Recent Notifications</h3>
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="text-[10px] font-bold text-[#6366f1] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Mark all as read <FaCheck className="text-[9px]" />
                  </button>
                </div>

                <div className="space-y-2">
                  {recentNotifications.map((item) => (
                    <div key={item._id || item.title} className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9] flex items-start justify-between text-[11px]">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          <FaUsers />
                        </div>
                        <div>
                          <span className="font-bold text-[#0f172a] block">{item.title}</span>
                          <span className="text-[10px] text-[#64748b] block leading-tight">{item.description}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-[9px] text-[#94a3b8] block">{item.time}</span>
                        {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] inline-block mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-bold text-[#0f172a]">Do Not Disturb</h3>
                  <p className="text-[10px] text-[#64748b]">Pause notifications during quiet hours</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDndToggle(!dndToggle)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    dndToggle ? "bg-[#6366f1]" : "bg-[#cbd5e1]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                      dndToggle ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1">From</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dndFrom}
                      onChange={(e) => setDndFrom(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[11px] font-bold focus:outline-none"
                    />
                    <FaClock className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748b] mb-1">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dndTo}
                      onChange={(e) => setDndTo(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-2.5 py-1.5 text-[11px] font-bold focus:outline-none"
                    />
                    <FaClock className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[10px]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold gap-1 pt-1">
                {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).map((day) => {
                  const isSelected = dndDays[day];
                  return (
                    <button
                      key={day}
                      onClick={() => setDndDays({ ...dndDays, [day]: !isSelected })}
                      className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#6366f1] text-white shadow-xs"
                          : "bg-[#f8fafc] text-[#64748b] border border-[#f1f5f9]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveNotificationPreferences}
                  disabled={notifSaving}
                  className="w-full py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {notifSaving ? "Saving..." : "Save DND Configurations"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 6. SECURITY TAB VIEW                                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "Security" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Security Score</span>
                <span className="text-[20px] font-black text-[#10b981] leading-none">85% High</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#e6f9f0] text-[#10b981] flex items-center justify-center">
                <FaShieldVirus className="text-base" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">2FA Status</span>
                <span className={`text-[15px] font-black ${securityForm.twoFactorEnabled ? "text-[#10b981]" : "text-[#f59e0b]"} leading-none`}>
                  {securityForm.twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#fff6e5] text-[#f59e0b] flex items-center justify-center">
                <FaLock className="text-sm" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">IP Restriction</span>
                <span className="text-[15px] font-black text-[#0284c7] leading-none">
                  {securityForm.ipRestrictionEnabled ? `${whitelistedIps.length} Whitelisted` : "Disabled"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                <FaNetworkWired className="text-sm" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">Login Alerts</span>
                <span className="text-[15px] font-black text-[#9333ea] leading-none">
                  {securityForm.loginAlerts ? "Active" : "Disabled"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center">
                <FaEnvelope className="text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0f172a]">Two-Factor Authentication (2FA)</h3>
                    <p className="text-[11px] text-[#64748b]">Add an extra layer of security to your admin account</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecurityForm({ ...securityForm, twoFactorEnabled: !securityForm.twoFactorEnabled })}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                      securityForm.twoFactorEnabled ? "bg-[#6366f1]" : "bg-[#cbd5e1]"
                    }`}
                  >
                    <span
                      className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        securityForm.twoFactorEnabled ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2 text-[12px]">
                  <label className="block text-[11px] font-bold text-[#334155]">2FA Verification Method</label>
                  <select
                    value={securityForm.twoFactorMethod}
                    onChange={(e) => setSecurityForm({ ...securityForm, twoFactorMethod: e.target.value })}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0f172a] focus:outline-none focus:border-[#6366f1] cursor-pointer"
                  >
                    <option value="Authenticator App">Authenticator App (Google / Authy)</option>
                    <option value="SMS OTP">SMS OTP (+91 Mobile)</option>
                    <option value="Email Verification">Email Verification Code</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-3">
                <div className="border-b border-[#f1f5f9] pb-3">
                  <h3 className="text-[15px] font-bold text-[#0f172a]">Security & Session Policies</h3>
                  <p className="text-[11px] text-[#64748b]">Configure automated login protection rules</p>
                </div>

                <div className="space-y-3 text-[12px]">
                  {[
                    { key: "loginAlerts", label: "Email Alerts on New Login", desc: "Notify admin via email whenever a new device or IP logs in." },
                    { key: "autoLogoutInactive", label: "Auto-Logout Inactive Sessions", desc: "Automatically terminate session after 30 mins of inactivity." },
                    { key: "enforceStrongPassword", label: "Enforce Strong Passwords", desc: "Require min 8 chars, uppercase, digits, and special symbols." },
                  ].map((policy) => {
                    const k = policy.key as keyof typeof securityForm;
                    const val = securityForm[k] as boolean;
                    return (
                      <div key={policy.key} className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] flex items-center justify-between">
                        <div>
                          <span className="text-[12px] font-bold text-[#0f172a] block">{policy.label}</span>
                          <span className="text-[10px] text-[#64748b]">{policy.desc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecurityForm({ ...securityForm, [k]: !val })}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            val ? "bg-[#6366f1]" : "bg-[#cbd5e1]"
                          }`}
                        >
                          <span
                            className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-transform ${
                              val ? "right-0.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveSecuritySettings}
                    disabled={secSaving}
                    className="px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-[12px] rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {secSaving ? "Saving..." : "Save Security Policies"}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-[#0f172a]">IP Whitelisting & Access Control</h3>
                  <p className="text-[11px] text-[#64748b]">Restrict portal login to approved office IP addresses</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddIpOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <FaPlus className="text-[9px]" />
                  <span>Add IP</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3">Network / Label</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                    {whitelistedIps.map((item) => (
                      <tr key={item._id || item.ip} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#0f172a]">{item.ip}</td>
                        <td className="py-3 px-3 text-[#64748b] text-[11px] font-semibold">{item.label}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteWhitelistedIp(item._id, item.ip)}
                            className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors cursor-pointer"
                          >
                            <FaTrash className="text-[11px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 7. BILLING & PRICING TAB VIEW (100% Dynamic & MongoDB Connected) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "Billing" && (
        <div className="space-y-5">
          {/* Active Subscription Overview Card */}
          <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center text-lg font-bold">
                  <FaCreditCard />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-black text-[#0f172a]">{billingData.currentPlan?.name}</h3>
                    <span className="px-2.5 py-0.5 bg-[#dcfce7] text-[#16a34a] text-[10px] font-bold rounded-full">
                      {billingData.currentPlan?.status || "Active"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748b]">
                    {billingData.currentPlan?.price} • {billingData.currentPlan?.billingCycle} • Next renewal on{" "}
                    <span className="font-bold text-[#0f172a]">{billingData.currentPlan?.nextRenewal}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Opening billing management portal...")}
                  className="px-3.5 py-1.5 bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#334155] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Quota Progress Meters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {/* Meter 1: Leads */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b] font-bold">Leads / Inquiries Quota</span>
                  <span className="text-[#0f172a] font-black">{leadsPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, leadsPct)}%` }} className="h-full bg-[#6366f1] rounded-full" />
                </div>
                <span className="text-[10px] text-[#94a3b8] block">
                  {usage.leadsUsed?.toLocaleString()} of {usage.leadsLimit?.toLocaleString()} leads used
                </span>
              </div>

              {/* Meter 2: Team Users */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b] font-bold">Team User Accounts</span>
                  <span className="text-[#0f172a] font-black">{usersPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, usersPct)}%` }} className="h-full bg-[#10b981] rounded-full" />
                </div>
                <span className="text-[10px] text-[#94a3b8] block">
                  {usage.usersCount} of {usage.usersLimit} seats active
                </span>
              </div>

              {/* Meter 3: SMS Credits */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b] font-bold">SMS / WhatsApp Credits</span>
                  <span className="text-[#0f172a] font-black">{smsPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, smsPct)}%` }} className="h-full bg-[#f59e0b] rounded-full" />
                </div>
                <span className="text-[10px] text-[#94a3b8] block">
                  {usage.smsCreditsUsed?.toLocaleString()} of {usage.smsCreditsLimit?.toLocaleString()} credits used
                </span>
              </div>

              {/* Meter 4: Storage */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748b] font-bold">Media & Doc Storage</span>
                  <span className="text-[#0f172a] font-black">{storagePct}%</span>
                </div>
                <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div style={{ width: `${Math.min(100, storagePct)}%` }} className="h-full bg-[#0284c7] rounded-full" />
                </div>
                <span className="text-[10px] text-[#94a3b8] block">
                  {usage.storageUsedGB} GB of {usage.storageLimitGB} GB used
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Plans Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(billingData.plans || []).map((plan: any) => {
              const isCurrent = billingData.currentPlan?.name?.includes(plan.name);
              return (
                <div
                  key={plan.name}
                  className={`bg-white rounded-xl p-5 border shadow-xs flex flex-col justify-between relative transition-all ${
                    isCurrent ? "border-[#6366f1] ring-1 ring-[#6366f1]" : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#f3e8ff] text-[#9333ea] text-[9px] font-bold rounded-full flex items-center gap-1">
                      <FaStar className="text-[8px]" /> Most Popular
                    </span>
                  )}

                  <div>
                    <h4 className="text-[15px] font-bold text-[#0f172a]">{plan.name}</h4>
                    <div className="my-2">
                      <span className="text-[24px] font-black text-[#0f172a] leading-none">{plan.price}</span>
                      <span className="text-[10px] text-[#64748b] ml-1">{plan.billingCycle}</span>
                    </div>

                    <div className="py-2 border-t border-b border-[#f1f5f9] my-3 space-y-1.5 text-[11px]">
                      {(plan.features || []).map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[#334155]">
                          <FaCheck className="text-[#10b981] text-[10px] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgradePlan(plan.name, plan.price)}
                    disabled={isCurrent || planUpgrading}
                    className={`w-full py-2 rounded-lg text-[12px] font-bold transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-[#f1f5f9] text-[#64748b] cursor-default"
                        : "bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-xs"
                    }`}
                  >
                    {isCurrent ? "Active Plan" : planUpgrading ? "Upgrading..." : `Select ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Registered Payment Method & Invoices Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Registered Payment Method Card (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="border-b border-[#f1f5f9] pb-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0f172a]">Payment Method</h3>
                  <p className="text-[10px] text-[#64748b]">Default payment method for recurring billing</p>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0f172a] text-[12px]">
                      {billingData.paymentMethod?.cardBrand}
                    </span>
                    <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold rounded">
                      Default
                    </span>
                  </div>
                  <span className="font-mono text-[13px] text-[#475569] block">
                    •••• •••• •••• {billingData.paymentMethod?.last4}
                  </span>
                  <div className="flex justify-between text-[10px] text-[#94a3b8] pt-1">
                    <span>Expires: {billingData.paymentMethod?.expiry}</span>
                    <span>{billingData.paymentMethod?.holderName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast("Opening Edit Payment Method modal...")}
                className="w-full py-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#cbd5e1] text-[#334155] text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                Update Payment Method →
              </button>
            </div>

            {/* Invoices Table (Span 8) */}
            <div className="lg:col-span-8 bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                <div>
                  <h3 className="text-[14px] font-bold text-[#0f172a]">Billing History & Invoices</h3>
                  <p className="text-[10px] text-[#64748b]">Download past subscription receipts and tax invoices</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Invoice</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-[11px]">
                    {(billingData.invoices || []).map((inv: any) => (
                      <tr key={inv.invoiceId} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0f172a]">{inv.invoiceId}</td>
                        <td className="py-2.5 px-3 text-[#64748b]">{inv.date}</td>
                        <td className="py-2.5 px-3 font-medium text-[#334155]">{inv.description}</td>
                        <td className="py-2.5 px-3 font-bold text-[#0f172a]">{inv.amount}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold rounded">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDownloadInvoice(inv.invoiceId)}
                            className="p-1 text-[#6366f1] hover:bg-[#f4f0ff] rounded transition-colors cursor-pointer"
                          >
                            <FaDownload className="text-xs" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 8. OTHER TABS                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab !== "General Settings" &&
        activeTab !== "Account" &&
        activeTab !== "Roles & Permissions" &&
        activeTab !== "Notifications" &&
        activeTab !== "Security" &&
        activeTab !== "Billing" && (
          <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-xs text-center">
            <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">{activeTab} Settings</h3>
            <p className="text-[12px] text-[#64748b]">Configurations and preferences for {activeTab}.</p>
          </div>
        )}

      {/* MODAL: ADD WHITELISTED IP */}
      <AnimatePresence>
        {isAddIpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e2e8f0]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-4">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Add Whitelisted IP Address</h3>
                <button onClick={() => setIsAddIpOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddWhitelistedIp} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">IP Address *</label>
                  <input
                    type="text"
                    required
                    value={newIpForm.ip}
                    onChange={(e) => setNewIpForm({ ...newIpForm, ip: e.target.value })}
                    placeholder="e.g. 115.248.22.11"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Network / Label</label>
                  <input
                    type="text"
                    value={newIpForm.label}
                    onChange={(e) => setNewIpForm({ ...newIpForm, label: e.target.value })}
                    placeholder="e.g. Branch Office Main Network"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddIpOpen(false)}
                    className="px-4 py-2 text-[12px] font-semibold text-[#64748b] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={secSaving}
                    className="px-5 py-2 text-[12px] font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg cursor-pointer"
                  >
                    {secSaving ? "Adding..." : "Add IP Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD NEW ROLE */}
      <AnimatePresence>
        {isAddRoleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e2e8f0]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] mb-4">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Add Custom Role</h3>
                <button onClick={() => setIsAddRoleOpen(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Role Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoleForm.name}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                    placeholder="e.g. Regional Supervisor"
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newRoleForm.description}
                    onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })}
                    placeholder="Describe the scope and responsibilities of this role..."
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddRoleOpen(false)}
                    className="px-4 py-2 text-[12px] font-semibold text-[#64748b] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={roleSaving}
                    className="px-5 py-2 text-[12px] font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] rounded-lg cursor-pointer"
                  >
                    {roleSaving ? "Creating..." : "Create Role"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
