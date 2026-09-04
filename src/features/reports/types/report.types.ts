export interface ReportOverview {
  totalViews: number;
  uniqueVisitors: number;
  totalArticles: number;
  totalComments: number;
}

export interface DailyTraffic {
  day: string;
  views: number;
}

export interface DeviceStat {
  device: string;
  count: number;
  percentage: string;
}

export interface PeakHour {
  label: string;
  value: number;
}

export interface TopArticle {
  _id: string;
  title: string;
  views: number;
  category:
    | {
        _id: string;
        name: string;
      }
    | string
    | null;
}
