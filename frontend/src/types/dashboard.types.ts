export type Streak = {
  daysSober: number;
  startDate: string;
};

export type Alert = {
  level: 'low' | 'high' | 'critical' | string;
  message: string;
};

export type Relapse = {
  riskScore: number;
  riskLevel: string;
  alert: Alert;
};

export type AIInsights = {
  summary: string;
  emotionPattern?: string;
  relapseRiskScore?: number;
  encouragement?: string;
  advice?: string;
};

export type DashboardResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };

  streak: Streak;

  relapse: Relapse;

  aiInsights: AIInsights;
};
