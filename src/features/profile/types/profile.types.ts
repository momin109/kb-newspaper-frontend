// features/profile/types/profile.types.ts

export type UserRole = "admin" | "editor" | "journalist" | "subscriber";

/** Matches kb-newspaper-server's User model (models/user.model.js). */
export interface Profile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  bio: string | null;
  website: string | null;
  role: UserRole;
  avatar: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  address?: string;
  bio?: string;
  website?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "প্রশাসক",
  editor: "সম্পাদক",
  journalist: "সাংবাদিক",
  subscriber: "পাঠক",
};
