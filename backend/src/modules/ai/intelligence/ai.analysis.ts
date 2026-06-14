export function buildDashboardPrompt(data: any) {
  return `
You are a recovery support AI.

User risk score: ${data.riskScore}/100
Risk level: ${data.riskLevel}

Recent journal entries:
${data.journals.map((j: any, i: number) => `${i + 1}. "${j.text}"`).join('\n') || 'none'}

Recent moods: ${data.moods.slice(-7).join(', ') || 'none recorded'}

Days sober: ${data.daysSober}

Based on the above, give personalised recovery advice.

Return ONLY JSON:
{
  "summary": "",
  "patterns": "",
  "advice": "",
  "encouragement": ""
}
`;
}
