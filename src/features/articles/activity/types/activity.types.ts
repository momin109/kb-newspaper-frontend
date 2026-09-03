export type ActivityDevice = "mobile" | "desktop" | "tablet";

export interface ActivityUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface ActivityLog {
  _id: string;
  user: ActivityUser | null;
  action: string;
  target?: string;
  targetId?: string;
  device: ActivityDevice;
  ip?: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}
