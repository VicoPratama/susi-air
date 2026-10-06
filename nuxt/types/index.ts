export interface PilotProfile {
  name: string;
  totalFlightHours: number;
  avatarUrl?: string;
  rank?: string;
  base?: string;
}

export interface LimitCardData {
  card: 'Daily' | 'Weekly' | 'Monthly' | 'Annual';
  limit: number;
  current: number;
  window: string;
  percent: number;
}

export interface FlightHoursDataPoint {
  date: string;
  dayLabel: string;
  flightHours: number;
  rollingSum: number;
  isToday: boolean;
}

export interface FlightHoursSummaryResponse {
  range: '1w' | '1m' | '3m' | '6m' | '1y';
  sumWindowDays: number;
  limitLine: number;
  chartYMax: number;
  today: string;
  points: FlightHoursDataPoint[];
  limitCards: {
    daily: { current: number; limit: number; window: string };
    weekly: { current: number; limit: number; window: string };
    monthly: { current: number; limit: number; window: string };
    annual: { current: number; limit: number; window: string };
  };
}

export interface PilotDocument {
  id: string;
  label: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'safe' | 'soon' | 'expired';
}

export interface DocumentsResponse {
  today: string;
  documents: PilotDocument[];
}

export interface ScheduleEntry {
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
}

export interface ScheduleLegendItem {
  code: string;
  label: string;
  color: string;
}

export interface ScheduleResponse {
  today: string;
  year: number;
  month: number;
  schedules: ScheduleEntry[];
  legend: ScheduleLegendItem[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    username: string;
    name: string;
  };
}
