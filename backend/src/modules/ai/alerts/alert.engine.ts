export type AlertAction =
  | 'none'
  | 'notify_sponsor'
  | 'notify_emergency_contact';

export interface AlertDecision {
  level: 'low' | 'medium' | 'high' | 'critical';
  action: AlertAction;
  message: string;
}

export function evaluateAlert(riskScore: number): AlertDecision {
  if (riskScore < 60) {
    return {
      level: 'low',
      action: 'none',
      message: 'No intervention needed',
    };
  }

  if (riskScore < 75) {
    return {
      level: 'high',
      action: 'notify_sponsor',
      message: 'Notify sponsor for support check-in',
    };
  }

  return {
    level: 'critical',
    action: 'notify_emergency_contact',
    message: 'Notify emergency contact immediately',
  };
}
