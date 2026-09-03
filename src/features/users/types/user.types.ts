export type UserRole = "admin" | "editor" | "journalist" | "subscriber";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  bio?: string | null;
  website?: string | null;
  role: UserRole;
  avatar?: string | null;
  isVerified: boolean;
  isBanned: boolean;
  banReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
