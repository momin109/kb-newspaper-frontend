export interface SettingsGeneral {
  siteName: string;
  tagline: string;
  description: string;

  logo: {
    url: string;
    public_id: string;
  };

  favicon: {
    url: string;
    public_id: string;
  };

  contactEmail: string;
  contactPhone: string;
  address: string;
  websiteUrl: string;

  language: string;
  timezone: string;
  copyrightText: string;
}

export interface Settings {
  _id: string;
  general: SettingsGeneral;
  createdAt: string;
  updatedAt: string;
}
