type Props = {
  riskScore: number;
  riskLevel: string;
};

export default function RiskCard({ riskScore, riskLevel }: Props) {
  const getColor = () => {
    if (riskScore < 60) return 'text-green-400';
    if (riskScore < 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Relapse Risk</h2>

      <p className={`text-3xl font-bold ${getColor()}`}>
        {riskScore}
      </p>

      <p className="text-slate-400 capitalize">
        {riskLevel}
      </p>
    </div>
  );
}
