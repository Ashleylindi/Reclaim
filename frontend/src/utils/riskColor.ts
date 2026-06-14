export function riskColor(score: number): {
  text: string;
  bg: string;
  label: string;
} {
  if (score < 60) {
    return {
      text: 'text-green-400',
      bg: 'bg-green-500/10',
      label: 'Low Risk',
    };
  }

  if (score < 75) {
    return {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      label: 'Moderate Risk',
    };
  }

  return {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    label: 'High Risk',
  };
}
