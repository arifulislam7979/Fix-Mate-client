export type UserRole = "customer" | "technician" | "admin";

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Users {
  id: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isVerified?: boolean;
  phone?: string;
  area?: string;
  bio?: string;
}
export type PaymentStatus = "unpaid" | "paid";

export interface RepairRequestBooking {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  basePrice: number;
  finalAmount: number;
  technicianEmail?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}


export interface IServices {
  _id?: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus?: ApprovalStatus;
  isAvailable?: boolean;
  createdAt?: Date | string;
}


export interface IServiceItem extends IServices {
  _id: string; 
}

export interface Bookings {
  _id?: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerRole: UserRole;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  createdAt?: string;
}

export interface PaymentRecord {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  status: BookingStatus;
  paidAt: string;
}

export interface UpdateProfilePayload {
  name: string;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
}

 export interface BookingRecord {
  _id?: string;
  id?: string;
  serviceTitle?: string;
  serviceName?: string;
  title?: string;
  customerName?: string;
  userName?: string;
  customerEmail?: string;
  technicianEmail?: string;
  assignedTechnicianEmail?: string;
  providerEmail?: string;
  technicianId?: string;
  assignedTechnicianId?: string;
  area?: string;
  location?: string;
  date?: string;
  scheduledDate?: string;
  status?: string;
  amount?: number;
  price?: number;
}

export interface TechnicianBookingItem {
  id: string;
  serviceTitle: string;
  customerName: string;
  area: string;
  date: string;
  status: string;
  amount: number;
}