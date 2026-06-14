import { apiRequest } from './api';

export type DashboardResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };

  streak: {
    daysSober: number;
    startDate: string;
  };

  relapse: {
    riskScore: number;
    riskLevel: string;
    alert: {
      level: string;
      message: string;
    };
  };

  aiInsights: {
    summary: string;
    emotionPattern?: string;
    relapseRiskScore?: number;
    encouragement?: string;
  };
};

export const dashboardService = {
  getDashboard() {
    return apiRequest<DashboardResponse>('/ai/dashboard');
  },
};
