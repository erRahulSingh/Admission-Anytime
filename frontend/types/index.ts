export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
  flagImage: string;
  coverImage?: string;
  description: string;
  benefits: string[];
  averageCost: string;
  duration: string;
  fmgePassingRate: string;
  language: string;
  requirements: string[];
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface University {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  country: string | Country; // populated or ID
  tuitionFee: string;
  hostelFee?: string;
  ranking?: string;
  established?: string;
  mediumOfInstruction?: string;
  courseDuration?: string;
  keyHighlights: string[];
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface AdmissionFormLead {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  neetScore: number;
  interestedIn: "India" | "Abroad" | "Both";
  country: string;
  status: "Pending" | "Contacted" | "In Discussion" | "Admitted" | "Closed";
  notes?: string;
  source?: "Website" | "Ads";
  createdAt: string;
}

export interface ContactRequestLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Replied";
  replyMessage?: string;
  createdAt: string;
}

export interface TestimonialModel {
  _id: string;
  name: string;
  university: string;
  country: string;
  rating: number;
  review: string;
  image?: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface ServiceModel {
  _id: string;
  title: string;
  icon: string;
  description: string;
  detailedContent?: string;
  order: number;
  createdAt: string;
}

export interface BlogModel {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  status: "Draft" | "Published";
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  pendingLeads: number;
  contactedLeads: number;
  discussionLeads: number;
  admittedLeads: number;
  totalContacts: number;
  unreadContacts: number;
  totalCountries: number;
  totalUniversities: number;
  totalStudents: number;
}
