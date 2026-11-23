export type UserRole = 'student' | 'faculty' | 'lab_admin' | 'super_admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  studentOrStaffId?: string;
  token?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Laboratory {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  description: string;
  imageUrl?: string;
  equipmentCount: number;
  status: 'operational' | 'maintenance' | 'restricted';
  utilisation: number;
  location: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  labId: string;
  labName: string;
  totalQuantity: number;
  availableQuantity: number;
  status: 'available' | 'booked' | 'maintenance' | 'reserved';
  specs: string;
  location: string;
  imageUrl?: string;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  startDate: string;
  endDate: string;
  timeSlot: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  projectTitle: string;
  purpose: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  issue: string;
  status: 'reported' | 'in_progress' | 'resolved';
  loggedDate: string;
}

export interface LabShareItem {
  id: string;
  userId: string;
  studentName: string;
  academicYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  branch: string;
  section: string;
  contactNumber: string;
  itemName: string;
  category: 'Lab Coats' | 'Lab Equipment' | 'Electronics Components' | 'Safety Equipment' | 'Lab Accessories' | 'Other';
  description: string;
  condition: 'New' | 'Good' | 'Used';
  sharingType: 'Free Giveaway' | 'Available for Lending' | 'Exchange';
  imageUrl?: string;
  status: 'available' | 'unavailable';
  createdAt: string;
}
