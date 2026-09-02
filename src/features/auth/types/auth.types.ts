/** Matches kb-newspaper-server's User model exactly (models/user.model.js). */
export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  bio?: string | null;
  website?: string | null;
  role: "admin" | "editor" | "journalist" | "subscriber";
  avatar?: string | null;
  isVerified: boolean;
  isBanned: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}
